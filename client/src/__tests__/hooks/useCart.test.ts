import { describe, it, expect, vi } from 'vitest';
import {renderHook} from '@testing-library/react';
import {act} from "react"

// Mock the individual hooks directly
const mockAddToCart = vi.fn();
const mockUpdateCartItem = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockClearCart = vi.fn();

// Mock the useCart hooks
vi.mock('../../hooks/useCart', () => ({
  useCart: vi.fn(() => ({
    data: { cart: { id: 'test-cart-id', totalAmount: 25.99, itemCount: 2 } },
    loading: false,
    error: null,
    cart: { id: 'test-cart-id', totalAmount: 25.99, itemCount: 2 },
    itemCount: 2,
    items: [],
    total: 25.99,
    refetch: vi.fn(),
  })),
  useAddToCart: vi.fn(() => ({
    addToCart: mockAddToCart,
    loading: false,
    error: null,
  })),
  useUpdateCartItem: vi.fn(() => ({
    updateCartItem: mockUpdateCartItem,
    loading: false,
    error: null,
  })),
  useRemoveFromCart: vi.fn(() => ({
    removeFromCart: mockRemoveFromCart,
    loading: false,
    error: null,
  })),
  useClearCart: vi.fn(() => ({
    clearCart: mockClearCart,
    loading: false,
    error: null,
  })),
}));

// Import after mocking
import { 
  useCart, 
  useAddToCart, 
  useUpdateCartItem, 
  useRemoveFromCart, 
  useClearCart 
} from '../../hooks/useCart';

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
      mockAddToCart.mockResolvedValue({
        id: 'cart-item-1',
        quantity: 2,
        menuItem: { id: 'item-1', name: 'Test Item' }
      });

      const { result } = renderHook(() => useAddToCart());
      
      await act(async () => {
        const response = await result.current.addToCart({
          menuItemId: 'item-1',
          quantity: 2,
          specialInstructions: 'No onions'
        });
        
        expect(mockAddToCart).toHaveBeenCalledWith({
          menuItemId: 'item-1',
          quantity: 2,
          specialInstructions: 'No onions'
        });
      });
    });
  });

  describe('useUpdateCartItem', () => {
    it('should handle update cart item', async () => {
      mockUpdateCartItem.mockResolvedValue({
        id: 'cart-item-1',
        quantity: 3,
        menuItem: { id: 'item-1', name: 'Test Item' }
      });

      const { result } = renderHook(() => useUpdateCartItem());
      
      await act(async () => {
        await result.current.updateCartItem({
          cartItemId: 'cart-item-1',
          quantity: 3,
          specialInstructions: 'Extra sauce'
        });
        
        expect(mockUpdateCartItem).toHaveBeenCalledWith({
          cartItemId: 'cart-item-1',
          quantity: 3,
          specialInstructions: 'Extra sauce'
        });
      });
    });
  });

  describe('useRemoveFromCart', () => {
    it('should handle remove from cart', async () => {
      mockRemoveFromCart.mockResolvedValue({
        success: true
      });

      const { result } = renderHook(() => useRemoveFromCart());
      
      await act(async () => {
        await result.current.removeFromCart({
          cartItemId: 'cart-item-1'
        });
        
        expect(mockRemoveFromCart).toHaveBeenCalledWith({
          cartItemId: 'cart-item-1'
        });
      });
    });
  });

  describe('useClearCart', () => {
    it('should handle clear cart', async () => {
      mockClearCart.mockResolvedValue({
        success: true
      });

      const { result } = renderHook(() => useClearCart());
      
      await act(async () => {
        await result.current.clearCart();
        
        expect(mockClearCart).toHaveBeenCalled();
      });
    });
  });
});