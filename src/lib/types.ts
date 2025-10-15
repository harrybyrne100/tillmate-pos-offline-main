// Unified Product type (combines legacy Product and Item)
export interface Product {
  id: string; // Primary key for products store
  name: string; // Product name/description
  price: number; // Price in dollars (for backwards compatibility)
  category: string; // Product category
  sku?: string; // SKU/Item number
  stock?: number; // Inventory level
  image?: string; // Product image URL
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  
  // Helper computed fields
  get priceCents(): number; // Price in cents (price * 100)
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentMethod: 'cash' | 'card' | 'other';
  createdAt: number;
  customerName?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'other';

// Legacy Item type - now mapped to Product
// @deprecated Use Product instead
export interface Item {
  itemNumber: string; // Maps to Product.sku
  description: string; // Maps to Product.name
  unitPriceCents: number; // Maps to Product.price * 100
  thumbnail?: string; // Maps to Product.image
}

export interface Receipt {
  receiptId: string;
  createdAtISO: string;
  dayKey: string;
  totalCents: number;
  customerName?: string;
}

export interface ReceiptItem {
  id: string;
  receiptId: string;
  itemNumber: string;
  description: string;
  unitPriceCents: number;
  dayKey: string;
}
