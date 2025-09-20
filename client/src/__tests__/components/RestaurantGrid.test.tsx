import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../setup';
import { RestaurantGrid } from '../../components/RestaurantGrid';

// Mock the hooks
vi.mock('../../hooks/useRestaurants', () => ({
  useToggleFavorite: vi.fn(() => ({
    toggleFavorite: vi.fn(),
    loading: false,
    error: null
  }))
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true
  }))
}));

vi.mock('../../stores/favoritesStore', () => ({
  useFavoritesStore: vi.fn(() => ({
    toggleRestaurantFavorite: vi.fn(),
    isRestaurantFavorite: vi.fn(() => false)
  }))
}));

const mockRestaurants = [
  {
    id: '1',
    name: 'Test Restaurant',
    cuisine: 'Italian',
    rating: '4.5',
    reviewCount: 100,
    deliveryTime: 30,
    deliveryFee: "2.99",
    minimumOrder: "15.00",
    isOpen: true,
    image: 'https://example.com/restaurant.jpg',
    slug: 'test-restaurant',
    description: 'A great test restaurant',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345'
    },
    isActive: true, 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString()
  }
];

describe('RestaurantGrid Component', () => {
  it('renders restaurants correctly', () => {
    const { getByText } = renderWithProviders(
      <RestaurantGrid 
        restaurants={mockRestaurants} 
        loading={false} 
        error={null} 
      />
    );

    expect(getByText('Test Restaurant')).toBeInTheDocument();
    expect(getByText('Italian')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { getByText } = renderWithProviders(
      <RestaurantGrid 
        restaurants={[]} 
        loading={true} 
        error={null} 
      />
    );

    expect(getByText('Loading restaurants...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const { getByText } = renderWithProviders(
      <RestaurantGrid 
        restaurants={[]} 
        loading={false} 
        error="Failed to load restaurants" 
      />
    );

    expect(getByText('Failed to load restaurants')).toBeInTheDocument();
  });
});