import {ReactNode, ReactElement, createElement} from 'react';
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
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

// Removed global Apollo Client mock - individual tests will handle their own mocking


// Global test setup
beforeAll(() => {
  // Make React available globally
  // global.React = React;
  
  // Mock window.matchMedia for next-themes
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  
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
      return createElement('img', { src, alt, ...props });
    },
  }));

  // Mock Next.js font functions
  vi.mock('next/font/google', () => ({
    Inter: vi.fn(() => ({ className: 'inter-font' })),
    Roboto: vi.fn(() => ({ className: 'roboto-font' })),
    Open_Sans: vi.fn(() => ({ className: 'open-sans-font' })),
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
      id: 'test-socket-id',
      isConnected: vi.fn(() => true),
      onOrderStatusChanged: vi.fn(),
      offOrderStatusChanged: vi.fn(),
      onCourierLocationChanged: vi.fn(),
      offCourierLocationChanged: vi.fn(),
      onDeliveryUpdate: vi.fn(),
      offDeliveryUpdate: vi.fn(),
      onNewDelivery: vi.fn(),
      offNewDelivery: vi.fn(),
    })),
  }));

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
  ui: ReactElement,
  {
    mocks = [],
    addTypename = false,
  }: {
    mocks?: any[];
    addTypename?: boolean;
  } = {}
) {
  // Simple wrapper component - Apollo Client is already mocked globally
  const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return createElement(
      'div',
      { 'data-testid': 'test-wrapper' },
      children
    );
  };

  return render(ui, { wrapper: AllTheProviders });
}

// Export test utilities
export { mockStripe };
