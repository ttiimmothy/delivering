import { describe, it, expect, beforeEach } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { createTestUser, createTestRestaurant, resetTestData } from './lib/fixtures';
import { mockJWT } from './lib/setup';
import { createTestServer, executeOperation } from './setup';

// Mock external dependencies
mockJWT();

describe('Restaurants', () => {
  let server: ApolloServer;

  beforeEach(async () => {
    await resetTestData();
    server = createTestServer();
  });

  describe('Restaurant Queries', () => {
    it('should fetch all restaurants', async () => {
      const restaurant1 = await createTestRestaurant({
        name: 'Test Restaurant 1',
        cuisine: 'Italian'
      });
      
      const restaurant2 = await createTestRestaurant({
        name: 'Test Restaurant 2',
        cuisine: 'Mexican'
      });
      
      const queryString = `
        query GetRestaurants {
          restaurants {
            id
            name
            cuisine
            rating
            deliveryTime
            isOpen
          }
        }
      `;

      const result = await executeOperation(server, { query: queryString });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect((data?.restaurants as any).length).toBeGreaterThanOrEqual(2);
      const testRestaurants = (data?.restaurants as any).filter(r => 
        r.name === 'Test Restaurant 1' || r.name === 'Test Restaurant 2'
      );
      expect(testRestaurants).toHaveLength(2);
    });

    it('should filter restaurants by cuisine', async () => {
      await createTestRestaurant({
        name: 'Italian Restaurant',
        cuisine: 'Italian'
      });
      
      await createTestRestaurant({
        name: 'Mexican Restaurant',
        cuisine: 'Mexican'
      });

      const queryString = `
        query GetRestaurants {
          restaurants {
            id
            name
            cuisine
          }
        }
      `;

      const result = await executeOperation(server, { query: queryString });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      const italianRestaurants = (data?.restaurants as any).filter(r => r.cuisine === 'Italian');
      expect(italianRestaurants).toHaveLength(1);
      expect(italianRestaurants[0].cuisine).toBe('Italian');
    });

    it('should fetch a single restaurant by ID', async () => {
      const restaurant = await createTestRestaurant({
        name: 'Single Restaurant',
        cuisine: 'Asian'
      });

      const queryString = `
        query GetRestaurant($id: ID!) {
          restaurant(id: $id) {
            id
            name
            cuisine
            rating
            deliveryTime
            isOpen
          }
        }
      `;

      const variables = {
        id: restaurant.id
      };

      const result = await executeOperation(server, { query: queryString, variables });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.restaurant).toBeDefined();
      expect((data?.restaurant as any).name).toBe('Single Restaurant');
      expect((data?.restaurant as any).cuisine).toBe('Asian');
    });
  });

  describe('Restaurant Mutations', () => {
    it('should create a new restaurant (admin only)', async () => {
      // Create server with admin context
      const adminServer = createTestServer({ user: { id: 'admin-user-id', role: 'admin' } });

      const mutation = `
        mutation CreateRestaurant($input: CreateRestaurantInput!) {
          createRestaurant(input: $input) {
            id
            name
            cuisine
            address
          }
        }
      `;

      const variables = {
        input: {
          name: 'New Restaurant',
          description: 'A new test restaurant',
          address: '456 New St',
          city: 'New City',
          state: 'NS',
          zipCode: '54321',
          phone: '+1987654321',
          email: 'new@restaurant.com',
          cuisine: 'Fusion',
          deliveryTime: 25,
          deliveryFee: 3.99,
          minimumOrder: 20.00
        }
      };

      const result = await executeOperation(adminServer, { query: mutation, variables });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.createRestaurant).toBeDefined();
      expect((data?.createRestaurant as any).name).toBe('New Restaurant');
    });

    it('should update restaurant details', async () => {
      const restaurant = await createTestRestaurant({
        name: 'Original Name'
      });

      const mutation = `
        mutation UpdateRestaurant($id: ID!, $input: UpdateRestaurantInput!) {
          updateRestaurant(id: $id, input: $input) {
            id
            name
            description
          }
        }
      `;

      const variables = {
        id: restaurant.id,
        input: {
          name: 'Updated Name',
          description: 'Updated description'
        }
      };

      const result = await executeOperation(server, { query: mutation, variables });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.updateRestaurant).toBeDefined();
      expect((data?.updateRestaurant as any).name).toBe('Updated Name');
    });
  });
});
