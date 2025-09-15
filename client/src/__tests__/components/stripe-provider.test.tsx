import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { StripeProvider } from '@/components/stripe-provider';

// Mock Stripe
const mockStripe = {
  elements: vi.fn(),
  confirmPayment: vi.fn(),
  confirmCardPayment: vi.fn(),
  retrievePaymentIntent: vi.fn()
};

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(mockStripe))
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
    const { loadStripe } = require('@stripe/stripe-js');
    
    renderWithProviders(
      <StripeProvider>
        <div>Test Content</div>
      </StripeProvider>
    );
    
    expect(loadStripe).toHaveBeenCalledWith(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  });
});
