import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Mock Apollo Client
const mockMutate = vi.fn();
const mockRefetch = vi.fn();
const mockClient = {
  mutate: mockMutate,
  query: vi.fn(),
  watchQuery: vi.fn(),
};

vi.mock('@apollo/client', () => ({
  gql: vi.fn((strings, ...values) => strings.join('')),
  useMutation: () => [mockMutate, { loading: false, error: null }],
  useQuery: () => ({ 
    data: null, 
    loading: false, 
    error: null, 
    refetch: mockRefetch 
  }),
  useApolloClient: () => mockClient,
}));

describe('useAuth', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle login', async () => {
    mockMutate.mockResolvedValue({
      data: {
        login: {
          success: true,
          token: 'mock-jwt-token',
          user: { 
            id: '1', 
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      }
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.login('test@example.com', 'password123');
      
      expect(response.success).toBe(true);
      expect(response.token).toBe('mock-jwt-token');
      expect(response.user.email).toBe('test@example.com');
    });
  });

  it('should handle signup', async () => {
    mockMutate.mockResolvedValue({
      data: {
        signup: {
          success: true,
          message: 'User registered successfully',
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: { 
            id: '2', 
            email: 'newuser@example.com',
            firstName: 'New',
            lastName: 'User'
          }
        }
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
      expect(response?.success).toBe(true);
      expect(response?.user?.email).toBe('newuser@example.com');
    });
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
      
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('should handle refresh token', async () => {
    // Set up localStorage with refresh token
    localStorage.setItem('refreshToken', 'mock-refresh-token');
    
    mockMutate.mockResolvedValue({
      data: {
        refreshToken: {
          success: true,
          token: 'new-mock-jwt-token',
          user: { 
            id: '1', 
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      }
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.refreshToken();
      
      expect(response.success).toBe(true);
      expect(response.token).toBe('new-mock-jwt-token');
    });
    
    // Clean up
    localStorage.removeItem('refreshToken');
  });
});