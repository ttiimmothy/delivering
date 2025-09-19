import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../setup';
import LoginPage from '../../../app/login/page';

// Mock the useAuth hook
const mockLogin = vi.fn();
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    signup: vi.fn(),
    loginWithGoogle: vi.fn(),
    refreshToken: vi.fn(),
    logout: vi.fn(),
    refetchMe: vi.fn(),
    error: null
  })
}));

describe('Login Page', () => {
  it('renders login form', () => {
    const { getByRole, getByLabelText } = renderWithProviders(<LoginPage />);
    
    expect(getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(getByLabelText(/Email/)).toBeInTheDocument();
    expect(getByLabelText(/Password/)).toBeInTheDocument();
  });

  it('shows login button', () => {
    const { getByRole } = renderWithProviders(<LoginPage />);
    
    expect(getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
