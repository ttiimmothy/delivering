import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrders, useOrder } from '@/hooks/useOrders';

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
    data: { 
      orders: [
        { id: '1', status: 'pending', totalAmount: 25.99 },
        { id: '2', status: 'delivered', totalAmount: 15.99 }
      ],
      order: { id: '1', status: 'pending', totalAmount: 25.99 }
    }, 
    loading: false, 
    error: null 
  }),
  useApolloClient: () => mockClient,
}));

describe('useOrders', () => {
  it('should initialize with orders data', () => {
    const { result } = renderHook(() => useOrders());
    
    expect(result.current.orders).toHaveLength(2);
    expect(result.current.orders[0].status).toBe('pending');
    expect(result.current.orders[1].status).toBe('delivered');
  });

  it('should create order', async () => {
    mockMutate.mockResolvedValue({
      data: {
        createOrder: {
          success: true,
          order: { id: '3', status: 'pending', totalAmount: 30.99 }
        }
      }
    });

    const { result } = renderHook(() => useOrders());
    
    await act(async () => {
      const response = await result.current.createOrder({
        restaurantId: 'test-restaurant-id',
        items: [{ menuItemId: 'test-item-id', quantity: 2 }],
        deliveryAddress: '123 Test St',
        deliveryCity: 'Test City',
        deliveryState: 'TS',
        deliveryZipCode: '12345',
        deliveryPhone: '+1234567890'
      });
      
      expect(response.success).toBe(true);
      expect(response.order.id).toBe('3');
    });
  });

  it('should update order status', async () => {
    mockMutate.mockResolvedValue({
      data: {
        updateOrderStatus: {
          success: true,
          order: { id: '1', status: 'preparing' }
        }
      }
    });

    const { result } = renderHook(() => useOrders());
    
    await act(async () => {
      const response = await result.current.updateOrderStatus('1', 'preparing');
      
      expect(response.success).toBe(true);
      expect(response.order.status).toBe('preparing');
    });
  });
});

describe('useOrder', () => {
  it('should fetch single order', () => {
    const { result } = renderHook(() => useOrder('1'));
    
    expect(result.current.order).toBeDefined();
    expect(result.current.order?.id).toBe('1');
    expect(result.current.order?.status).toBe('pending');
  });
});
