import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import CheckoutPage from '@/app/checkout/page';

// Mock the useCart hook
vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    cart: {
      id: 'test-cart-id',
      totalAmount: 25.99,
      itemCount: 2,
      items: [
        {
          id: '1',
          quantity: 1,
          menuItem: {
            name: 'Test Item',
            price: 12.99
          }
        }
      ]
    },
    loading: false,
    error: null
  })
}));

describe('Checkout Page', () => {
  it('renders checkout page', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />);
    
    expect(getByText('Checkout')).toBeInTheDocument();
  });

  it('shows cart total', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />);
    
    expect(getByText('$25.99')).toBeInTheDocument();
  });
});
