import { create } from 'zustand';
import type { Receipt, ReceiptItem } from '@/lib/types';
import * as receiptsDB from '@/db/receipts';

interface ReceiptsStore {
  receipts: Receipt[];
  loading: boolean;
  error: string | null;
  fetchReceipts: () => Promise<void>;
  getTodaysReceipts: () => Promise<Receipt[]>;
  getReceiptsByDay: (dayKey: string) => Promise<Receipt[]>;
  getReceiptItems: (receiptId: string) => Promise<ReceiptItem[]>;
}

export const useReceiptsStore = create<ReceiptsStore>((set, get) => ({
  receipts: [],
  loading: false,
  error: null,

  fetchReceipts: async () => {
    set({ loading: true, error: null });
    try {
      const receipts = await receiptsDB.getAllReceipts();
      set({ receipts, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch receipts', loading: false });
      console.error('Error fetching receipts:', error);
    }
  },

  getTodaysReceipts: async () => {
    const today = new Date();
    const dayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    try {
      return await receiptsDB.getReceiptsByDay(dayKey);
    } catch (error) {
      console.error('Error fetching today\'s receipts:', error);
      return [];
    }
  },

  getReceiptsByDay: async (dayKey: string) => {
    try {
      return await receiptsDB.getReceiptsByDay(dayKey);
    } catch (error) {
      console.error('Error fetching receipts by day:', error);
      return [];
    }
  },

  getReceiptItems: async (receiptId: string) => {
    try {
      return await receiptsDB.getReceiptItems(receiptId);
    } catch (error) {
      console.error('Error fetching receipt items:', error);
      return [];
    }
  },
}));
