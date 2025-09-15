import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePayment } from '@/hooks/usePayment';

// Mock Apollo Client
const mockMutate = vi.fn();
const mockClient = {
  mutate: mockMutate,
  query: vi.fn(),
  watchQuery: vi.fn(),
};

vi.mock('@apollo/client', () => ({
  useMutation: () => [mockMutate, { loading: false, error: null }],
  useQuery: () => ({ data: null, loading: false, error: null }),
  useApolloClient: () => mockClient,
}));

describe('usePayment', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePayment());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should create checkout session', async () => {
    mockMutate.mockResolvedValue({
      data: {
        createCheckoutSession: {
          success: true,
          session: { id: 'cs_test', url: 'https://checkout.stripe.com/test' }
        }
      }
    });

    const { result } = renderHook(() => usePayment());
    
    await act(async () => {
      const response = await result.current.createCheckoutSession({
        orderId: 'test-order-id',
        successUrl: 'http://localhost:3000/success',
        cancelUrl: 'http://localhost:3000/cancel'
      });
      
      expect(response.success).toBe(true);
      expect(response.session.id).toBe('cs_test');
    });
  });

  it('should create payment intent', async () => {
    mockMutate.mockResolvedValue({
      data: {
        createPaymentIntent: {
          success: true,
          paymentIntent: { id: 'pi_test', clientSecret: 'pi_test_secret' }
        }
      }
    });

    const { result } = renderHook(() => usePayment());
    
    await act(async () => {
      const response = await result.current.createPaymentIntent({
        amount: 2000,
        currency: 'usd',
        orderId: 'test-order-id'
      });
      
      expect(response.success).toBe(true);
      expect(response.paymentIntent.id).toBe('pi_test');
    });
  });
});
