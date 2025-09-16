import React from 'react';
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ApolloProvider } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Mock Stripe
const mockStripe = loadStripe('pk_test_mock');

// Create mock client for Apollo
const mockClient = {
  query: vi.fn(),
  mutate: vi.fn(),
  watchQuery: vi.fn(),
  subscribe: vi.fn(),
  readQuery: vi.fn(),
  writeQuery: vi.fn(),
  readFragment: vi.fn(),
  writeFragment: vi.fn(),
  writeData: vi.fn(),
  resetStore: vi.fn(),
  clearStore: vi.fn(),
  onClearStore: vi.fn(),
  onResetStore: vi.fn(),
  cache: {
    readQuery: vi.fn(),
    writeQuery: vi.fn(),
    readFragment: vi.fn(),
    writeFragment: vi.fn(),
    writeData: vi.fn(),
    reset: vi.fn(),
    evict: vi.fn(),
    restore: vi.fn(),
    extract: vi.fn(),
    diff: vi.fn(),
    watch: vi.fn(),
    gc: vi.fn(),
    modify: vi.fn(),
    transform: vi.fn(),
    batch: vi.fn(),
    performTransaction: vi.fn(),
    recordOptimisticTransaction: vi.fn(),
    transformForLink: vi.fn(),
  },
} as any;

// Global test setup
beforeAll(() => {
  // Mock environment variables
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000/graphql';
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock';
  
  // Mock Next.js router
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({ id: 'test-id' }),
  }));

  // Mock Next.js Image component
  vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: any) => {
      return React.createElement('img', { src, alt, ...props });
    },
  }));

  // Mock Socket.IO
  vi.mock('socket.io-client', () => ({
    io: vi.fn(() => ({
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
      connected: true,
    })),
  }));

  // Mock Apollo Client
  vi.mock('@apollo/client', async () => {
    const actual = await vi.importActual('@apollo/client');
    return {
      ...actual,
      useQuery: vi.fn(() => ({
        data: null,
        loading: false,
        error: null,
        refetch: vi.fn(),
      })),
      useMutation: vi.fn(() => [
        vi.fn(),
        { loading: false, error: null, data: null }
      ]),
      useSubscription: vi.fn(() => ({
        data: null,
        loading: false,
        error: null,
      })),
      useApolloClient: vi.fn(() => mockClient),
    };
  });
});

afterAll(() => {
  cleanup();
});

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

// Custom render function with providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    mocks = [],
    addTypename = false,
  }: {
    mocks?: any[];
    addTypename?: boolean;
  } = {}
) {
  // Simple wrapper component
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      'div',
      { 'data-testid': 'test-wrapper' },
      children
    );
  };

  return render(ui, { wrapper: AllTheProviders });
}

// Export test utilities
export { mockStripe };
