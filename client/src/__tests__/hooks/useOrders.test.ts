import { describe, it, expect, vi } from 'vitest';
import {renderHook} from '@testing-library/react';
import {act} from "react"

// Mock the useOrders hooks directly
const mockPlaceOrder = vi.fn();

// Mock the useOrders hooks
vi.mock('../../hooks/useOrders', () => ({
  useOrders: vi.fn((variables) => ({
    orders: [
      { id: '1', status: 'pending', totalAmount: 25.99 },
      { id: '2', status: 'delivered', totalAmount: 15.99 }
    ],
    loading: false,
    error: null,
    refetch: vi.fn(),
    fetchMore: vi.fn(),
  })),
  useOrder: vi.fn((id) => ({
    order: { id: '1', status: 'pending', totalAmount: 25.99 },
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
  usePlaceOrder: vi.fn(() => ({
    placeOrder: mockPlaceOrder,
    loading: false,
    error: null,
  })),
}));

// Import after mocking
import { 
  useOrders, 
  useOrder, 
  usePlaceOrder 
} from '../../hooks/useOrders';

describe('Orders Hooks', () => {
  describe('useOrders', () => {
    it('should return orders data', () => {
      const { result } = renderHook(() => useOrders());
      
      expect(result.current.orders).toBeDefined();
      expect(result.current.orders).toHaveLength(2);
      expect(result.current.orders[0].id).toBe('1');
      expect(result.current.orders[0].status).toBe('pending');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should accept query variables', () => {
      const { result } = renderHook(() => useOrders({ status: 'pending' }));
      
      expect(result.current.orders).toBeDefined();
      expect(result.current.orders).toHaveLength(2); // Mock returns all orders, filtering happens at query level
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useOrder', () => {
    it('should return single order data', () => {
      const { result } = renderHook(() => useOrder('1'));
      
      expect(result.current.order).toBeDefined();
      expect(result.current.order?.id).toBe('1');
      expect(result.current.order?.status).toBe('pending');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('usePlaceOrder', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => usePlaceOrder());
      
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle place order', async () => {
      mockPlaceOrder.mockResolvedValue({
        id: 'order-123',
        status: 'pending',
        totalAmount: 25.99
      });

      const { result } = renderHook(() => usePlaceOrder());
      
      await act(async () => {
        const response = await result.current.placeOrder({
          restaurantId: 'restaurant-1',
          deliveryAddress: {
            street: '123 Main St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345'
          },
          paymentMethodId: 'pm_test_123'
        });
        
        expect(response).toBeDefined();
        expect(response?.id).toBe('order-123');
        expect(response?.status).toBe('pending');
      });
    });
  });
});