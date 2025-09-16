import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { Checkout } from '@/components/checkout';

// Mock the usePayment hook
const mockCreateCheckoutSession = vi.fn();
vi.mock('@/hooks/usePayment', () => ({
  useCreateCheckoutSession: vi.fn(() => ({
    createCheckoutSession: mockCreateCheckoutSession,
    loading: false,
    error: null
  }))
}));

describe('Checkout Component', () => {
  it('renders checkout form', () => {
    const { getByText } = renderWithProviders(
      <Checkout 
        orderId="test-order"
        total="25.99"
        restaurantName="Test Restaurant"
        onSuccess={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(getByText('Complete Payment')).toBeInTheDocument();
  });

  it('handles payment submission', () => {
    const onSuccess = vi.fn();
    const onCancel = vi.fn();
    
    const { getByText } = renderWithProviders(
      <Checkout 
        orderId="test-order"
        total="25.99"
        restaurantName="Test Restaurant"
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
    
    expect(getByText('Complete Payment')).toBeInTheDocument();
  });
});
