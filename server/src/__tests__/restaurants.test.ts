import { describe, it, expect, beforeEach } from 'vitest';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { createTestUser, createTestRestaurant, resetTestData } from './utils/fixtures';
import { mockJWT } from './utils/mocks';
import { schema } from '../schema';

// Mock external dependencies
mockJWT();

describe('Restaurants', () => {
  let server: ApolloServer;
  let query: any;
  let mutate: any;

  beforeEach(async () => {
    await resetTestData();
    
    server = new ApolloServer({
      schema,
      context: () => ({ user: { id: 'test-user-id', role: 'customer' } })
    });
    
    const { query: testQuery, mutate: testMutate } = createTestClient(server);
    query = testQuery;
    mutate = testMutate;
  });

  describe('Restaurant Queries', () => {
    it('should fetch all restaurants', async () => {
      await createTestRestaurant({
        name: 'Test Restaurant 1',
        cuisine: 'Italian'
      });
      
      await createTestRestaurant({
        name: 'Test Restaurant 2',
        cuisine: 'Mexican'
      });

      const queryString = `
        query GetRestaurants($filters: RestaurantFilters) {
          restaurants(filters: $filters) {
            id
            name
            cuisine
            rating
            deliveryTime
            isOpen
          }
        }
      `;

      const result = await query({ query: queryString });
      
      expect(result.data.restaurants).toHaveLength(2);
      expect(result.data.restaurants[0].name).toBe('Test Restaurant 1');
      expect(result.data.restaurants[1].name).toBe('Test Restaurant 2');
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
        query GetRestaurants($filters: RestaurantFilters) {
          restaurants(filters: $filters) {
            id
            name
            cuisine
          }
        }
      `;

      const variables = {
        filters: {
          cuisine: 'Italian'
        }
      };

      const result = await query({ query: queryString, variables });
      
      expect(result.data.restaurants).toHaveLength(1);
      expect(result.data.restaurants[0].cuisine).toBe('Italian');
    });

    it('should fetch a single restaurant by ID', async () => {
      const restaurant = await createTestRestaurant({
        name: 'Single Restaurant',
        cuisine: 'Asian'
      });

      const queryString = `
        query GetRestaurant($id: String!) {
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

      const result = await query({ query: queryString, variables });
      
      expect(result.data.restaurant).toBeDefined();
      expect(result.data.restaurant.name).toBe('Single Restaurant');
      expect(result.data.restaurant.cuisine).toBe('Asian');
    });
  });

  describe('Restaurant Mutations', () => {
    it('should create a new restaurant (admin only)', async () => {
      // Update context to be admin user
      server = new ApolloServer({
        schema,
        context: () => ({ user: { id: 'admin-user-id', role: 'admin' } })
      });
      
      const { mutate: adminMutate } = createTestClient(server);

      const mutation = `
        mutation CreateRestaurant($input: CreateRestaurantInput!) {
          createRestaurant(input: $input) {
            success
            message
            restaurant {
              id
              name
              cuisine
              address
            }
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

      const result = await adminMutate({ mutation, variables });
      
      expect(result.data.createRestaurant.success).toBe(true);
      expect(result.data.createRestaurant.restaurant.name).toBe('New Restaurant');
    });

    it('should update restaurant details', async () => {
      const restaurant = await createTestRestaurant({
        name: 'Original Name'
      });

      const mutation = `
        mutation UpdateRestaurant($id: String!, $input: UpdateRestaurantInput!) {
          updateRestaurant(id: $id, input: $input) {
            success
            message
            restaurant {
              id
              name
              description
            }
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

      const result = await mutate({ mutation, variables });
      
      expect(result.data.updateRestaurant.success).toBe(true);
      expect(result.data.updateRestaurant.restaurant.name).toBe('Updated Name');
    });
  });
});
