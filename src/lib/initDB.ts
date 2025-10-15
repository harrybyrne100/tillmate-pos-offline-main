import { getAllProducts, addProduct } from '@/db/products';
import { sampleProducts } from '@/data/items';

/**
 * Initialize database with sample products if empty
 * This should be called once on app startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if products store is empty
    const existingProducts = await getAllProducts();
    
    if (existingProducts.length === 0) {
      console.log('Products store is empty, seeding with sample data...');
      
      // Seed products one by one
      for (const product of sampleProducts) {
        await addProduct({
          name: product.name,
          price: product.price,
          category: product.category,
          sku: product.sku,
          stock: product.stock,
          image: product.image,
        });
      }
      
      console.log(`Seeded ${sampleProducts.length} products successfully`);
    } else {
      console.log(`Products store already contains ${existingProducts.length} products, skipping seed`);
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
