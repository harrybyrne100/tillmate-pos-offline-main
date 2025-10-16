import { getDB } from './schema';
import type { Receipt, ReceiptItem } from '@/lib/types';

/**
 * Create a receipt with its line items atomically
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
 */
export async function listDailySales(dayKey: string): Promise<{ items: ReceiptItem[]; totalCents: number }> {
  if (!dayKey || typeof dayKey !== 'string') {
    throw new TypeError('listDailySales expects a valid dayKey string');
  }

  const dayKeyRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dayKeyRegex.test(dayKey)) {
    throw new Error('dayKey must be in YYYY-MM-DD format');
  }

  const db = await getDB();

  try {
    const items = await db.getAllFromIndex('receiptItems', 'by-dayKey', dayKey);
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
 * Get all receipts for a specific day
 */
export async function getReceiptsByDay(dayKey: string): Promise<Receipt[]> {
  if (!dayKey || typeof dayKey !== 'string') {
    throw new TypeError('getReceiptsByDay expects a valid dayKey string');
  }

  const db = await getDB();
  try {
    return await db.getAllFromIndex('receipts', 'by-dayKey', dayKey);
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
    return await db.getAllFromIndex('receiptItems', 'by-receiptId', receiptId);
  } catch (error) {
    console.error('Failed to get receipt items:', error);
    return [];
  }
}

/**
 * Get all receipts
 */
export async function getAllReceipts(): Promise<Receipt[]> {
  const db = await getDB();
  try {
    const receipts = await db.getAll('receipts');
    return receipts.sort((a, b) => 
      new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime()
    );
  } catch (error) {
    console.error('Failed to get all receipts:', error);
    return [];
  }
}
