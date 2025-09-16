import { describe, it, expect, beforeEach } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { createTestUser, createTestRestaurant, createTestMenuCategory, createTestMenuItem, resetTestData } from './lib/fixtures';
import { mockJWT } from './lib/setup';
import { createTestServer, executeOperation, createTestCart, resetMockData } from './setup';

// Mock external dependencies
mockJWT();

describe('Cart Management', () => {
  let server: ApolloServer;

  beforeEach(async () => {
    await resetTestData();
    resetMockData();
    server = createTestServer();
  });

  describe('Cart Queries', () => {
    it('should fetch user cart', async () => {
      await createTestCart({
        userId: 'test-user-id',
        totalAmount: 25.99,
        itemCount: 2
      });

      const queryString = `
        query GetCart {
          cart {
            id
            userId
            restaurantId
            createdAt
            updatedAt
            items {
              id
              quantity
              menuItem {
                id
                name
                price
              }
            }
          }
        }
      `;

      const result = await executeOperation(server, {
        query: queryString
      }, { user: { id: 'test-user-id', role: 'customer' } });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.cart).toBeDefined();
      expect((data?.cart as any).userId).toBe('test-user-id');
    });

    it('should return null for non-existent cart', async () => {
      const queryString = `
        query GetCart {
          cart {
            id
            userId
            restaurantId
          }
        }
      `;

      const result = await executeOperation(server, {
        query: queryString
      }, { user: { id: 'test-user-id', role: 'customer' } });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.cart).toBeNull();
    });
  });

  describe('Cart Mutations', () => {
    it('should add item to cart', async () => {
      await createTestRestaurant();
      await createTestMenuCategory();
      await createTestMenuItem({
        name: 'Test Burger',
        price: "12.99"
      });

      const mutation = `
        mutation AddToCart($input: AddToCartInput!) {
          addToCart(input: $input) {
            id
            cartId
            menuItemId
            quantity
            selectedOptions
            specialInstructions
            createdAt
            updatedAt
            menuItem {
              id
              name
              price
            }
          }
        }
      `;

      const variables = {
        input: {
          menuItemId: 'test-menu-item-id',
          quantity: 2
        }
      };

      const result = await executeOperation(server, {
        query: mutation,
        variables
      }, { user: { id: 'test-user-id', role: 'customer' } });
      
      console.log('Mutation result:', JSON.stringify(result, null, 2));
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.addToCart).toBeDefined();
      expect((data?.addToCart as any).quantity).toBe(2);
      expect((data?.addToCart as any).menuItem.name).toBe('Test Burger');
    });

    it('should update cart item quantity', async () => {
      await createTestRestaurant();
      await createTestMenuCategory();
      await createTestMenuItem({
        name: 'Test Pizza',
        price: "15.99"
      });
      
      // First add item to cart
      await executeOperation(server, {
        query: `
          mutation AddToCart($input: AddToCartInput!) {
            addToCart(input: $input) {
              id
              cartId
            }
          }
        `,
        variables: {
          input: {
            menuItemId: 'test-menu-item-id',
            quantity: 1
          }
        }
      }, { user: { id: 'test-user-id', role: 'customer' } });

      const mutation = `
        mutation UpdateCartItem($input: UpdateCartItemInput!) {
          updateCartItem(input: $input) {
            id
            cartId
            menuItemId
            quantity
            selectedOptions
            specialInstructions
            createdAt
            updatedAt
          }
        }
      `;

      const variables = {
        input: {
          cartItemId: 'test-cart-item-id',
          quantity: 3
        }
      };

      const result = await executeOperation(server, {
        query: mutation,
        variables
      }, { user: { id: 'test-user-id', role: 'customer' } });
      
      console.log('Update mutation result:', JSON.stringify(result, null, 2));
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.updateCartItem).toBeDefined();
      expect((data?.updateCartItem as any).quantity).toBe(3);
    });

    it('should remove item from cart', async () => {
      await createTestRestaurant();
      await createTestMenuCategory();
      await createTestMenuItem();
      
      // First add item to cart
      await executeOperation(server, {
        query: `
          mutation AddToCart($input: AddToCartInput!) {
            addToCart(input: $input) {
              id
              cartId
            }
          }
        `,
        variables: {
          input: {
            menuItemId: 'test-menu-item-id',
            quantity: 1
          }
        }
      }, { user: { id: 'test-user-id', role: 'customer' } });

      const mutation = `
        mutation RemoveFromCart($input: RemoveFromCartInput!) {
          removeFromCart(input: $input)
        }
      `;

      const variables = {
        input: {
          cartItemId: 'test-cart-item-id'
        }
      };

      const result = await executeOperation(server, {
        query: mutation,
        variables
      }, { user: { id: 'test-user-id', role: 'customer' } });
      
      console.log('Remove from cart result:', JSON.stringify(result, null, 2));
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.removeFromCart).toBe(true);
    });

    it('should clear entire cart', async () => {
      // Create a cart first
      createTestCart('test-user-id');
      
      await createTestRestaurant();
      await createTestMenuCategory();
      await createTestMenuItem();
      
      // First add item to cart
      await executeOperation(server, {
        query: `
          mutation AddToCart($input: AddToCartInput!) {
            addToCart(input: $input) {
              id
              cartId
            }
          }
        `,
        variables: {
          input: {
            menuItemId: 'test-menu-item-id',
            quantity: 2
          }
        }
      }, { user: { id: 'test-user-id', role: 'customer' } });

      const mutation = `
        mutation ClearCart {
          clearCart
        }
      `;

      const result = await executeOperation(server, {
        query: mutation
      }, { user: { id: 'test-user-id', role: 'customer' } });
      
      console.log('Clear cart result:', JSON.stringify(result, null, 2));
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect(data?.clearCart).toBe(true);
    });
  });
});
