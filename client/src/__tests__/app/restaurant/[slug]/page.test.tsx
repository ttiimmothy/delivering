import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import RestaurantPage from '@/app/restaurant/[slug]/page';

// Mock the useParams hook
vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'test-restaurant' }),
}));

// Mock the useRestaurant hook
const mockRestaurant = {
  id: '1',
  name: 'Test Restaurant',
  slug: 'test-restaurant',
  description: 'A test restaurant',
  image: 'https://example.com/image.jpg',
  cuisine: 'Italian',
  rating: 4.5,
  reviewCount: 100,
  deliveryTime: 30,
  deliveryFee: 2.99,
  minimumOrder: 15.00,
  isOpen: true,
  isActive: true,
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  phone: '555-1234',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  menuCategories: [
    {
      id: '1',
      name: 'Appetizers',
      description: 'Start your meal right',
      sortOrder: 1,
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      menuItems: [
        {
          id: '1',
          name: 'Test Item',
          description: 'A test menu item',
          image: 'https://example.com/item.jpg',
          price: 9.99,
          isAvailable: true,
          isPopular: false,
          sortOrder: 1,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          options: [],
        },
      ],
    },
  ],
};

vi.mock('@/hooks/useRestaurants', () => ({
  useRestaurant: vi.fn(() => ({
    restaurant: mockRestaurant,
    loading: false,
    error: null,
  })),
  useToggleFavorite: vi.fn(() => ({
    toggleFavorite: vi.fn(),
    loading: false,
    error: null,
  })),
}));

// Mock the useCart hook
vi.mock('@/hooks/useCart', () => ({
  useCart: vi.fn(() => ({
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
    addToCart: vi.fn(),
    updateCartItem: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
  })),
}));

describe('RestaurantPage', () => {
  it('renders restaurant page with restaurant data', () => {
    const { getByText, getAllByText } = renderWithProviders(<RestaurantPage />);
    
    expect(getByText('Test Restaurant')).toBeInTheDocument();
    expect(getByText('A test restaurant')).toBeInTheDocument();
    expect(getAllByText('Italian')).toHaveLength(2); // Appears in header and info section
    expect(getAllByText('Appetizers')).toHaveLength(2); // Appears in button and heading
  });
});
