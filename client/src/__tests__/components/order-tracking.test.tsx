import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { OrderTracking } from '@/components/order-tracking';

// Mock Socket.IO
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connected: true
};

vi.mock('@/lib/socket', () => ({
  socket: mockSocket
}));

describe('OrderTracking Component', () => {
  it('renders order tracking interface', () => {
    const mockOrder = {
      id: 'test-order-id',
      status: 'preparing',
      totalAmount: 25.99,
      restaurant: {
        name: 'Test Restaurant',
        phone: '+1234567890'
      }
    };

    const { getByText } = renderWithProviders(
      <OrderTracking order={mockOrder} />
    );
    
    expect(getByText('Order Tracking')).toBeInTheDocument();
    expect(getByText('Test Restaurant')).toBeInTheDocument();
  });

  it('shows order status', () => {
    const mockOrder = {
      id: 'test-order-id',
      status: 'delivered',
      totalAmount: 25.99,
      restaurant: {
        name: 'Test Restaurant',
        phone: '+1234567890'
      }
    };

    const { getByText } = renderWithProviders(
      <OrderTracking order={mockOrder} />
    );
    
    expect(getByText('delivered')).toBeInTheDocument();
  });
});
