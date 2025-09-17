import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import OrderTrackingPage from '../../app/orders/[id]/page';

// Mock the useOrder hook
vi.mock('../../hooks/useOrders', () => ({
  useOrder: () => ({
    order: {
      id: 'test-order-id',
      status: 'preparing',
      totalAmount: 25.99,
      restaurant: {
        name: 'Test Restaurant',
        phone: '+1234567890'
      }
    },
    loading: false,
    error: null
  })
}));

// Mock the OrderTracking component
vi.mock('../../components/OrderTracking', () => ({
  OrderTracking: () => <div data-testid="order-tracking">Order Tracking</div>
}));

describe('Order Tracking Page', () => {
  it('renders order tracking component', () => {
    const { getByTestId } = renderWithProviders(<OrderTrackingPage />);
    
    expect(getByTestId('order-tracking')).toBeInTheDocument();
  });
});
