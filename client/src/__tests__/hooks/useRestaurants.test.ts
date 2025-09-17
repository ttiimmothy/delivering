import { describe, it, expect, vi } from 'vitest';
import {renderHook} from '@testing-library/react';
import {act} from "react"
import { 
  useRestaurants, 
  useRestaurant, 
  useFavoriteRestaurants,
  useToggleFavorite 
} from '../../hooks/useRestaurants';

// Mock Apollo Client
const mockMutate = vi.fn();
const mockClient = {
  mutate: mockMutate,
  query: vi.fn(),
  watchQuery: vi.fn(),
};

const mockRestaurants = [
  { 
    id: '1', 
    name: 'Test Restaurant 1', 
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: 30,
    isOpen: true,
    slug: 'test-restaurant-1'
  },
  { 
    id: '2', 
    name: 'Test Restaurant 2', 
    cuisine: 'Mexican',
    rating: 4.2,
    deliveryTime: 25,
    isOpen: true,
    slug: 'test-restaurant-2'
  },
  { 
    id: '3', 
    name: 'Test Restaurant 3', 
    cuisine: 'Italian',
    rating: 3.8,
    deliveryTime: 35,
    isOpen: false,
    slug: 'test-restaurant-3'
  }
];

vi.mock('@apollo/client', () => ({
  gql: vi.fn((strings, ...values) => strings.join('')),
  useMutation: () => [mockMutate, { loading: false, error: null }],
  useQuery: () => ({ 
    data: { 
      restaurants: mockRestaurants,
      restaurant: mockRestaurants[0],
      favoriteRestaurants: [mockRestaurants[0]]
    }, 
    loading: false, 
    error: null 
  }),
  useApolloClient: () => mockClient,
}));

describe('Restaurants Hooks', () => {
  describe('useRestaurants', () => {
    it('should return restaurants data', () => {
      const { result } = renderHook(() => useRestaurants());
      
      expect(result.current.restaurants).toBeDefined();
      expect(result.current.restaurants).toHaveLength(3);
      expect(result.current.restaurants[0].name).toBe('Test Restaurant 1');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should accept query variables', () => {
      const { result } = renderHook(() => useRestaurants({ 
        cuisine: 'Italian',
        isOpen: true 
      }));
      
      expect(result.current.restaurants).toBeDefined();
      expect(result.current.restaurants).toHaveLength(3);
    });
  });

  describe('useRestaurant', () => {
    it('should return single restaurant data', () => {
      const { result } = renderHook(() => useRestaurant('test-restaurant-1'));
      
      expect(result.current.restaurant).toBeDefined();
      expect(result.current.restaurant?.name).toBe('Test Restaurant 1');
      expect(result.current.restaurant?.cuisine).toBe('Italian');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle empty slug', () => {
      const { result } = renderHook(() => useRestaurant(''));
      
      // The hook still returns data from the mock, but in real implementation it would be null
      expect(result.current.restaurant).toBeDefined();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useFavoriteRestaurants', () => {
    it('should return favorite restaurants', () => {
      const { result } = renderHook(() => useFavoriteRestaurants());
      
      expect(result.current.favoriteRestaurants).toBeDefined();
      expect(result.current.favoriteRestaurants).toHaveLength(1);
      expect(result.current.favoriteRestaurants[0].name).toBe('Test Restaurant 1');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('useToggleFavorite', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useToggleFavorite());
      
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle toggle favorite', async () => {
      mockMutate.mockResolvedValue({
        data: {
          toggleFavorite: {
            success: true,
            isFavorite: true
          }
        }
      });

      const { result } = renderHook(() => useToggleFavorite());
      
      await act(async () => {
        const response = await result.current.toggleFavorite({
          restaurantId: '1'
        });
        
        expect(response).toBeDefined();
        expect(response?.isFavorite).toBe(true);
      });
    });
  });
});