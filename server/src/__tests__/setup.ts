import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { beforeAll, afterAll } from 'vitest';
import { createTestDatabase, dropTestDatabase } from './lib/database';
import { mockData } from './lib/fixtures';

// Simple test schema for basic testing
const typeDefs = gql`
  type Query {
    hello: String
    cart: Cart
    restaurants: [Restaurant!]!
    restaurant(id: ID!): Restaurant
    me: User
  }

  type Mutation {
    addToCart(input: AddToCartInput!): CartItem
    updateCartItem(input: UpdateCartItemInput!): CartItem
    removeFromCart(input: RemoveFromCartInput!): Boolean
    clearCart: Boolean
    signup(input: SignupInput!): AuthResponse
    login(input: LoginInput!): AuthResponse
    createRestaurant(input: CreateRestaurantInput!): Restaurant
    updateRestaurant(id: ID!, input: UpdateRestaurantInput!): Restaurant
    createCheckoutSession(input: CheckoutSessionInput!): CheckoutResponse
    createPaymentIntent(input: PaymentIntentInput!): PaymentResponse
    confirmPaymentIntent(input: ConfirmPaymentInput!): PaymentResponse
    createRefund(input: RefundInput!): RefundResponse
  }

  type Cart {
    id: ID!
    userId: ID!
    restaurantId: ID!
    totalAmount: Float!
    itemCount: Int!
    items: [CartItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type CartItem {
    id: ID!
    cartId: ID!
    menuItemId: ID!
    quantity: Int!
    price: Float!
    selectedOptions: [String!]!
    specialInstructions: String
    menuItem: MenuItem!
    createdAt: String!
    updatedAt: String!
  }

  type MenuItem {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    isAvailable: Boolean!
    image: String
  }

  type Restaurant {
    id: ID!
    name: String!
    description: String!
    address: String!
    city: String!
    state: String!
    zipCode: String!
    phone: String!
    email: String!
    cuisine: String!
    rating: Float!
    reviewCount: Int!
    deliveryTime: Int!
    deliveryFee: Float!
    minimumOrder: Float!
    isActive: Boolean!
    isOpen: Boolean!
    image: String
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    phone: String!
    role: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthResponse {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type CheckoutResponse {
    success: Boolean!
    sessionId: String
    url: String
  }

  type PaymentResponse {
    success: Boolean!
    clientSecret: String
    paymentIntentId: String
    paymentIntent: PaymentIntent
  }

  type RefundResponse {
    success: Boolean!
    refundId: String
    refund: Refund
  }

  type PaymentIntent {
    id: String!
    status: String!
  }

  type Refund {
    id: String!
    status: String!
  }

  input AddToCartInput {
    menuItemId: ID!
    quantity: Int!
  }

  input UpdateCartItemInput {
    cartItemId: ID!
    quantity: Int!
  }

  input RemoveFromCartInput {
    cartItemId: ID!
  }

  input SignupInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateRestaurantInput {
    name: String!
    description: String!
    address: String!
    city: String!
    state: String!
    zipCode: String!
    phone: String!
    email: String!
    cuisine: String!
    deliveryTime: Int!
    deliveryFee: Float!
    minimumOrder: Float!
  }

  input UpdateRestaurantInput {
    name: String
    description: String
    address: String
    city: String
    state: String
    zipCode: String
    phone: String
    email: String
    cuisine: String
    deliveryTime: Int
    deliveryFee: Float
    minimumOrder: Float
    isActive: Boolean
    isOpen: Boolean
  }

  input CheckoutSessionInput {
    cartId: ID!
    successUrl: String!
    cancelUrl: String!
  }

  input PaymentIntentInput {
    amount: Float!
    currency: String!
    orderId: ID!
  }

  input ConfirmPaymentInput {
    paymentIntentId: String!
  }

  input RefundInput {
    paymentIntentId: String!
    amount: Float
    reason: String
  }
`;

// Mock data store
let mockCarts: any[] = [];
let mockCartItems: any[] = [];
let mockRestaurants: any[] = [];
let mockUsers: any[] = [];

