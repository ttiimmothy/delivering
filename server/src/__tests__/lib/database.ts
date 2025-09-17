import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '../../database/drizzle/schema';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/delivering_test';

let testClient: postgres.Sql;
let testDb: ReturnType<typeof drizzle>;

export async function createTestDatabase() {
  try {
    // Create test database connection
    testClient = postgres(TEST_DATABASE_URL, { max: 1 });
    testDb = drizzle(testClient, { schema });
    
    // Run migrations
    await migrate(testDb, { migrationsFolder: './drizzle' });
    
    console.log('✅ Test database created and migrated');
  } catch (error) {
    console.error('❌ Failed to create test database:', error);
    throw error;
  }
}

export async function dropTestDatabase() {
  try {
    if (testClient) {
      await testClient.end();
    }
    console.log('✅ Test database dropped');
  } catch (error) {
    console.error('❌ Failed to drop test database:', error);
  }
}

export function getTestDatabase() {
  if (!testDb) {
    throw new Error('Test database not initialized. Call createTestDatabase() first.');
  }
  return testDb;
}

export async function clearTestDatabase() {
  const db = getTestDatabase();
  
  // Clear all tables in reverse order of dependencies
  await db.delete(schema.deliveries);
  await db.delete(schema.orders);
  await db.delete(schema.cartItems);
  await db.delete(schema.carts);
  await db.delete(schema.reviews);
  await db.delete(schema.menuItemOptionValues);
  await db.delete(schema.menuItemOptions);
  await db.delete(schema.menuItems);
  await db.delete(schema.menuCategories);
  await db.delete(schema.restaurants);
  await db.delete(schema.users);
}
