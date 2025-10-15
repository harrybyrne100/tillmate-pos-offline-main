import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  image: z.string().url().optional().or(z.literal('')),
});

export const saleSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    price: z.number(),
    quantity: z.number().int().min(1),
  })).min(1, 'Sale must have at least one item'),
  total: z.number().min(0),
  paymentMethod: z.enum(['cash', 'card', 'other']),
  customerName: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type SaleInput = z.infer<typeof saleSchema>;
