import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Item, Receipt, ReceiptItem } from '@/lib/types';

/**
 * IndexedDB schema for Tillmate v1
 */
interface TillmateDBV1 extends DBSchema {
  items: {
    key: string;
    value: Item;
  };
  receipts: {
    key: string;
    value: Receipt;
    indexes: { dayKey: string };
  };
  receiptItems: {
    key: string;
    value: ReceiptItem;
    indexes: { receiptId: string; dayKey: string };
  };
}

const DB_NAME = 'tillmate_v1';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<TillmateDBV1> | null = null;

/**
 * Get or create database instance
 */
async function getDB(): Promise<IDBPDatabase<TillmateDBV1>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<TillmateDBV1>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Items store
      if (!db.objectStoreNames.contains('items')) {
        db.createObjectStore('items', { keyPath: 'itemNumber' });
      }

      // Receipts store with dayKey index
      if (!db.objectStoreNames.contains('receipts')) {
        const receiptStore = db.createObjectStore('receipts', { keyPath: 'receiptId' });
        receiptStore.createIndex('dayKey', 'dayKey');
      }

      // ReceiptItems store with receiptId and dayKey indexes
      if (!db.objectStoreNames.contains('receiptItems')) {
        const itemStore = db.createObjectStore('receiptItems', { keyPath: 'id' });
        itemStore.createIndex('receiptId', 'receiptId');
        itemStore.createIndex('dayKey', 'dayKey');
      }
    },
  });

  return dbInstance;
}

/**
 * Seed initial items into the database
 * @param items - Array of items to seed
 */
export async function seedItems(items: Item[]): Promise<void> {
  if (!Array.isArray(items)) {
    throw new TypeError('seedItems expects an array of items');
  }

  const db = await getDB();
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');

  for (const item of items) {
    if (!item.itemNumber || typeof item.itemNumber !== 'string') {
      console.warn('Skipping invalid item (missing itemNumber):', item);
      continue;
    }
    
    if (!item.description || typeof item.description !== 'string') {
      console.warn('Skipping invalid item (missing description):', item);
      continue;
    }
    
    if (typeof item.unitPriceCents !== 'number' || item.unitPriceCents < 0) {
      console.warn('Skipping invalid item (invalid price):', item);
      continue;
    }

    await store.put(item);
  }

  await tx.done;
}

/**
 * Create a receipt with its line items atomically
 * @param receipt - Receipt header
 * @param lines - Array of receipt items
 */
