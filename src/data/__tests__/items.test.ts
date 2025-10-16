import { describe, it, expect } from 'vitest';
import { sampleProducts } from '../items';

describe('sampleProducts', () => {
  it('contains 12-18 products', () => {
    expect(sampleProducts.length).toBeGreaterThanOrEqual(12);
    expect(sampleProducts.length).toBeLessThanOrEqual(18);
  });

  it('has valid product structure', () => {
    for (const product of sampleProducts) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('sku');
      
      expect(typeof product.id).toBe('string');
      expect(typeof product.name).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(typeof product.category).toBe('string');
      
      expect(product.id.length).toBeGreaterThan(0);
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.price).toBeGreaterThan(0);
    }
  });

  it('has unique product IDs', () => {
    const ids = sampleProducts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has unique SKUs', () => {
    const skus = sampleProducts.map(p => p.sku).filter(Boolean);
    const uniqueSkus = new Set(skus);
    expect(uniqueSkus.size).toBe(skus.length);
  });

  it('has prices in valid range', () => {
    for (const product of sampleProducts) {
      expect(product.price).toBeGreaterThan(0);
      expect(product.price).toBeLessThanOrEqual(10);
      expect(product.priceCents).toBeGreaterThan(0);
      expect(product.priceCents).toBeLessThanOrEqual(1000);
    }
  });

  it('contains beverages and bakery products', () => {
    const beverages = sampleProducts.filter(p => p.category === 'Beverages');
    const bakery = sampleProducts.filter(p => p.category === 'Bakery');
    
    expect(beverages.length).toBeGreaterThan(0);
    expect(bakery.length).toBeGreaterThan(0);
  });

  it('has SKUs in expected format', () => {
    for (const product of sampleProducts) {
      if (product.sku) {
        expect(product.sku).toMatch(/^[A-Z]{3}-\d{3}$/);
      }
    }
  });
});
