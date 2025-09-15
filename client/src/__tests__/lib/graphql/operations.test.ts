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
} from '@/lib/graphql/operations';

describe('GraphQL Operations', () => {
  describe('Authentication Operations', () => {
    it('should define loginMutation correctly', () => {
      expect(loginMutation).toContain('mutation Login');
      expect(loginMutation).toContain('input: LoginInput!');
      expect(loginMutation).toContain('accessToken');
      expect(loginMutation).toContain('refreshToken');
      expect(loginMutation).toContain('user');
    });

    it('should define signupMutation correctly', () => {
      expect(signupMutation).toContain('mutation Signup');
      expect(signupMutation).toContain('input: SignupInput!');
      expect(signupMutation).toContain('accessToken');
      expect(signupMutation).toContain('refreshToken');
      expect(signupMutation).toContain('user');
    });

    it('should define refreshTokenMutation correctly', () => {
      expect(refreshTokenMutation).toContain('mutation RefreshToken');
      expect(refreshTokenMutation).toContain('accessToken');
      expect(refreshTokenMutation).toContain('refreshToken');
    });
  });

  describe('Restaurant Operations', () => {
    it('should define restaurantsQuery correctly', () => {
      expect(restaurantsQuery).toContain('query Restaurants');
      expect(restaurantsQuery).toContain('cuisine: String');
      expect(restaurantsQuery).toContain('id');
      expect(restaurantsQuery).toContain('name');
      expect(restaurantsQuery).toContain('cuisine');
    });

    it('should define restaurantQuery correctly', () => {
      expect(restaurantQuery).toContain('query Restaurant');
      expect(restaurantQuery).toContain('slug: String!');
      expect(restaurantQuery).toContain('restaurant');
    });
  });

  describe('Cart Operations', () => {
    it('should define cartQuery correctly', () => {
      expect(cartQuery).toContain('query Cart');
      expect(cartQuery).toContain('cart');
      expect(cartQuery).toContain('restaurantId');
      expect(cartQuery).toContain('items');
    });

    it('should define addToCartMutation correctly', () => {
      expect(addToCartMutation).toContain('mutation AddToCart');
      expect(addToCartMutation).toContain('input: AddToCartInput!');
      expect(addToCartMutation).toContain('id');
      expect(addToCartMutation).toContain('menuItemId');
    });
  });

  describe('Order Operations', () => {
    it('should define ordersQuery correctly', () => {
      expect(ordersQuery).toContain('query Orders');
      expect(ordersQuery).toContain('orders');
      expect(ordersQuery).toContain('id');
      expect(ordersQuery).toContain('status');
    });

    it('should define placeOrderMutation correctly', () => {
      expect(placeOrderMutation).toContain('mutation PlaceOrder');
      expect(placeOrderMutation).toContain('input: CreateOrderInput!');
      expect(placeOrderMutation).toContain('id');
      expect(placeOrderMutation).toContain('orderNumber');
    });
  });

  describe('Payment Operations', () => {
    it('should define createCheckoutSessionMutation correctly', () => {
      expect(createCheckoutSessionMutation).toContain('mutation CreateCheckoutSession');
      expect(createCheckoutSessionMutation).toContain('input: CreateCheckoutSessionInput!');
      expect(createCheckoutSessionMutation).toContain('id');
      expect(createCheckoutSessionMutation).toContain('url');
    });

    it('should define createPaymentIntentMutation correctly', () => {
      expect(createPaymentIntentMutation).toContain('mutation CreatePaymentIntent');
      expect(createPaymentIntentMutation).toContain('input: CreatePaymentIntentInput!');
      expect(createPaymentIntentMutation).toContain('id');
      expect(createPaymentIntentMutation).toContain('clientSecret');
    });
  });

  describe('Subscription Operations', () => {
    it('should define orderStatusChangedSubscription correctly', () => {
      expect(orderStatusChangedSubscription).toContain('subscription OrderStatusChanged');
      expect(orderStatusChangedSubscription).toContain('orderId: String!');
      expect(orderStatusChangedSubscription).toContain('orderStatusChanged');
    });

    it('should define courierLocationSubscription correctly', () => {
      expect(courierLocationSubscription).toContain('subscription CourierLocation');
      expect(courierLocationSubscription).toContain('deliveryId: String!');
      expect(courierLocationSubscription).toContain('courierLocation');
    });
  });
});
