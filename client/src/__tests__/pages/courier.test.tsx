import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import CourierPage from '@/app/courier/page';

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
