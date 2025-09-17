import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { UserMenu } from '@/components/UserMenu';
import { fireEvent } from '@testing-library/react';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    },
    logout: vi.fn(),
    loading: false
  })
}));

describe('UserMenu Component', () => {
  it('renders user menu when authenticated', () => {
    const { getByText } = renderWithProviders(<UserMenu />);
    
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('shows logout option', () => {
    const { getByText, getByRole } = renderWithProviders(<UserMenu />);
    
    // Click the user menu button to open dropdown
    const userButton = getByRole('button');
    fireEvent.click(userButton);
    
    expect(getByText('Sign Out')).toBeInTheDocument();
  });
});
