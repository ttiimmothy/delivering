import { getTestDatabase, clearTestDatabase } from './database';
import * as schema from '../../db/schema';
import bcrypt from 'bcryptjs';

// Mock database for tests when real database is not available
export let mockData: any = {
  users: [],
  restaurants: [],
  menus: [],
  menuItems: [],
  orders: [],
  carts: [],
  cartItems: [],
  deliveries: [],
  reviews: [],
};

export async function createTestUser(overrides: Partial<typeof schema.users.$inferInsert> = {}) {
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
  
  try {
    const db = getTestDatabase();
    await db.insert(schema.users).values(defaultUser);
  } catch (error) {
    // If database is not available, store in mock data
    mockData.users.push(defaultUser);
  }
  
  return defaultUser;
}

export async function createTestRestaurant(overrides: Partial<typeof schema.restaurants.$inferInsert> = {}) {
  const defaultRestaurant = {
    id: `test-restaurant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
  
  try {
    const db = getTestDatabase();
    await db.insert(schema.restaurants).values(defaultRestaurant);
  } catch (error) {
    // If database is not available, store in mock data
    mockData.restaurants.push(defaultRestaurant);
  }
  
  return defaultRestaurant;
}

export async function createTestMenu(overrides: Partial<typeof schema.menus.$inferInsert> = {}) {
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
  
  try {
    const db = getTestDatabase();
    await db.insert(schema.menus).values(defaultMenu);
  } catch (error) {
    // If database is not available, store in mock data
    mockData.menus = mockData.menus || [];
    mockData.menus.push(defaultMenu);
  }
  
  return defaultMenu;
}

export async function createTestMenuItem(overrides: Partial<typeof schema.menuItems.$inferInsert> = {}) {
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
  
  try {
    const db = getTestDatabase();
    await db.insert(schema.menuItems).values(defaultMenuItem);
  } catch (error) {
    // If database is not available, store in mock data
    mockData.menuItems = mockData.menuItems || [];
    mockData.menuItems.push(defaultMenuItem);
  }
  
  return defaultMenuItem;
}

export async function createTestCart(overrides: Partial<typeof schema.carts.$inferInsert> = {}) {
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
  
  try {
    const db = getTestDatabase();
    await db.insert(schema.carts).values(defaultCart);
  } catch (error) {
    // If database is not available, store in mock data
    mockData.carts.push(defaultCart);
  }
  
  return defaultCart;
}

export async function createTestOrder(overrides: Partial<typeof schema.orders.$inferInsert> = {}) {
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
  
  try {
    const db = getTestDatabase();
    await db.insert(schema.orders).values(defaultOrder);
  } catch (error) {
    // If database is not available, store in mock data
    mockData.orders.push(defaultOrder);
  }
  
  return defaultOrder;
}

export async function resetTestData() {
  try {
    await clearTestDatabase();
  } catch (error) {
    // If database is not available, clear mock data
    mockData = {
      users: [],
      restaurants: [],
      menus: [],
      menuItems: [],
      orders: [],
      carts: [],
      cartItems: [],
      deliveries: [],
      reviews: [],
    };
  }
  await createTestUser();
  await createTestRestaurant();
  await createTestMenu();
  await createTestMenuItem();
}
