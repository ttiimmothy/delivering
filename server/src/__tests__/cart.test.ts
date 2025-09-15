import { describe, it, expect, beforeEach } from 'vitest';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { createTestUser, createTestRestaurant, createTestMenu, createTestMenuItem, createTestCart, resetTestData } from './utils/fixtures';
import { mockJWT } from './utils/mocks';
import { schema } from '../schema';

// Mock external dependencies
mockJWT();

describe('Cart Management', () => {
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
            totalAmount
            itemCount
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

      const result = await query({ query: queryString });
      
      expect(result.data.cart).toBeDefined();
      expect(result.data.cart.totalAmount).toBe(25.99);
      expect(result.data.cart.itemCount).toBe(2);
    });

    it('should return null for non-existent cart', async () => {
      const queryString = `
        query GetCart {
          cart {
            id
            totalAmount
            itemCount
          }
        }
      `;

      const result = await query({ query: queryString });
      
      expect(result.data.cart).toBeNull();
    });
  });

  describe('Cart Mutations', () => {
    it('should add item to cart', async () => {
      await createTestRestaurant();
      await createTestMenu();
      await createTestMenuItem({
        name: 'Test Burger',
        price: 12.99
      });

      const mutation = `
        mutation AddToCart($input: AddToCartInput!) {
          addToCart(input: $input) {
            success
            message
            cart {
              id
              totalAmount
              itemCount
              items {
                id
                quantity
                menuItem {
                  name
                  price
                }
              }
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

      const result = await mutate({ mutation, variables });
      
      expect(result.data.addToCart.success).toBe(true);
      expect(result.data.addToCart.cart.itemCount).toBe(2);
      expect(result.data.addToCart.cart.totalAmount).toBe(25.98); // 12.99 * 2
    });

    it('should update cart item quantity', async () => {
      await createTestRestaurant();
      await createTestMenu();
      await createTestMenuItem({
        name: 'Test Pizza',
        price: 15.99
      });
      
      // First add item to cart
      await mutate({
        mutation: `
          mutation AddToCart($input: AddToCartInput!) {
            addToCart(input: $input) {
              success
              cart { id }
            }
          }
        `,
        variables: {
          input: {
            menuItemId: 'test-menu-item-id',
            quantity: 1
          }
        }
      });

      const mutation = `
        mutation UpdateCartItem($input: UpdateCartItemInput!) {
          updateCartItem(input: $input) {
            success
            message
            cart {
              id
              totalAmount
              itemCount
            }
          }
        }
      `;

      const variables = {
        input: {
          cartItemId: 'test-cart-item-id',
          quantity: 3
        }
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.updateCartItem.success).toBe(true);
      expect(result.data.updateCartItem.cart.itemCount).toBe(3);
    });

    it('should remove item from cart', async () => {
      await createTestRestaurant();
      await createTestMenu();
      await createTestMenuItem();
      
      // First add item to cart
      await mutate({
        mutation: `
          mutation AddToCart($input: AddToCartInput!) {
            addToCart(input: $input) {
              success
              cart { id }
            }
          }
        `,
        variables: {
          input: {
            menuItemId: 'test-menu-item-id',
            quantity: 1
          }
        }
      });

      const mutation = `
        mutation RemoveFromCart($input: RemoveFromCartInput!) {
          removeFromCart(input: $input) {
            success
            message
            cart {
              id
              itemCount
            }
          }
        }
      `;

      const variables = {
        input: {
          cartItemId: 'test-cart-item-id'
        }
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.removeFromCart.success).toBe(true);
      expect(result.data.removeFromCart.cart.itemCount).toBe(0);
    });

    it('should clear entire cart', async () => {
      await createTestRestaurant();
      await createTestMenu();
      await createTestMenuItem();
      
      // First add item to cart
      await mutate({
        mutation: `
          mutation AddToCart($input: AddToCartInput!) {
            addToCart(input: $input) {
              success
              cart { id }
            }
          }
        `,
        variables: {
          input: {
            menuItemId: 'test-menu-item-id',
            quantity: 2
          }
        }
      });

      const mutation = `
        mutation ClearCart {
          clearCart {
            success
            message
            cart {
              id
              itemCount
              totalAmount
            }
          }
        }
      `;

      const result = await mutate({ mutation });
      
      expect(result.data.clearCart.success).toBe(true);
      expect(result.data.clearCart.cart.itemCount).toBe(0);
      expect(result.data.clearCart.cart.totalAmount).toBe(0);
    });
  });
});
