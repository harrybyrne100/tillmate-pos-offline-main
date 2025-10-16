import { addProduct } from './products';

export async function seedDatabase() {
  const sampleProducts = [
    { name: 'Espresso', price: 3.50, category: 'Beverages' },
    { name: 'Cappuccino', price: 4.50, category: 'Beverages' },
    { name: 'Latte', price: 4.75, category: 'Beverages' },
    { name: 'Croissant', price: 3.00, category: 'Bakery' },
    { name: 'Muffin', price: 3.50, category: 'Bakery' },
    { name: 'Bagel', price: 2.50, category: 'Bakery' },
    { name: 'Caesar Salad', price: 8.50, category: 'Food' },
    { name: 'Club Sandwich', price: 9.00, category: 'Food' },
  ];

  for (const product of sampleProducts) {
    await addProduct(product);
  }
}
