import { getDB } from './schema';
import type { Product } from '@/lib/types';

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDB();
  return db.getAll('products');
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const db = await getDB();
  return db.get('products', id);
}

export async function addProduct(product: { name: string; price: number; category: string; sku?: string; stock?: number; image?: string }): Promise<Product> {
  const db = await getDB();
  const now = Date.now();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    get priceCents() { return Math.round(this.price * 100); }
  };
  await db.add('products', newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
  const db = await getDB();
  const existing = await db.get('products', id);
  if (!existing) return undefined;

  const updated: Product = {
    ...existing,
    ...updates,
    id,
    updatedAt: Date.now(),
  };
  await db.put('products', updated);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('products', id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const db = await getDB();
  return db.getAllFromIndex('products', 'by-category', category);
}

export async function getProductBySku(sku: string): Promise<Product | undefined> {
  const db = await getDB();
  const products = await db.getAllFromIndex('products', 'by-sku', sku);
  return products[0];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const db = await getDB();
  const all = await db.getAll('products');
  const lowerQuery = query.toLowerCase();
  return all.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.sku?.toLowerCase().includes(lowerQuery)
  );
}
