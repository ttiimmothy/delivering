import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import CourierPage from '@/app/courier/page';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'courier'
    },
    loading: false
  })
}));

// Mock the CourierDashboard component
vi.mock('@/components/courier-dashboard', () => ({
  CourierDashboard: () => <div data-testid="courier-dashboard">Courier Dashboard</div>
}));

describe('Courier Page', () => {
  it('renders courier dashboard', () => {
    const { getByTestId } = renderWithProviders(<CourierPage />);
    
    expect(getByTestId('courier-dashboard')).toBeInTheDocument();
  });
});
