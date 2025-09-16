import { vi } from 'vitest';

// Mock Stripe
export function mockStripe() {
  const mockStripe = {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'cs_test_mock',
          url: 'https://checkout.stripe.com/mock'
        })
      }
    },
    billingPortal: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'bps_test_mock',
          url: 'https://billing.stripe.com/mock'
        })
      }
    },
    paymentIntents: {
      create: vi.fn().mockResolvedValue({
        id: 'pi_test_mock',
        client_secret: 'pi_test_mock_secret',
        status: 'requires_payment_method'
      }),
      confirm: vi.fn().mockResolvedValue({
        id: 'pi_test_mock',
        status: 'succeeded'
      }),
      cancel: vi.fn().mockResolvedValue({
        id: 'pi_test_mock',
        status: 'canceled'
      }),
      retrieve: vi.fn().mockResolvedValue({
        id: 'pi_test_mock',
        status: 'succeeded',
        amount: 2000,
        currency: 'usd'
      })
    },
    refunds: {
      create: vi.fn().mockResolvedValue({
        id: 're_test_mock',
        status: 'succeeded',
        amount: 1000
      })
    },
    webhooks: {
      constructEvent: vi.fn().mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_mock',
            payment_intent: 'pi_test_mock'
          }
        }
      })
    }
  };

  vi.mock('stripe', () => ({
    default: vi.fn(() => mockStripe)
  }));

  return mockStripe;
}

// Mock JWT
export function mockJWT() {
  vi.mock('jsonwebtoken', () => ({
    sign: vi.fn().mockReturnValue('mock-jwt-token'),
    verify: vi.fn().mockReturnValue({ userId: 'test-user-id', role: 'customer' })
  }));
}

// Mock bcrypt
export function mockBcrypt() {
  vi.mock('bcryptjs', () => ({
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn().mockResolvedValue(true)
  }));
}

// Mock Google Auth
export function mockGoogleAuth() {
  const mockGoogleAuth = {
    verifyIdToken: vi.fn().mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-id',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg'
      })
    })
  };

  vi.mock('google-auth-library', () => ({
    OAuth2Client: vi.fn(() => mockGoogleAuth)
  }));

  return mockGoogleAuth;
}

// Mock Socket.IO
export function mockSocketIO() {
  const mockSocket = {
    id: 'test-socket-id',
    emit: vi.fn(),
    on: vi.fn(),
    join: vi.fn(),
    leave: vi.fn(),
    to: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis()
  };

  const mockIO = {
    on: vi.fn(),
    emit: vi.fn(),
    to: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    sockets: {
      sockets: new Map([['test-socket-id', mockSocket]])
    }
  };

  vi.mock('socket.io', () => ({
    Server: vi.fn(() => mockIO)
  }));

  return { mockIO, mockSocket };
}

// Mock Apollo Server
export function mockApolloServer() {
  const mockServer = {
    listen: vi.fn().mockResolvedValue({ url: 'http://localhost:4000' }),
    stop: vi.fn().mockResolvedValue(undefined)
  };

  vi.mock('apollo-server-express', () => ({
    ApolloServer: vi.fn(() => mockServer)
  }));

  return mockServer;
}
