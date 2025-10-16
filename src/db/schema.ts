import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Product, Sale, Receipt, ReceiptItem } from '@/lib/types';

interface TillmateDB extends DBSchema {
  products: {
    key: string;
    value: Product;
    indexes: { 'by-category': string; 'by-name': string; 'by-sku': string };
  };
  sales: {
    key: string;
    value: Sale;
    indexes: { 'by-date': number };
  };
  receipts: {
    key: string;
    value: Receipt;
    indexes: { 'by-dayKey': string };
  };
  receiptItems: {
    key: string;
    value: ReceiptItem;
    indexes: { 'by-receiptId': string; 'by-dayKey': string };
  };
}

const DB_NAME = 'tillmate-db';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<TillmateDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<TillmateDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<TillmateDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('by-category', 'category');
        productStore.createIndex('by-name', 'name');
        productStore.createIndex('by-sku', 'sku');
      }

      // Sales store (legacy)
      if (!db.objectStoreNames.contains('sales')) {
        const saleStore = db.createObjectStore('sales', { keyPath: 'id' });
        saleStore.createIndex('by-date', 'createdAt');
      }

      // Receipts store
      if (!db.objectStoreNames.contains('receipts')) {
        const receiptStore = db.createObjectStore('receipts', { keyPath: 'receiptId' });
        receiptStore.createIndex('by-dayKey', 'dayKey');
      }

      // Receipt Items store
      if (!db.objectStoreNames.contains('receiptItems')) {
        const itemStore = db.createObjectStore('receiptItems', { keyPath: 'id' });
        itemStore.createIndex('by-receiptId', 'receiptId');
        itemStore.createIndex('by-dayKey', 'dayKey');
      }
    },
  });

  return dbInstance;
}
