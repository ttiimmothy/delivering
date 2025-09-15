import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { PaymentForm } from '@/components/payment-form';

// Mock Stripe Elements
vi.mock('@stripe/react-stripe-js', () => ({
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  useStripe: () => ({
    confirmCardPayment: vi.fn().mockResolvedValue({
      paymentIntent: { status: 'succeeded' }
    })
  }),
  useElements: () => ({
    getElement: vi.fn().mockReturnValue({
      confirmPayment: vi.fn().mockResolvedValue({
        paymentIntent: { status: 'succeeded' }
      })
    })
  })
}));

describe('PaymentForm Component', () => {
  it('renders payment form', () => {
    const { getByText, getByTestId } = renderWithProviders(<PaymentForm />);
    
    expect(getByText('Payment Details')).toBeInTheDocument();
    expect(getByTestId('card-element')).toBeInTheDocument();
  });

  it('shows submit button', () => {
    const { getByText } = renderWithProviders(<PaymentForm />);
    
    expect(getByText('Pay Now')).toBeInTheDocument();
  });
});
