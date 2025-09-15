import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { CourierDashboard } from '@/components/courier-dashboard';

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

describe('CourierDashboard Component', () => {
  it('renders courier dashboard', () => {
    const { getByText } = renderWithProviders(<CourierDashboard />);
    
    expect(getByText('Courier Dashboard')).toBeInTheDocument();
  });

  it('shows courier status', () => {
    const { getByText } = renderWithProviders(<CourierDashboard />);
    
    expect(getByText('Status:')).toBeInTheDocument();
  });

  it('displays available deliveries', () => {
    const { getByText } = renderWithProviders(<CourierDashboard />);
    
    expect(getByText('Available Deliveries')).toBeInTheDocument();
  });
});
