import type { Product } from '@/lib/types';

/**
 * Sample products for Tillmate POS
 * Converted from legacy Item format to unified Product format
 */
export const sampleProducts: Product[] = [
  // Coffee & Espresso
  {
    id: 'prod-bev-001',
    sku: 'BEV-001',
    name: 'Espresso',
    price: 2.50,
    category: 'Beverages',
    stock: 999,
    image: '/images/coffee.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bev-002',
    sku: 'BEV-002',
    name: 'Americano',
    price: 3.00,
    category: 'Beverages',
    stock: 999,
    image: '/images/coffee.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bev-003',
    sku: 'BEV-003',
    name: 'Cappuccino',
    price: 3.50,
    category: 'Beverages',
    stock: 999,
    image: '/images/coffee.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bev-004',
    sku: 'BEV-004',
    name: 'Latte',
    price: 3.50,
    category: 'Beverages',
    stock: 999,
    image: '/images/coffee.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bev-005',
    sku: 'BEV-005',
    name: 'Flat White',
    price: 3.80,
    category: 'Beverages',
    stock: 999,
    image: '/images/coffee.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bev-006',
    sku: 'BEV-006',
    name: 'Mocha',
    price: 4.00,
    category: 'Beverages',
    stock: 999,
    image: '/images/coffee.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bev-007',
    sku: 'BEV-007',
    name: 'Iced Coffee',
    price: 3.50,
    category: 'Beverages',
    stock: 999,
    image: '/images/coffee.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bev-008',
    sku: 'BEV-008',
    name: 'Hot Chocolate',
    price: 3.80,
    category: 'Beverages',
    stock: 999,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  
  // Bakery
  {
    id: 'prod-bak-001',
    sku: 'BAK-001',
    name: 'Croissant',
    price: 2.50,
    category: 'Bakery',
    stock: 999,
    image: '/images/croissant.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bak-002',
    sku: 'BAK-002',
    name: 'Pain au Chocolat',
    price: 2.80,
    category: 'Bakery',
    stock: 999,
    image: '/images/croissant.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bak-003',
    sku: 'BAK-003',
    name: 'Blueberry Muffin',
    price: 3.20,
    category: 'Bakery',
    stock: 999,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bak-004',
    sku: 'BAK-004',
    name: 'Cinnamon Roll',
    price: 3.50,
    category: 'Bakery',
    stock: 999,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bak-005',
    sku: 'BAK-005',
    name: 'Almond Croissant',
    price: 3.20,
    category: 'Bakery',
    stock: 999,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bak-006',
    sku: 'BAK-006',
    name: 'Chocolate Chip Cookie',
    price: 2.00,
    category: 'Bakery',
    stock: 999,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bak-007',
    sku: 'BAK-007',
    name: 'Banana Bread Slice',
    price: 2.80,
    category: 'Bakery',
    stock: 999,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-bak-008',
    sku: 'BAK-008',
    name: 'Bagel',
    price: 2.50,
    category: 'Bakery',
    stock: 999,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  
  // Food
  {
    id: 'prod-foo-001',
    sku: 'FOO-001',
    name: 'Ham & Cheese Sandwich',
    price: 5.50,
    category: 'Food',
    stock: 999,
    image: '/images/sandwich.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-foo-002',
    sku: 'FOO-002',
    name: 'Turkey Club Sandwich',
    price: 6.50,
    category: 'Food',
    stock: 999,
    image: '/images/sandwich.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  
  // Juices & Cold Drinks
  {
    id: 'prod-jui-001',
    sku: 'JUI-001',
    name: 'Orange Juice',
    price: 3.50,
    category: 'Beverages',
    stock: 999,
    image: '/images/juice.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
  {
    id: 'prod-jui-002',
    sku: 'JUI-002',
    name: 'Apple Juice',
    price: 3.50,
    category: 'Beverages',
    stock: 999,
    image: '/images/juice.jpg',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    get priceCents() { return Math.round(this.price * 100); }
  },
];
