import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import CheckoutPage from '@/app/checkout/page';

// Mock the useOrder hook
vi.mock('@/hooks/useOrders', () => ({
  useOrder: () => ({
    order: {
      id: 'test-order-id',
      orderNumber: 'ORD-123',
      total: '25.99',
      subtotal: '20.99',
      tax: '2.00',
      deliveryFee: '2.00',
      tip: '1.00',
      restaurant: {
        id: 'rest-1',
        name: 'Test Restaurant'
      },
      items: [
        {
          id: '1',
          quantity: 1,
          totalPrice: '12.99',
          menuItem: {
            name: 'Test Item'
          }
        }
      ]
    },
    loading: false,
    error: null
  })
}));

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
  useSearchParams: () => new URLSearchParams('?orderId=test-order-id&method=checkout'),
}));

describe('Checkout Page', () => {
  it('renders checkout page', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />);
    
    expect(getByText('Complete Your Payment')).toBeInTheDocument();
  });

  it('shows order total', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />);
    
    // Look for the total in the order summary section
    const totalElement = getByText('Total');
    expect(totalElement.parentElement).toHaveTextContent('$25.99');
  });
});
