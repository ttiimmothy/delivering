import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import HomePage from '@/app/page';

// Mock the useRestaurants hook
const mockRestaurants = [
  {
    id: '1',
    name: 'Test Restaurant',
    cuisine: 'Italian',
    rating: 4.5,
    reviewCount: 100,
    deliveryTime: 30,
    deliveryFee: 2.99,
    isOpen: true,
    image: 'https://example.com/restaurant.jpg'
  }
];

vi.mock('@/hooks/useRestaurants', () => ({
  useRestaurants: () => ({
    restaurants: mockRestaurants,
    loading: false,
    error: null
  })
}));

// Mock the RestaurantGrid component
vi.mock('@/components/RestaurantGrid', () => ({
  RestaurantGrid: ({ restaurants, loading, error }: any) => (
    <div data-testid="restaurant-grid">
      {loading && 'Loading...'}
      {error && error}
      {restaurants?.length > 0 && `Found ${restaurants.length} restaurants`}
    </div>
  )
}));

describe('Home Page', () => {
  it('renders home page with restaurants', () => {
    const { getByTestId } = renderWithProviders(<HomePage />);
    
    expect(getByTestId('restaurant-grid')).toBeInTheDocument();
  });

  it('shows restaurant count', () => {
    const { getByText } = renderWithProviders(<HomePage />);
    
    expect(getByText('Found 1 restaurants')).toBeInTheDocument();
  });
});
