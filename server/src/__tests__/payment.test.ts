import { describe, it, expect, beforeEach } from 'vitest';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { createTestUser, resetTestData } from './utils/fixtures';
import { mockJWT, mockStripe } from './utils/mocks';
import { schema } from '../schema';

// Mock external dependencies
mockJWT();
mockStripe();

describe('Payment System', () => {
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

  describe('Stripe Checkout', () => {
    it('should create checkout session', async () => {
      const mutation = `
        mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
          createCheckoutSession(input: $input) {
            success
            message
            session {
              id
              url
            }
          }
        }
      `;

      const variables = {
        input: {
          orderId: 'test-order-id',
          successUrl: 'http://localhost:3000/success',
          cancelUrl: 'http://localhost:3000/cancel'
        }
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.createCheckoutSession.success).toBe(true);
      expect(result.data.createCheckoutSession.session.id).toBe('cs_test_mock');
      expect(result.data.createCheckoutSession.session.url).toBe('https://checkout.stripe.com/mock');
    });
  });

  describe('Payment Intents', () => {
    it('should create payment intent', async () => {
      const mutation = `
        mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
          createPaymentIntent(input: $input) {
            success
            message
            paymentIntent {
              id
              clientSecret
              status
            }
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

      const result = await mutate({ mutation, variables });
      
      expect(result.data.createPaymentIntent.success).toBe(true);
      expect(result.data.createPaymentIntent.paymentIntent.id).toBe('pi_test_mock');
      expect(result.data.createPaymentIntent.paymentIntent.clientSecret).toBe('pi_test_mock_secret');
    });

    it('should confirm payment intent', async () => {
      const mutation = `
        mutation ConfirmPaymentIntent($paymentIntentId: String!) {
          confirmPaymentIntent(paymentIntentId: $paymentIntentId) {
            success
            message
            paymentIntent {
              id
              status
            }
          }
        }
      `;

      const variables = {
        paymentIntentId: 'pi_test_mock'
      };

      const result = await mutate({ mutation, variables });
      
      expect(result.data.confirmPaymentIntent.success).toBe(true);
      expect(result.data.confirmPaymentIntent.paymentIntent.status).toBe('succeeded');
    });
  });

  describe('Refunds', () => {
    it('should create refund', async () => {
      const mutation = `
        mutation CreateRefund($input: CreateRefundInput!) {
          createRefund(input: $input) {
            success
            message
            refund {
              id
              status
              amount
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

      const result = await mutate({ mutation, variables });
      
      expect(result.data.createRefund.success).toBe(true);
      expect(result.data.createRefund.refund.id).toBe('re_test_mock');
      expect(result.data.createRefund.refund.status).toBe('succeeded');
    });
  });
});