const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    cart: (_, __, context) => {
      // Return null if no cart exists for the user
      const userCart = mockCarts.find(cart => cart.userId === context.user?.id);
      if (!userCart) {
        return null;
      }
      
      return {
        ...userCart,
        items: mockCartItems.filter(item => item.cartId === userCart.id),
      };
    },
    restaurants: () => mockData.restaurants,
    restaurant: (_, { id }) => mockData.restaurants.find(r => r.id === id) || null,
    me: (_, __, context) => {
      if (context.user) {
        return context.user;
      }
      // If no user in context, return the first user from mock data
      return mockData.users[0] || null;
    },
  },
  Mutation: {
    addToCart: (_, { input }, context) => {
      const cartItem = {
        id: 'test-cart-item-id',
        cartId: 'test-cart-id',
        menuItemId: input.menuItemId,
        quantity: input.quantity,
        price: 9.99,
        selectedOptions: [],
        specialInstructions: null,
        menuItem: {
          id: input.menuItemId,
          name: 'Test Burger',
          description: 'A test burger',
          price: 9.99,
          category: 'Main',
          isAvailable: true,
          image: 'https://example.com/burger.jpg',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockCartItems.push(cartItem);
      return cartItem;
    },
    updateCartItem: (_, { input }) => {
      const cartItem = mockCartItems.find(item => item.id === input.cartItemId);
      if (cartItem) {
        cartItem.quantity = input.quantity;
        cartItem.updatedAt = new Date().toISOString();
      }
      return cartItem || {
        id: input.cartItemId,
        cartId: 'test-cart-id',
        menuItemId: 'test-menu-item-id',
        quantity: input.quantity,
        price: 9.99,
        selectedOptions: [],
        specialInstructions: null,
        menuItem: {
          id: 'test-menu-item-id',
          name: 'Test Burger',
          description: 'A test burger',
          price: 9.99,
          category: 'Main',
          isAvailable: true,
          image: 'https://example.com/burger.jpg',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    removeFromCart: (_, { input }) => {
      const index = mockCartItems.findIndex(item => item.id === input.cartItemId);
      if (index > -1) {
        mockCartItems.splice(index, 1);
        return true;
      }
      return false;
    },
    clearCart: (_, __, context) => {
      const userCart = mockCarts.find(cart => cart.userId === context.user?.id);
      if (userCart) {
        mockCartItems = mockCartItems.filter(item => item.cartId !== userCart.id);
        return true;
      }
      return false;
    },
    signup: (_, { input }) => {
      // Check if user already exists
      const existingUser = mockData.users.find(u => u.email === input.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const user = {
        id: 'test-user-id',
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: 'customer',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.users.push(user);
      return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user,
      };
    },
    login: (_, { input }) => {
      const user = mockData.users.find(u => u.email === input.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user,
      };
    },
    createRestaurant: (_, { input }) => {
      const restaurant = {
        id: 'test-restaurant-id',
        ...input,
        rating: 4.5,
        reviewCount: 0,
        isActive: true,
        isOpen: true,
        image: 'https://example.com/restaurant.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRestaurants.push(restaurant);
      mockData.restaurants.push(restaurant);
      return restaurant;
    },
    updateRestaurant: (_, { id, input }) => {
      const restaurant = mockData.restaurants.find(r => r.id === id);
      if (restaurant) {
        Object.assign(restaurant, input);
        restaurant.updatedAt = new Date().toISOString();
        return restaurant;
      }
      return null;
    },
    createCheckoutSession: (_, { input }) => {
      return {
        success: true,
        sessionId: 'mock-session-id',
        url: 'https://checkout.stripe.com/mock-session',
      };
    },
    createPaymentIntent: (_, { input }) => {
      return {
        success: true,
        paymentIntentId: 'mock-payment-intent-id',
        clientSecret: 'mock-client-secret',
      };
    },
    confirmPaymentIntent: (_, { input }) => {
      return {
        success: true,
        paymentIntentId: input.paymentIntentId,
        clientSecret: 'mock-client-secret',
        paymentIntent: {
          id: input.paymentIntentId,
          status: 'succeeded',
        },
      };
    },
    createRefund: (_, { input }) => {
      return {
        success: true,
        refundId: 'mock-refund-id',
        refund: {
          id: 'mock-refund-id',
          status: 'succeeded',
        },
      };
    },
  },
};

// Initialize test database before all tests
beforeAll(async () => {
  // Skip database setup if TEST_DATABASE_URL is not set
  if (!process.env.TEST_DATABASE_URL) {
    console.log('ℹ️  TEST_DATABASE_URL not set, using mock data only');
    return;
  }
  
  try {
    await createTestDatabase();
  } catch (error) {
    console.warn('Test database setup failed, tests will use mock data:', error);
  }
});

// Clean up test database after all tests
afterAll(async () => {
  try {
  await dropTestDatabase();
  } catch (error) {
    console.warn('Test database cleanup failed:', error);
  }
});

// Create a test server instance
export const createTestServer = (context: any = {}) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: false,
  });

  return server;
};

// Helper function to create a test cart
export const createTestCart = (overrides: any = {}) => {
  const cart = {
    id: 'test-cart-id',
    userId: 'test-user-id',
    restaurantId: 'test-restaurant-id',
    totalAmount: 0,
    itemCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
  mockCarts.push(cart);
  return cart;
};

// Helper function to reset mock data
export const resetMockData = () => {
  mockCarts = [];
  mockCartItems = [];
  mockRestaurants = [];
  mockUsers = [];
  mockData.users = []; // Reset users from shared mockData
  mockData.restaurants = []; // Reset restaurants from shared mockData
};

// Helper function to execute GraphQL operations
export const executeOperation = async (server: ApolloServer, operation: any, context: any = {}) => {
  const result = await server.executeOperation(operation, {
    contextValue: context,
  });
  return result;
};