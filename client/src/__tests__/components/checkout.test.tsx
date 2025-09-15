import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { Checkout } from '@/components/checkout';

// Mock the usePayment hook
vi.mock('@/hooks/usePayment', () => ({
  usePayment: () => ({
    createCheckoutSession: vi.fn().mockResolvedValue({
      success: true,
      session: { id: 'cs_test', url: 'https://checkout.stripe.com/test' }
    }),
    loading: false,
    error: null
  })
}));

describe('Checkout Component', () => {
  it('renders checkout form', () => {
    const { getByText } = renderWithProviders(<Checkout />);
    
    expect(getByText('Checkout')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(require('@/hooks/usePayment').usePayment).mockReturnValue({
      createCheckoutSession: vi.fn(),
      loading: true,
      error: null
    });

    const { getByText } = renderWithProviders(<Checkout />);
    
    expect(getByText('Processing...')).toBeInTheDocument();
  });
});
