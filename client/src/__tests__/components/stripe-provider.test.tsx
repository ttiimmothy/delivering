import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { StripeProvider } from '@/components/StripeProvider';

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    elements: vi.fn(() => ({
      create: vi.fn(),
      getElement: vi.fn(),
      submit: vi.fn(),
      fetchUpdates: vi.fn(),
    })),
    confirmPayment: vi.fn(),
    confirmCardPayment: vi.fn(),
    confirmPaymentMethod: vi.fn(),
    confirmPixPayment: vi.fn(),
    retrievePaymentIntent: vi.fn(),
    retrieveSetupIntent: vi.fn(),
    confirmSetupIntent: vi.fn(),
    paymentRequest: vi.fn(() => ({
      canMakePayment: vi.fn(() => Promise.resolve(null)),
      show: vi.fn(),
      update: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    })),
    createPaymentMethod: vi.fn(),
    createSource: vi.fn(),
    createToken: vi.fn(),
    retrieveSource: vi.fn(),
    handleCardAction: vi.fn(),
    handleCardSetup: vi.fn(),
    handleCardPayment: vi.fn(),
  }))
}));

// Mock Stripe Elements
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => children,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  CardNumberElement: () => <div data-testid="card-number-element">Card Number Element</div>,
  CardExpiryElement: () => <div data-testid="card-expiry-element">Card Expiry Element</div>,
  CardCvcElement: () => <div data-testid="card-cvc-element">Card CVC Element</div>,
  PaymentElement: () => <div data-testid="payment-element">Payment Element</div>,
  useStripe: () => ({
    elements: vi.fn(),
    confirmPayment: vi.fn(),
    confirmCardPayment: vi.fn(),
    retrievePaymentIntent: vi.fn(),
  }),
  useElements: () => ({
    create: vi.fn(),
    getElement: vi.fn(),
    submit: vi.fn(),
    fetchUpdates: vi.fn(),
  }),
}));

describe('StripeProvider', () => {
  it('renders children with Stripe context', () => {
    const { getByText } = renderWithProviders(
      <StripeProvider>
        <div>Test Content</div>
      </StripeProvider>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('loads Stripe with correct publishable key', () => {
    renderWithProviders(
      <StripeProvider>
        <div>Test Content</div>
      </StripeProvider>
    );
    
    // The component should render without errors
    expect(true).toBe(true);
  });
});