import { describe, it, expect, vi } from 'vitest';
import {renderHook} from '@testing-library/react';
import {act} from "react"
import { 
  useCart, 
  useAddToCart, 
  useUpdateCartItem, 
  useRemoveFromCart, 
  useClearCart 
} from '../../hooks/useCart';

// Mock Apollo Client
const mockMutate = vi.fn();
const mockClient = {
  mutate: mockMutate,
  query: vi.fn(),
  watchQuery: vi.fn(),
};

vi.mock('@apollo/client', () => ({
  gql: vi.fn((strings, ...values) => strings.join('')),
  useMutation: () => [mockMutate, { loading: false, error: null }],
  useQuery: () => ({ 
    data: { cart: { id: 'test-cart-id', totalAmount: 25.99, itemCount: 2 } }, 
    loading: false, 
    error: null 
  }),
  useApolloClient: () => mockClient,
}));

describe('Cart Hooks', () => {
  describe('useCart', () => {
    it('should return cart data', () => {
      const { result } = renderHook(() => useCart());
      
      expect(result.current.cart).toBeDefined();
      expect(result.current.cart?.id).toBe('test-cart-id');
      expect(result.current.cart?.totalAmount).toBe(25.99);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('useAddToCart', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useAddToCart());
      
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle add to cart', async () => {
      mockMutate.mockResolvedValue({
        data: {
          addToCart: {
            id: 'cart-item-1',
            quantity: 2,
            menuItem: { id: 'item-1', name: 'Test Item' }
          }
        }
      });

      const { result } = renderHook(() => useAddToCart());
      
      await act(async () => {
        const response = await result.current.addToCart({
          menuItemId: 'item-1',
          quantity: 2,
          specialInstructions: 'No onions'
        });
        
        expect(response).toBeDefined();
        expect(response?.quantity).toBe(2);
      });
    });
  });

  describe('useUpdateCartItem', () => {
    it('should handle update cart item', async () => {
      mockMutate.mockResolvedValue({
        data: {
          updateCartItem: {
            id: 'cart-item-1',
            quantity: 3,
            menuItem: { id: 'item-1', name: 'Test Item' }
          }
        }
      });

      const { result } = renderHook(() => useUpdateCartItem());
      
      await act(async () => {
        const response = await result.current.updateCartItem({
          cartItemId: 'cart-item-1',
          quantity: 3,
          specialInstructions: 'Extra sauce'
        });
        
        expect(response).toBeDefined();
        expect(response?.quantity).toBe(3);
      });
    });
  });

  describe('useRemoveFromCart', () => {
    it('should handle remove from cart', async () => {
      mockMutate.mockResolvedValue({
        data: {
          removeFromCart: {
            success: true
          }
        }
      });

      const { result } = renderHook(() => useRemoveFromCart());
      
      await act(async () => {
        const response = await result.current.removeFromCart({
          cartItemId: 'cart-item-1'
        });
        
        expect(response).toBeDefined();
      });
    });
  });

  describe('useClearCart', () => {
    it('should handle clear cart', async () => {
      mockMutate.mockResolvedValue({
        data: {
          clearCart: {
            success: true
          }
        }
      });

      const { result } = renderHook(() => useClearCart());
      
      await act(async () => {
        const response = await result.current.clearCart();
        
        expect(response).toBeDefined();
      });
    });
  });
});