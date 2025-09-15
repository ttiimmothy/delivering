import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import LoginPage from '@/app/login/page';

// Mock the useAuth hook
const mockLogin = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: false,
    error: null
  })
}));

describe('Login Page', () => {
  it('renders login form', () => {
    const { getByText, getByLabelText } = renderWithProviders(<LoginPage />);
    
    expect(getByText('Sign In')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows login button', () => {
    const { getByText } = renderWithProviders(<LoginPage />);
    
    expect(getByText('Sign In')).toBeInTheDocument();
  });
});
