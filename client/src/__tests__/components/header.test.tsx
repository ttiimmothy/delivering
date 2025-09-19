import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { Header } from '../../components/Header';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
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

// Mock the useCart hook
vi.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    itemCount: 0,
    items: [],
    total: 0,
    loading: false,
    error: null
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
