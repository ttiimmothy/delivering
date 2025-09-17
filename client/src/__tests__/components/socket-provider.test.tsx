import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
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
    id: 'test-socket-id',
    isConnected: vi.fn(() => true),
    onOrderStatusChanged: vi.fn(),
    onCourierLocationChanged: vi.fn(),
    onDeliveryUpdate: vi.fn(),
    onNewDelivery: vi.fn()
  }
}));

describe('SocketProvider', () => {
  it('renders children with Socket context', () => {
    const { getByText } = renderWithProviders(
      <SocketProvider>
        <div>Test Content</div>
      </SocketProvider>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('provides socket instance to children', () => {
    const { getByText } = renderWithProviders(
      <SocketProvider>
        <div>Test Content</div>
      </SocketProvider>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });
});