export async function createReceipt(receipt: Receipt, lines: ReceiptItem[]): Promise<void> {
  if (!receipt || typeof receipt !== 'object') {
    throw new TypeError('createReceipt expects a receipt object');
  }
  
  if (!Array.isArray(lines)) {
    throw new TypeError('createReceipt expects an array of receipt items');
  }

  // Validate receipt
  if (!receipt.receiptId || typeof receipt.receiptId !== 'string') {
    throw new Error('Receipt must have a valid receiptId');
  }
  
  if (!receipt.createdAtISO || typeof receipt.createdAtISO !== 'string') {
    throw new Error('Receipt must have a valid createdAtISO');
  }
  
  if (!receipt.dayKey || typeof receipt.dayKey !== 'string') {
    throw new Error('Receipt must have a valid dayKey');
  }
  
  if (typeof receipt.totalCents !== 'number' || receipt.totalCents < 0) {
    throw new Error('Receipt must have a valid totalCents');
  }

  // Validate all line items
  for (const line of lines) {
    if (!line.id || typeof line.id !== 'string') {
      throw new Error('Receipt item must have a valid id');
    }
    
    if (line.receiptId !== receipt.receiptId) {
      throw new Error('Receipt item receiptId must match receipt');
    }
    
    if (!line.itemNumber || typeof line.itemNumber !== 'string') {
      throw new Error('Receipt item must have a valid itemNumber');
    }
    
    if (!line.description || typeof line.description !== 'string') {
      throw new Error('Receipt item must have a valid description');
    }
    
    if (typeof line.unitPriceCents !== 'number' || line.unitPriceCents < 0) {
      throw new Error('Receipt item must have a valid unitPriceCents');
    }
    
    if (line.dayKey !== receipt.dayKey) {
      throw new Error('Receipt item dayKey must match receipt');
    }
  }

  const db = await getDB();
  const tx = db.transaction(['receipts', 'receiptItems'], 'readwrite');

  try {
    // Store receipt
    await tx.objectStore('receipts').add(receipt);

    // Store all line items
    const itemStore = tx.objectStore('receiptItems');
    for (const line of lines) {
      await itemStore.add(line);
    }

    await tx.done;
  } catch (error) {
    console.error('Failed to create receipt:', error);
    throw new Error('Failed to create receipt: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * List all sales for a specific day
 * @param dayKey - Day key in YYYY-MM-DD format
 * @returns Object with items array and total cents
 */
export async function listDailySales(dayKey: string): Promise<{ items: ReceiptItem[]; totalCents: number }> {
  if (!dayKey || typeof dayKey !== 'string') {
    throw new TypeError('listDailySales expects a valid dayKey string');
  }

  // Validate dayKey format (YYYY-MM-DD)
  const dayKeyRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dayKeyRegex.test(dayKey)) {
    throw new Error('dayKey must be in YYYY-MM-DD format');
  }

  const db = await getDB();

  try {
    // Get all receipt items for the day
    const items = await db.getAllFromIndex('receiptItems', 'dayKey', dayKey);

    // Calculate total from items
    const totalCents = items.reduce((sum, item) => sum + item.unitPriceCents, 0);

    return {
      items,
      totalCents,
    };
  } catch (error) {
    console.error('Failed to list daily sales:', error);
    return {
      items: [],
      totalCents: 0,
    };
  }
}

/**
 * Clear all data from the database and optionally re-seed items
 * @param seedData - Optional array of items to seed after clearing
 */
export async function clearAll(seedData?: Item[]): Promise<void> {
  try {
    // Close existing connection
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }

    // Delete the database
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete database'));
      request.onblocked = () => {
        console.warn('Database deletion blocked. Close all tabs using this database.');
        reject(new Error('Database deletion blocked'));
      };
    });

    // Re-create the database (will trigger upgrade)
    dbInstance = null;
    await getDB();

    // Seed items if provided
    if (seedData && Array.isArray(seedData) && seedData.length > 0) {
      await seedItems(seedData);
    }
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw new Error('Failed to clear database: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Get all items from the database
 */
export async function getAllItems(): Promise<Item[]> {
  const db = await getDB();
  try {
    return await db.getAll('items');
  } catch (error) {
    console.error('Failed to get all items:', error);
    return [];
  }
}

/**
 * Get a single item by item number
 */
export async function getItem(itemNumber: string): Promise<Item | undefined> {
  if (!itemNumber || typeof itemNumber !== 'string') {
    return undefined;
  }

  const db = await getDB();
  try {
    return await db.get('items', itemNumber);
  } catch (error) {
    console.error('Failed to get item:', error);
    return undefined;
  }
}

/**
 * Get all receipts for a specific day
 */
export async function getReceiptsByDay(dayKey: string): Promise<Receipt[]> {
  if (!dayKey || typeof dayKey !== 'string') {
    throw new TypeError('getReceiptsByDay expects a valid dayKey string');
  }

  const db = await getDB();
  try {
    return await db.getAllFromIndex('receipts', 'dayKey', dayKey);
  } catch (error) {
    console.error('Failed to get receipts:', error);
    return [];
  }
}

/**
 * Get all items for a specific receipt
 */
export async function getReceiptItems(receiptId: string): Promise<ReceiptItem[]> {
  if (!receiptId || typeof receiptId !== 'string') {
    throw new TypeError('getReceiptItems expects a valid receiptId string');
  }

  const db = await getDB();
  try {
    return await db.getAllFromIndex('receiptItems', 'receiptId', receiptId);
  } catch (error) {
    console.error('Failed to get receipt items:', error);
    return [];
  }
}
