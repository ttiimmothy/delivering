import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import CheckoutPage from '@/app/checkout/page';

// Mock the useOrder hook
vi.mock('@/hooks/useOrders', () => ({
  useOrder: () => ({
    order: {
      id: 'test-order-id',
      total: 25.99,
      subtotal: 22.99,
      tax: 1.50,
      deliveryFee: 1.50,
      tip: 0,
      status: 'pending',
      restaurant: {
        name: 'Test Restaurant'
      },
      items: [
        {
          id: '1',
          quantity: 1,
          totalPrice: 12.99,
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

// Mock useSearchParams to return a valid orderId
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/checkout',
  useSearchParams: () => new URLSearchParams('orderId=test-order-id&method=checkout'),
  useParams: () => ({ id: 'test-id' }),
}));

describe('Checkout Page', () => {
  it('renders checkout page', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />);
    
    expect(getByText('Complete Your Payment')).toBeInTheDocument();
  });

  it('shows cart total', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />);
    
    // Look for the total in the order summary section specifically
    const totalElement = getByText('Total').parentElement?.querySelector('span:last-child');
    expect(totalElement).toHaveTextContent('$25.99');
  });
});
