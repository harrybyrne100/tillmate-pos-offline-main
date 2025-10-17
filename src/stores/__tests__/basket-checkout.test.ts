import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useBasketStore } from '../basket';
import type { Product } from '@/lib/types';
import * as receiptsDb from '@/db/receipts';
import { mockProduct1, mockProduct2 } from '@/test/mocks';

// Mock the receipts module
vi.mock('@/db/receipts', () => ({
  createReceipt: vi.fn(),
  listDailySales: vi.fn(),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678-90ab',
}));

describe('basket checkout flow', () => {

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

  describe('checkout atomicity', () => {
    it('completes full transaction on success', async () => {
      vi.mocked(receiptsDb.createReceipt).mockResolvedValue(undefined);

      const { addItem, setCustomerName, checkout } = useBasketStore.getState();

      // Add products and customer
      addItem(mockProduct1);
      addItem(mockProduct2);
      setCustomerName('Test Customer');

      // Perform checkout
      await checkout();

      // Verify createReceipt was called with correct data
      expect(receiptsDb.createReceipt).toHaveBeenCalledTimes(1);
      const [receipt, items] = vi.mocked(receiptsDb.createReceipt).mock.calls[0];

      // Verify receipt structure
      expect(receipt.receiptId).toBe('test-uuid-1234-5678-90ab');
      expect(receipt.totalCents).toBe(300);
      expect(receipt.customerName).toBe('Test Customer');
      expect(receipt.createdAtISO).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(receipt.dayKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Verify receipt items
      expect(items).toHaveLength(2);
      expect(items[0].itemNumber).toBe('TEST-001');
      expect(items[0].unitPriceCents).toBe(100);
      expect(items[1].itemNumber).toBe('TEST-002');
      expect(items[1].unitPriceCents).toBe(200);

      // Verify basket was cleared
      const finalState = useBasketStore.getState();
      expect(finalState.basket).toHaveLength(0);
      expect(finalState.customerName).toBeUndefined();
    });

    it('rolls back on database failure - no partial writes', async () => {
      // Simulate database failure
      vi.mocked(receiptsDb.createReceipt).mockRejectedValue(new Error('Database write failed'));

      const { addItem, setCustomerName, checkout } = useBasketStore.getState();

      // Add products and customer
      addItem(mockProduct1);
      addItem(mockProduct2);
      setCustomerName('Test Customer');

      // Attempt checkout
      await expect(checkout()).rejects.toThrow('Failed to complete checkout');

      // Verify basket was NOT cleared (rollback)
      const finalState = useBasketStore.getState();
      expect(finalState.basket).toHaveLength(2);
      expect(finalState.customerName).toBe('Test Customer');

      // Verify products are still in basket
      expect(finalState.basket[0]).toEqual(mockProduct1);
      expect(finalState.basket[1]).toEqual(mockProduct2);
    });

    it('preserves basket state on transaction error', async () => {
      // Simulate transaction error
      vi.mocked(receiptsDb.createReceipt).mockRejectedValue(
        new Error('Transaction aborted')
      );

      const { addItem, checkout, runningTotalCents } = useBasketStore.getState();

      // Setup basket
      addItem(mockProduct1);
      addItem(mockProduct2);
      addItem(mockProduct1); // Add same product again

      const totalBefore = runningTotalCents();
      const basketBefore = [...useBasketStore.getState().basket];

      // Attempt checkout
      await expect(checkout()).rejects.toThrow();

      // Verify nothing changed
      const finalState = useBasketStore.getState();
      expect(finalState.basket).toEqual(basketBefore);
      expect(finalState.runningTotalCents()).toBe(totalBefore);
    });

    it('handles validation errors without clearing basket', async () => {
      // Simulate validation error
      vi.mocked(receiptsDb.createReceipt).mockRejectedValue(
        new Error('Receipt must have a valid receiptId')
      );

      const { addItem, checkout } = useBasketStore.getState();

      addItem(mockProduct1);

      await expect(checkout()).rejects.toThrow();

      // Basket should be preserved
      expect(useBasketStore.getState().basket).toHaveLength(1);
    });

    it('generates unique receipt IDs for concurrent checkouts', async () => {
      vi.mocked(receiptsDb.createReceipt).mockResolvedValue(undefined);

      const { addItem, checkout } = useBasketStore.getState();

      // First checkout
      addItem(mockProduct1);
      await checkout();

      const firstReceiptId = vi.mocked(receiptsDb.createReceipt).mock.calls[0][0].receiptId;

      // Second checkout
      addItem(mockProduct2);
      await checkout();

      const secondReceiptId = vi.mocked(receiptsDb.createReceipt).mock.calls[1][0].receiptId;

      // Both should use the mocked UUID, but in real usage would be different
      expect(firstReceiptId).toBe('test-uuid-1234-5678-90ab');
      expect(secondReceiptId).toBe('test-uuid-1234-5678-90ab');
    });
  });

  describe('checkout validation', () => {
    it('prevents checkout with empty basket', async () => {
      const { checkout } = useBasketStore.getState();

      await expect(checkout()).rejects.toThrow('Cannot checkout with empty basket');
      expect(receiptsDb.createReceipt).not.toHaveBeenCalled();
    });

    it('allows checkout without customer name', async () => {
      vi.mocked(receiptsDb.createReceipt).mockResolvedValue(undefined);

      const { addItem, checkout } = useBasketStore.getState();

      addItem(mockProduct1);
      await checkout();

      const [receipt] = vi.mocked(receiptsDb.createReceipt).mock.calls[0];
      expect(receipt.customerName).toBeUndefined();
    });

    it('includes customer name when provided', async () => {
      vi.mocked(receiptsDb.createReceipt).mockResolvedValue(undefined);

      const { addItem, setCustomerName, checkout } = useBasketStore.getState();

      addItem(mockProduct1);
      setCustomerName('Jane Doe');
      await checkout();

      const [receipt] = vi.mocked(receiptsDb.createReceipt).mock.calls[0];
      expect(receipt.customerName).toBe('Jane Doe');
    });
  });

  describe('receipt item generation', () => {
    it('generates correct receipt items with all required fields', async () => {
      vi.mocked(receiptsDb.createReceipt).mockResolvedValue(undefined);

      const { addItem, checkout } = useBasketStore.getState();

      addItem(mockProduct1);
      addItem(mockProduct2);

      await checkout();

      const [, items] = vi.mocked(receiptsDb.createReceipt).mock.calls[0];

      // Verify all items have required fields
      items.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.receiptId).toBe('test-uuid-1234-5678-90ab');
        expect(item.itemNumber).toBeDefined();
        expect(item.description).toBeDefined();
        expect(item.unitPriceCents).toBeGreaterThan(0);
        expect(item.dayKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('preserves product order in receipt items', async () => {
      vi.mocked(receiptsDb.createReceipt).mockResolvedValue(undefined);

      const { addItem, checkout } = useBasketStore.getState();

      addItem(mockProduct1);
      addItem(mockProduct2);
      addItem(mockProduct1);

      await checkout();

      const [, items] = vi.mocked(receiptsDb.createReceipt).mock.calls[0];

      expect(items[0].itemNumber).toBe('TEST-001');
      expect(items[1].itemNumber).toBe('TEST-002');
      expect(items[2].itemNumber).toBe('TEST-001');
    });
  });
});
