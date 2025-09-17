import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../setup';
import { RestaurantGrid } from '../../components/RestaurantGrid';

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