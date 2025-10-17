import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useBasketStore } from '../basket';
import type { Product } from '@/lib/types';
import * as receiptsDb from '@/db/receipts';
import { mockProduct1, mockProduct2, mockProduct3 } from '@/test/mocks';

// Mock the receipts module
vi.mock('@/db/receipts', () => ({
  createReceipt: vi.fn(),
  listDailySales: vi.fn(),
}));

describe('basket store', () => {
  beforeEach(() => {
    // Reset store state
    useBasketStore.setState({
      basket: [],
      customerName: undefined,
      dailySales: null,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addItem', () => {
    it('adds product to basket', () => {
      const { addItem } = useBasketStore.getState();
      
      addItem(mockProduct1);
      
      expect(useBasketStore.getState().basket).toHaveLength(1);
      expect(useBasketStore.getState().basket[0]).toEqual(mockProduct1);
    });

    it('adds multiple products to basket', () => {
      const { addItem } = useBasketStore.getState();
      
      addItem(mockProduct1);
      addItem(mockProduct2);
      addItem(mockProduct1);
      
      const state = useBasketStore.getState();
      expect(state.basket).toHaveLength(3);
      expect(state.basket[0]).toEqual(mockProduct1);
      expect(state.basket[1]).toEqual(mockProduct2);
      expect(state.basket[2]).toEqual(mockProduct1);
    });

    it('ignores invalid products', () => {
      const { addItem } = useBasketStore.getState();
      
      addItem(null as any);
      addItem(undefined as any);
      addItem({} as Product);
      
      expect(useBasketStore.getState().basket).toHaveLength(0);
    });
  });

  describe('clearEntry', () => {
    it('removes last product from basket', () => {
      const { addItem, clearEntry } = useBasketStore.getState();
      
      addItem(mockProduct1);
      addItem(mockProduct2);
      addItem(mockProduct3);
      
      clearEntry();
      
      const state = useBasketStore.getState();
      expect(state.basket).toHaveLength(2);
      expect(state.basket[0]).toEqual(mockProduct1);
      expect(state.basket[1]).toEqual(mockProduct2);
    });

    it('handles empty basket gracefully', () => {
      const { clearEntry } = useBasketStore.getState();
      
      clearEntry();
      
      expect(useBasketStore.getState().basket).toHaveLength(0);
    });
  });

  describe('cancelAll', () => {
    it('clears entire basket', () => {
      const { addItem, cancelAll } = useBasketStore.getState();
      
      addItem(mockProduct1);
      addItem(mockProduct2);
      addItem(mockProduct3);
      
      cancelAll();
      
      expect(useBasketStore.getState().basket).toHaveLength(0);
      expect(useBasketStore.getState().customerName).toBeUndefined();
    });
  });

  describe('runningTotalCents', () => {
    it('calculates total from basket products', () => {
      const { addItem, runningTotalCents } = useBasketStore.getState();
      
      addItem(mockProduct1);
      addItem(mockProduct2);
      
      expect(runningTotalCents()).toBe(300);
    });

    it('updates when products are added', () => {
      const { addItem, runningTotalCents } = useBasketStore.getState();
      
      expect(runningTotalCents()).toBe(0);
      
      addItem(mockProduct1);
      expect(runningTotalCents()).toBe(100);
      
      addItem(mockProduct2);
      expect(runningTotalCents()).toBe(300);
      
      addItem(mockProduct3);
      expect(runningTotalCents()).toBe(450);
    });

    it('updates when products are removed', () => {
      const { addItem, clearEntry, runningTotalCents } = useBasketStore.getState();
      
      addItem(mockProduct1);
      addItem(mockProduct2);
      addItem(mockProduct3);
      
      expect(runningTotalCents()).toBe(450);
      
      clearEntry();
      expect(runningTotalCents()).toBe(300);
      
      clearEntry();
      expect(runningTotalCents()).toBe(100);
    });

    it('resets to zero after cancelAll', () => {
      const { addItem, cancelAll, runningTotalCents } = useBasketStore.getState();
      
      addItem(mockProduct1);
      addItem(mockProduct2);
      
      expect(runningTotalCents()).toBe(300);
      
      cancelAll();
      expect(runningTotalCents()).toBe(0);
    });
  });

  describe('loadDailySales', () => {
    it('loads daily sales from database', async () => {
      const mockSales = {
        items: [],
        totalCents: 100,
      };

      vi.mocked(receiptsDb.listDailySales).mockResolvedValue(mockSales);

      const { loadDailySales } = useBasketStore.getState();
      await loadDailySales('2025-01-15');

      const state = useBasketStore.getState();
      expect(state.dailySales).toEqual(mockSales);
      expect(receiptsDb.listDailySales).toHaveBeenCalledWith('2025-01-15');
    });

    it('handles database errors gracefully', async () => {
      vi.mocked(receiptsDb.listDailySales).mockRejectedValue(new Error('DB Error'));

      const { loadDailySales } = useBasketStore.getState();
      
      await expect(loadDailySales('2025-01-15')).rejects.toThrow();
      
      const state = useBasketStore.getState();
      expect(state.dailySales).toEqual({ items: [], totalCents: 0 });
    });
  });
});
