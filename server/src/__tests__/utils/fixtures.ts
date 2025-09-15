import { getTestDatabase, clearTestDatabase } from './database';
import * as schema from '../../db/schema';
import bcrypt from 'bcryptjs';

export async function createTestUser(overrides: Partial<typeof schema.users.$inferInsert> = {}) {
  const db = getTestDatabase();
  
  const defaultUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    password: await bcrypt.hash('password123', 10),
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
    role: 'customer' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  await db.insert(schema.users).values(defaultUser);
  return defaultUser;
}

export async function createTestRestaurant(overrides: Partial<typeof schema.restaurants.$inferInsert> = {}) {
  const db = getTestDatabase();
  
  const defaultRestaurant = {
    id: 'test-restaurant-id',
    name: 'Test Restaurant',
    description: 'A test restaurant',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    phone: '+1234567890',
    email: 'restaurant@test.com',
    cuisine: 'Test Cuisine',
    rating: 4.5,
    reviewCount: 100,
    deliveryTime: 30,
    deliveryFee: 2.99,
    minimumOrder: 15.00,
    isActive: true,
    isOpen: true,
    image: 'https://example.com/restaurant.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  await db.insert(schema.restaurants).values(defaultRestaurant);
  return defaultRestaurant;
}

export async function createTestMenu(overrides: Partial<typeof schema.menus.$inferInsert> = {}) {
  const db = getTestDatabase();
  
  const defaultMenu = {
    id: 'test-menu-id',
    restaurantId: 'test-restaurant-id',
    name: 'Test Menu',
    description: 'A test menu',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  await db.insert(schema.menus).values(defaultMenu);
  return defaultMenu;
}

export async function createTestMenuItem(overrides: Partial<typeof schema.menuItems.$inferInsert> = {}) {
  const db = getTestDatabase();
  
  const defaultMenuItem = {
    id: 'test-menu-item-id',
    menuId: 'test-menu-id',
    name: 'Test Item',
    description: 'A test menu item',
    price: 9.99,
    category: 'Main',
    isAvailable: true,
    image: 'https://example.com/item.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  await db.insert(schema.menuItems).values(defaultMenuItem);
  return defaultMenuItem;
}

export async function createTestCart(overrides: Partial<typeof schema.carts.$inferInsert> = {}) {
  const db = getTestDatabase();
  
  const defaultCart = {
    id: 'test-cart-id',
    userId: 'test-user-id',
    restaurantId: 'test-restaurant-id',
    totalAmount: 0,
    itemCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  await db.insert(schema.carts).values(defaultCart);
  return defaultCart;
}

export async function createTestOrder(overrides: Partial<typeof schema.orders.$inferInsert> = {}) {
  const db = getTestDatabase();
  
  const defaultOrder = {
    id: 'test-order-id',
    userId: 'test-user-id',
    restaurantId: 'test-restaurant-id',
    status: 'pending' as const,
    totalAmount: 25.99,
    deliveryFee: 2.99,
    tax: 2.50,
    subtotal: 20.50,
    deliveryAddress: '123 Test St',
    deliveryCity: 'Test City',
    deliveryState: 'TS',
    deliveryZipCode: '12345',
    deliveryPhone: '+1234567890',
    specialInstructions: 'Test instructions',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  await db.insert(schema.orders).values(defaultOrder);
  return defaultOrder;
}

export async function resetTestData() {
  await clearTestDatabase();
  await createTestUser();
  await createTestRestaurant();
  await createTestMenu();
  await createTestMenuItem();
}
