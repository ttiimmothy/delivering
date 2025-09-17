import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { OrderTracking } from '@/components/OrderTracking';
import { SocketProvider } from '@/components/SocketProvider';

// Mock Socket.IO
vi.mock('@/lib/socket', () => ({
  default: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
    isConnected: vi.fn(() => true),
    onOrderStatusChanged: vi.fn(),
    offOrderStatusChanged: vi.fn(),
    onCourierLocationChanged: vi.fn(),
    offCourierLocationChanged: vi.fn(),
    onDeliveryUpdate: vi.fn(),
    offDeliveryUpdate: vi.fn(),
    onNewDelivery: vi.fn(),
    offNewDelivery: vi.fn()
  }
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
      <SocketProvider>
        <OrderTracking order={mockOrder} />
      </SocketProvider>
    );
    
    expect(getByText('Order Status')).toBeInTheDocument();
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
      <SocketProvider>
        <OrderTracking order={mockOrder} />
      </SocketProvider>
    );
    
    expect(getByText('Delivered')).toBeInTheDocument();
  });
});
