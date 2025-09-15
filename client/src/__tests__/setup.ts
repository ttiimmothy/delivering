import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ApolloProvider } from '@apollo/client';
import { createMockClient } from 'apollo-mock-client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Mock Stripe
const mockStripe = loadStripe('pk_test_mock');

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
  }));

  // Mock Next.js Image component
  vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: any) => (
      <img src={src} alt={alt} {...props} />
    ),
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
  const mockClient = createMockClient({
    mocks,
    addTypename,
  });

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
    <ApolloProvider client={mockClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Elements stripe={mockStripe}>
          {children}
        </Elements>
      </ThemeProvider>
    </ApolloProvider>
  );

  return render(ui, { wrapper: AllTheProviders });
}

// Export test utilities
export { mockStripe };
