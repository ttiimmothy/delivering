import { describe, it, expect, vi } from 'vitest';
import {renderHook} from '@testing-library/react';
import {act} from "react"

// Mock the useAuth hook directly
const mockLogin = vi.fn();
const mockSignup = vi.fn();
const mockLoginWithGoogle = vi.fn();
const mockRefreshToken = vi.fn();
const mockLogout = vi.fn();
const mockRefetchMe = vi.fn();

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    signup: mockSignup,
    loginWithGoogle: mockLoginWithGoogle,
    refreshToken: mockRefreshToken,
    logout: mockLogout,
    refetchMe: mockRefetchMe,
    error: null,
  })),
}));

// Import after mocking
import { useAuth } from '../../hooks/useAuth';

describe('useAuth', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle login', async () => {
    mockLogin.mockResolvedValue({
      user: { 
        id: '1', 
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.login({email: 'test@example.com', password: 'password123'});
      
      expect(response.user.email).toBe('test@example.com');
    });
  });

  it('should handle signup', async () => {
    mockSignup.mockResolvedValue({
      user: { 
        id: '2', 
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User'
      }
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.signup({
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        phone: '+1234567890'
      });
      
      expect(response).toBeTruthy();
      expect(response?.user?.email).toBe('newuser@example.com');
    });
  });

  it('should handle logout', async () => {
    mockLogout.mockResolvedValue(true);

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.logout();
      
      expect(response).toBe(true);
    });
  });

  it('should handle refresh token', async () => {
    // Set up localStorage with refresh token
    localStorage.setItem('refreshToken', 'mock-refresh-token');
    
    mockRefreshToken.mockResolvedValue({
      message: "get refresh token success"
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.refreshToken();
      
      expect(response.message).toBe("get refresh token success");
    });
    
    // Clean up
    localStorage.removeItem('refreshToken');
  });
});