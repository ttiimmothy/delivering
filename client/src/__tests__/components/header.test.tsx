import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { Header } from '@/components/header';

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

describe('Header Component', () => {
  it('renders header with navigation', () => {
    const { getByText } = renderWithProviders(<Header />);
    
    expect(getByText('Delivering')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    const { getByText } = renderWithProviders(<Header />);
    
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('shows theme toggle', () => {
    const { getByRole } = renderWithProviders(<Header />);
    
    const themeButton = getByRole('button', { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();
  });
});
