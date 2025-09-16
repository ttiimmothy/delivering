import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { 
  useCreatePaymentIntent, 
  useConfirmPaymentIntent,
  useCreateCheckoutSession 
} from '@/hooks/usePayment';

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
  useQuery: () => ({ data: null, loading: false, error: null }),
  useApolloClient: () => mockClient,
}));

describe('Payment Hooks', () => {
  describe('useCreatePaymentIntent', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useCreatePaymentIntent());
      
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle create payment intent', async () => {
      mockMutate.mockResolvedValue({
        data: {
          createPaymentIntent: {
            id: 'pi_test_123',
            clientSecret: 'pi_test_123_secret',
            status: 'requires_payment_method'
          }
        }
      });

      const { result } = renderHook(() => useCreatePaymentIntent());
      
      await act(async () => {
        const response = await result.current.createPaymentIntent({
          amount: 2500,
          currency: 'usd',
          metadata: { orderId: 'order_123' }
        });
        
        expect(response).toBeDefined();
        expect(response?.id).toBe('pi_test_123');
        expect(response?.clientSecret).toBe('pi_test_123_secret');
      });
    });
  });

  describe('useConfirmPaymentIntent', () => {
    it('should handle confirm payment intent', async () => {
      mockMutate.mockResolvedValue({
        data: {
          confirmPaymentIntent: {
            id: 'pi_test_123',
            status: 'succeeded'
          }
        }
      });

      const { result } = renderHook(() => useConfirmPaymentIntent());
      
      await act(async () => {
        const response = await result.current.confirmPaymentIntent({
          paymentIntentId: 'pi_test_123',
          paymentMethodId: 'pm_test_123'
        });
        
        expect(response).toBeDefined();
        expect(response?.id).toBe('pi_test_123');
        expect(response?.status).toBe('succeeded');
      });
    });
  });

  describe('useCreateCheckoutSession', () => {
    it('should handle create checkout session', async () => {
      mockMutate.mockResolvedValue({
        data: {
          createCheckoutSession: {
            id: 'cs_test_123',
            url: 'https://checkout.stripe.com/test'
          }
        }
      });

      const { result } = renderHook(() => useCreateCheckoutSession());
      
      await act(async () => {
        const response = await result.current.createCheckoutSession({
          amount: 2500,
          currency: 'usd',
          successUrl: 'https://example.com/success',
          cancelUrl: 'https://example.com/cancel'
        });
        
        expect(response).toBeDefined();
        expect(response?.id).toBe('cs_test_123');
        expect(response?.url).toBe('https://checkout.stripe.com/test');
      });
    });
  });
});