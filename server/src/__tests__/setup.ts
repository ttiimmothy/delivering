import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { createTestDatabase, dropTestDatabase } from './utils/database';
import { createTestUser, createTestRestaurant, createTestMenu } from './utils/fixtures';
import { mockStripe } from './utils/mocks';

// Global test setup
beforeAll(async () => {
  // Create test database
  await createTestDatabase();
  
  // Mock external services
  mockStripe();
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock';
});

afterAll(async () => {
  // Clean up test database
  await dropTestDatabase();
});

beforeEach(async () => {
  // Reset database state before each test
  await createTestUser();
  await createTestRestaurant();
  await createTestMenu();
});

afterEach(async () => {
  // Clean up after each test
  // This will be handled by the database cleanup
});

// Export test utilities
export { createTestClient, createTestUser, createTestRestaurant, createTestMenu };
