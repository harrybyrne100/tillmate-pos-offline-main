import { create } from 'zustand';
import type { Product } from '@/lib/types';
import type { ProductInput } from '@/lib/schemas';
import * as productDB from '@/db/products';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductInput) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productDB.getAllProducts();
      set({ products, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', loading: false });
      console.error('Error fetching products:', error);
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await productDB.addProduct({
        name: product.name,
        price: product.price,
        category: product.category,
        sku: product.sku,
        stock: product.stock,
        image: product.image,
      });
      set((state) => ({ products: [...state.products, newProduct] }));
    } catch (error) {
      set({ error: 'Failed to add product' });
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const updated = await productDB.updateProduct(id, updates);
      if (updated) {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updated : p)),
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update product' });
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await productDB.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete product' });
      console.error('Error deleting product:', error);
      throw error;
    }
  },
}));
