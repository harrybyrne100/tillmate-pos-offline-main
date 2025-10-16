import { getDB } from './schema';
import type { Sale } from '@/lib/types';

export async function getAllSales(): Promise<Sale[]> {
  const db = await getDB();
  const sales = await db.getAll('sales');
  return sales.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSale(id: string): Promise<Sale | undefined> {
  const db = await getDB();
  return db.get('sales', id);
}

export async function addSale(sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale> {
  const db = await getDB();
  const newSale: Sale = {
    ...sale,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  await db.add('sales', newSale);
  return newSale;
}

export async function deleteSale(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('sales', id);
}

export async function getSalesByDateRange(start: number, end: number): Promise<Sale[]> {
  const db = await getDB();
  const sales = await db.getAllFromIndex('sales', 'by-date', IDBKeyRange.bound(start, end));
  return sales.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getTodaysSales(): Promise<Sale[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return getSalesByDateRange(start.getTime(), end.getTime());
}
