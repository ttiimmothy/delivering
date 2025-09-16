import { describe, it, expect, beforeEach } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { createTestUser, resetTestData } from './lib/fixtures';
import { mockJWT, mockStripe } from './lib/setup';
import { createTestServer, executeOperation } from './setup';

// Mock external dependencies
mockJWT();
mockStripe();

describe('Payment System', () => {
  let server: ApolloServer;

  beforeEach(async () => {
    await resetTestData();
    server = createTestServer();
  });

  describe('Stripe Checkout', () => {
    it('should create checkout session', async () => {
      const mutation = `
        mutation CreateCheckoutSession($input: CheckoutSessionInput!) {
          createCheckoutSession(input: $input) {
            success
            sessionId
            url
          }
        }
      `;

      const variables = {
        input: {
          cartId: 'test-cart-id',
          successUrl: 'http://localhost:3000/success',
          cancelUrl: 'http://localhost:3000/cancel'
        }
      };

      const result = await executeOperation(server, { query: mutation, variables });
      
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect((data?.createCheckoutSession as any).success).toBe(true);
      expect((data?.createCheckoutSession as any).sessionId).toBe('mock-session-id');
      expect((data?.createCheckoutSession as any).url).toBe('https://checkout.stripe.com/mock-session');
    });
  });

  describe('Payment Intents', () => {
    it('should create payment intent', async () => {
      const mutation = `
        mutation CreatePaymentIntent($input: PaymentIntentInput!) {
          createPaymentIntent(input: $input) {
            success
            paymentIntentId
            clientSecret
          }
        }
      `;

      const variables = {
        input: {
          amount: 2000,
          currency: 'usd',
          orderId: 'test-order-id'
        }
      };

      const result = await executeOperation(server, { query: mutation, variables });
      
      console.log('Payment intent test result:', JSON.stringify(result, null, 2));
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect((data?.createPaymentIntent as any).success).toBe(true);
      expect((data?.createPaymentIntent as any).paymentIntentId).toBe('mock-payment-intent-id');
      expect((data?.createPaymentIntent as any).clientSecret).toBe('mock-client-secret');
    });

    it('should confirm payment intent', async () => {
      const mutation = `
        mutation ConfirmPaymentIntent($input: ConfirmPaymentInput!) {
          confirmPaymentIntent(input: $input) {
            success
            paymentIntent {
              id
              status
            }
          }
        }
      `;

      const variables = {
        input: {
          paymentIntentId: 'pi_test_mock'
        }
      };

      const result = await executeOperation(server, { query: mutation, variables });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect((data?.confirmPaymentIntent as any).success).toBe(true);
      expect((data?.confirmPaymentIntent as any).paymentIntent.id).toBe('pi_test_mock');
      expect((data?.confirmPaymentIntent as any).paymentIntent.status).toBe('succeeded');
    });
  });

  describe('Refunds', () => {
    it('should create refund', async () => {
      const mutation = `
        mutation CreateRefund($input: RefundInput!) {
          createRefund(input: $input) {
            success
            refund {
              id
              status
            }
          }
        }
      `;

      const variables = {
        input: {
          paymentIntentId: 'pi_test_mock',
          amount: 1000,
          reason: 'requested_by_customer'
        }
      };

      const result = await executeOperation(server, { query: mutation, variables });
      
      const data = result.body.kind === 'single' ? result.body.singleResult.data : result.body.initialResult.data;
      expect((data?.createRefund as any).success).toBe(true);
      expect((data?.createRefund as any).refund.id).toBe('mock-refund-id');
      expect((data?.createRefund as any).refund.status).toBe('succeeded');
    });
  });
});
