import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { CourierDashboard } from '@/components/CourierDashboard';
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
    onCourierLocationChanged: vi.fn(),
    onDeliveryUpdate: vi.fn(),
    onNewDelivery: vi.fn()
  }
}));

describe('CourierDashboard Component', () => {
  it('renders courier dashboard', () => {
    const { getByText } = renderWithProviders(
      <SocketProvider>
        <CourierDashboard />
      </SocketProvider>
    );
    
    expect(getByText('Courier Status')).toBeInTheDocument();
  });

  it('shows courier status', () => {
    const { getByText } = renderWithProviders(
      <SocketProvider>
        <CourierDashboard />
      </SocketProvider>
    );
    
    expect(getByText('Availability Status')).toBeInTheDocument();
  });

  it('displays available deliveries', () => {
    const { getByText } = renderWithProviders(
      <SocketProvider>
        <CourierDashboard />
      </SocketProvider>
    );
    
    expect(getByText("Today's Stats")).toBeInTheDocument();
  });
});
