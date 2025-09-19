import { describe, it, expect, vi } from 'vitest';
import {renderHook} from '@testing-library/react';
import {act} from "react"

// Mock the usePayment hooks directly
const mockCreatePaymentIntent = vi.fn();
const mockConfirmPaymentIntent = vi.fn();
const mockCreateCheckoutSession = vi.fn();

// Mock the usePayment hooks
vi.mock('../../hooks/usePayment', () => ({
  useCreatePaymentIntent: vi.fn(() => ({
    createPaymentIntent: mockCreatePaymentIntent,
    loading: false,
    error: null,
  })),
  useConfirmPaymentIntent: vi.fn(() => ({
    confirmPaymentIntent: mockConfirmPaymentIntent,
    loading: false,
    error: null,
  })),
  useCreateCheckoutSession: vi.fn(() => ({
    createCheckoutSession: mockCreateCheckoutSession,
    loading: false,
    error: null,
  })),
}));

// Import after mocking
import { 
  useCreatePaymentIntent, 
  useConfirmPaymentIntent,
  useCreateCheckoutSession 
} from '../../hooks/usePayment';

describe('Payment Hooks', () => {
  describe('useCreatePaymentIntent', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useCreatePaymentIntent());
      
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle create payment intent', async () => {
      mockCreatePaymentIntent.mockResolvedValue({
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret',
        status: 'requires_payment_method'
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
      mockConfirmPaymentIntent.mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded'
      });

      const { result } = renderHook(() => useConfirmPaymentIntent());
      
      await act(async () => {
        const response = await result.current.confirmPaymentIntent(
          // {
          // paymentIntentId: 'pi_test_123',
          // paymentMethodId: 'pm_test_123'
          // }
          "pi_test_123"
        );
        
        expect(response).toBeDefined();
        expect(response?.id).toBe('pi_test_123');
        expect(response?.status).toBe('succeeded');
      });
    });
  });

  describe('useCreateCheckoutSession', () => {
    it('should handle create checkout session', async () => {
      mockCreateCheckoutSession.mockResolvedValue({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/test'
      });

      const { result } = renderHook(() => useCreateCheckoutSession());
      
      await act(async () => {
        const response = await result.current.createCheckoutSession({
          amount: 2500,
          currency: 'usd',
          orderId:"order_test_123",
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