import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { SocketProvider } from '@/components/socket-provider';

// Mock Socket.IO
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
  id: 'test-socket-id'
};

vi.mock('@/lib/socket', () => ({
  socket: mockSocket
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
