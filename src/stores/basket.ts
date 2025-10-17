import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Product, Receipt, ReceiptItem } from '@/lib/types';
import { dayKeyOf } from '@/lib/money';
import { createReceipt, listDailySales } from '@/db/receipts';

interface DailySales {
  items: ReceiptItem[];
  totalCents: number;
}

interface BasketStore {
  // State
  basket: Product[];
  customerName?: string;
  dailySales: DailySales | null;
  
  // Derived state
  runningTotalCents: () => number;
  
  // Actions
  addItem: (product: Product) => void;
  clearEntry: () => void;
  cancelAll: () => void;
  setCustomerName: (name?: string) => void;
  checkout: () => Promise<void>;
  loadDailySales: (dayKey?: string) => Promise<void>;
}

export const useBasketStore = create<BasketStore>((set, get) => ({
  // Initial state
  basket: [],
  customerName: undefined,
  dailySales: null,

  // Derived state
  runningTotalCents: () => {
    const { basket } = get();
    return basket.reduce((sum, product) => sum + product.priceCents, 0);
  },

  // Add product to basket
  addItem: (product) => {
    if (!product || typeof product !== 'object') {
      console.warn('Invalid product provided to addItem');
      return;
    }
    
    if (!product.id || !product.name || typeof product.price !== 'number') {
      console.warn('Product missing required fields:', product);
      return;
    }

    set((state) => ({
      basket: [...state.basket, product],
    }));
  },

  // Remove last item from basket
  clearEntry: () => {
    set((state) => {
      if (state.basket.length === 0) {
        return state;
      }
      return {
        basket: state.basket.slice(0, -1),
      };
    });
  },

  // Clear entire basket
  cancelAll: () => {
    set({
      basket: [],
      customerName: undefined,
    });
  },

  // Set customer name
  setCustomerName: (name) => {
    set({
      customerName: name && name.trim() ? name.trim() : undefined,
    });
  },

  // Checkout and save receipt
  checkout: async () => {
    const { basket, customerName, runningTotalCents } = get();
    
    if (basket.length === 0) {
      throw new Error('Cannot checkout with empty basket');
    }

    const total = runningTotalCents();
    const now = new Date();
    const receiptId = uuidv4();
    const dayKey = dayKeyOf(now);

    // Create receipt
    const receipt: Receipt = {
      receiptId,
      createdAtISO: now.toISOString(),
      dayKey,
      totalCents: total,
      customerName,
    };

    // Create receipt items
    const receiptItems: ReceiptItem[] = basket.map((product, index) => ({
      id: `${receiptId}-${index}`,
      receiptId,
      itemNumber: product.sku || product.id,
      description: product.name,
      unitPriceCents: product.priceCents,
      dayKey,
    }));

    try {
      // Atomically save receipt and items
      await createReceipt(receipt, receiptItems);

      // Clear basket after successful checkout
      set({
        basket: [],
        customerName: undefined,
      });
    } catch (error) {
      console.error('Checkout failed:', error);
      throw new Error('Failed to complete checkout: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  },

  // Load daily sales
  loadDailySales: async (dayKey) => {
    const key = dayKey || dayKeyOf();
    
    try {
      const sales = await listDailySales(key);
      set({ dailySales: sales });
    } catch (error) {
      console.error('Failed to load daily sales:', error);
      set({ dailySales: { items: [], totalCents: 0 } });
      throw error;
    }
  },
}));
