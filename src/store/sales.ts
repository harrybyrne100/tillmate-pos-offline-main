import { create } from 'zustand';
import type { Sale } from '@/lib/types';
import * as salesDB from '@/db/sales';

interface SalesStore {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<Sale>;
  deleteSale: (id: string) => Promise<void>;
  getTodaysSales: () => Promise<Sale[]>;
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  loading: false,
  error: null,

  fetchSales: async () => {
    set({ loading: true, error: null });
    try {
      const sales = await salesDB.getAllSales();
      set({ sales, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch sales', loading: false });
      console.error('Error fetching sales:', error);
    }
  },

  addSale: async (sale) => {
    try {
      const newSale = await salesDB.addSale(sale);
      set((state) => ({ sales: [newSale, ...state.sales] }));
      return newSale;
    } catch (error) {
      set({ error: 'Failed to add sale' });
      console.error('Error adding sale:', error);
      throw error;
    }
  },

  deleteSale: async (id) => {
    try {
      await salesDB.deleteSale(id);
      set((state) => ({
        sales: state.sales.filter((s) => s.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete sale' });
      console.error('Error deleting sale:', error);
      throw error;
    }
  },

  getTodaysSales: async () => {
    try {
      const sales = await salesDB.getTodaysSales();
      return sales;
    } catch (error) {
      console.error('Error fetching today\'s sales:', error);
      return [];
    }
  },
}));
