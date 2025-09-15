import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRestaurants } from '@/hooks/useRestaurants';

// Mock Apollo Client
const mockMutate = vi.fn();
const mockClient = {
  mutate: mockMutate,
  query: vi.fn(),
  watchQuery: vi.fn(),
};

vi.mock('@apollo/client', () => ({
  useMutation: () => [mockMutate, { loading: false, error: null }],
  useQuery: () => ({ 
    data: { 
      restaurants: [
        { 
          id: '1', 
          name: 'Test Restaurant 1', 
          cuisine: 'Italian',
          rating: 4.5,
          deliveryTime: 30,
          isOpen: true
        },
        { 
          id: '2', 
          name: 'Test Restaurant 2', 
          cuisine: 'Mexican',
          rating: 4.2,
          deliveryTime: 25,
          isOpen: true
        }
      ]
    }, 
    loading: false, 
    error: null 
  }),
  useApolloClient: () => mockClient,
}));

describe('useRestaurants', () => {
  it('should initialize with restaurants data', () => {
    const { result } = renderHook(() => useRestaurants());
    
    expect(result.current.restaurants).toHaveLength(2);
    expect(result.current.restaurants[0].name).toBe('Test Restaurant 1');
    expect(result.current.restaurants[1].name).toBe('Test Restaurant 2');
  });

  it('should filter restaurants by cuisine', () => {
    const { result } = renderHook(() => useRestaurants({ cuisine: 'Italian' }));
    
    expect(result.current.restaurants).toHaveLength(1);
    expect(result.current.restaurants[0].cuisine).toBe('Italian');
  });

  it('should search restaurants by name', () => {
    const { result } = renderHook(() => useRestaurants({ search: 'Test Restaurant 1' }));
    
    expect(result.current.restaurants).toHaveLength(1);
    expect(result.current.restaurants[0].name).toBe('Test Restaurant 1');
  });

  it('should sort restaurants by rating', () => {
    const { result } = renderHook(() => useRestaurants({ sortBy: 'rating' }));
    
    expect(result.current.restaurants[0].rating).toBeGreaterThanOrEqual(result.current.restaurants[1].rating);
  });
});
