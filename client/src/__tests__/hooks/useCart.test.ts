import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';

// Mock Apollo Client
const mockMutate = vi.fn();
const mockClient = {
  mutate: mockMutate,
  query: vi.fn(),
  watchQuery: vi.fn(),
};

vi.mock('@apollo/client', () => ({
  useMutation: () => [mockMutate, { loading: false, error: null }],
  useQuery: () => ({ 
    data: { cart: { id: 'test-cart-id', totalAmount: 25.99, itemCount: 2 } }, 
    loading: false, 
    error: null 
  }),
  useApolloClient: () => mockClient,
}));

describe('useCart', () => {
  it('should initialize with cart data', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cart).toBeDefined();
    expect(result.current.cart?.totalAmount).toBe(25.99);
    expect(result.current.cart?.itemCount).toBe(2);
  });

  it('should add item to cart', async () => {
    mockMutate.mockResolvedValue({
      data: {
        addToCart: {
          success: true,
          cart: { id: 'test-cart-id', totalAmount: 38.98, itemCount: 3 }
        }
      }
    });

    const { result } = renderHook(() => useCart());
    
    await act(async () => {
      const response = await result.current.addToCart({
        menuItemId: 'test-item-id',
        quantity: 1
      });
      
      expect(response.success).toBe(true);
      expect(response.cart.itemCount).toBe(3);
    });
  });

  it('should update cart item', async () => {
    mockMutate.mockResolvedValue({
      data: {
        updateCartItem: {
          success: true,
          cart: { id: 'test-cart-id', totalAmount: 51.96, itemCount: 4 }
        }
      }
    });

    const { result } = renderHook(() => useCart());
    
    await act(async () => {
      const response = await result.current.updateCartItem({
        cartItemId: 'test-cart-item-id',
        quantity: 2
      });
      
      expect(response.success).toBe(true);
      expect(response.cart.itemCount).toBe(4);
    });
  });

  it('should remove item from cart', async () => {
    mockMutate.mockResolvedValue({
      data: {
        removeFromCart: {
          success: true,
          cart: { id: 'test-cart-id', totalAmount: 12.99, itemCount: 1 }
        }
      }
    });

    const { result } = renderHook(() => useCart());
    
    await act(async () => {
      const response = await result.current.removeFromCart({
        cartItemId: 'test-cart-item-id'
      });
      
      expect(response.success).toBe(true);
      expect(response.cart.itemCount).toBe(1);
    });
  });

  it('should clear cart', async () => {
    mockMutate.mockResolvedValue({
      data: {
        clearCart: {
          success: true,
          cart: { id: 'test-cart-id', totalAmount: 0, itemCount: 0 }
        }
      }
    });

    const { result } = renderHook(() => useCart());
    
    await act(async () => {
      const response = await result.current.clearCart();
      
      expect(response.success).toBe(true);
      expect(response.cart.itemCount).toBe(0);
    });
  });
});
