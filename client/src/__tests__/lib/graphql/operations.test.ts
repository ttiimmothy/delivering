import { describe, it, expect } from 'vitest';
import { gql } from '@apollo/client';
import {
  loginMutation,
  signupMutation,
  refreshTokenMutation,
  restaurantsQuery,
  restaurantQuery,
  cartQuery,
  addToCartMutation,
  updateCartItemMutation,
  removeFromCartMutation,
  clearCartMutation,
  ordersQuery,
  orderQuery,
  placeOrderMutation,
  createCheckoutSessionMutation,
  createPaymentIntentMutation,
  orderStatusChangedSubscription,
  courierLocationSubscription
} from '../../../lib/graphql/operations';

describe('GraphQL Operations', () => {
  describe('Authentication Operations', () => {
    it('should define loginMutation correctly', () => {
      expect(loginMutation).toBeDefined();
      expect(loginMutation.kind).toBe('Document');
      expect(loginMutation.definitions[0].kind).toBe('OperationDefinition');
      expect((loginMutation.definitions[0] as any).operation).toBe('mutation');
    });

    it('should define signupMutation correctly', () => {
      expect(signupMutation).toBeDefined();
      expect(signupMutation.kind).toBe('Document');
      expect(signupMutation.definitions[0].kind).toBe('OperationDefinition');
      expect((signupMutation.definitions[0] as any).operation).toBe('mutation');
    });

    it('should define refreshTokenMutation correctly', () => {
      expect(refreshTokenMutation).toBeDefined();
      expect(refreshTokenMutation.kind).toBe('Document');
      expect(refreshTokenMutation.definitions[0].kind).toBe('OperationDefinition');
      expect((refreshTokenMutation.definitions[0] as any).operation).toBe('mutation');
    });
  });

  describe('Restaurant Operations', () => {
    it('should define restaurantsQuery correctly', () => {
      expect(restaurantsQuery).toBeDefined();
      expect(restaurantsQuery.kind).toBe('Document');
      expect(restaurantsQuery.definitions[0].kind).toBe('OperationDefinition');
      expect((restaurantsQuery.definitions[0] as any).operation).toBe('query');
    });

    it('should define restaurantQuery correctly', () => {
      expect(restaurantQuery).toBeDefined();
      expect(restaurantQuery.kind).toBe('Document');
      expect(restaurantQuery.definitions[0].kind).toBe('OperationDefinition');
      expect((restaurantQuery.definitions[0] as any).operation).toBe('query');
    });
  });

  describe('Cart Operations', () => {
    it('should define cartQuery correctly', () => {
      expect(cartQuery).toBeDefined();
      expect(cartQuery.kind).toBe('Document');
      expect(cartQuery.definitions[0].kind).toBe('OperationDefinition');
      expect((cartQuery.definitions[0] as any).operation).toBe('query');
    });

    it('should define addToCartMutation correctly', () => {
      expect(addToCartMutation).toBeDefined();
      expect(addToCartMutation.kind).toBe('Document');
      expect(addToCartMutation.definitions[0].kind).toBe('OperationDefinition');
      expect((addToCartMutation.definitions[0] as any).operation).toBe('mutation');
    });
  });

  describe('Order Operations', () => {
    it('should define ordersQuery correctly', () => {
      expect(ordersQuery).toBeDefined();
      expect(ordersQuery.kind).toBe('Document');
      expect(ordersQuery.definitions[0].kind).toBe('OperationDefinition');
      expect((ordersQuery.definitions[0] as any).operation).toBe('query');
    });

    it('should define placeOrderMutation correctly', () => {
      expect(placeOrderMutation).toBeDefined();
      expect(placeOrderMutation.kind).toBe('Document');
      expect(placeOrderMutation.definitions[0].kind).toBe('OperationDefinition');
      expect((placeOrderMutation.definitions[0] as any).operation).toBe('mutation');
    });
  });

  describe('Payment Operations', () => {
    it('should define createCheckoutSessionMutation correctly', () => {
      expect(createCheckoutSessionMutation).toBeDefined();
      expect(createCheckoutSessionMutation.kind).toBe('Document');
      expect(createCheckoutSessionMutation.definitions[0].kind).toBe('OperationDefinition');
      expect((createCheckoutSessionMutation.definitions[0] as any).operation).toBe('mutation');
    });

    it('should define createPaymentIntentMutation correctly', () => {
      expect(createPaymentIntentMutation).toBeDefined();
      expect(createPaymentIntentMutation.kind).toBe('Document');
      expect(createPaymentIntentMutation.definitions[0].kind).toBe('OperationDefinition');
      expect((createPaymentIntentMutation.definitions[0] as any).operation).toBe('mutation');
    });
  });

  describe('Subscription Operations', () => {
    it('should define orderStatusChangedSubscription correctly', () => {
      expect(orderStatusChangedSubscription).toBeDefined();
      expect(orderStatusChangedSubscription.kind).toBe('Document');
      expect(orderStatusChangedSubscription.definitions[0].kind).toBe('OperationDefinition');
      expect((orderStatusChangedSubscription.definitions[0] as any).operation).toBe('subscription');
    });

    it('should define courierLocationSubscription correctly', () => {
      expect(courierLocationSubscription).toBeDefined();
      expect(courierLocationSubscription.kind).toBe('Document');
      expect(courierLocationSubscription.definitions[0].kind).toBe('OperationDefinition');
      expect((courierLocationSubscription.definitions[0] as any).operation).toBe('subscription');
    });
  });
});
