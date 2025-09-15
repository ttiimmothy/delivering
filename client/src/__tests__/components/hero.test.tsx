import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Hero } from '@/components/hero';

describe('Hero Component', () => {
  it('renders hero section', () => {
    const { getByText } = renderWithProviders(<Hero />);
    
    expect(getByText('Delicious Food, Delivered Fast')).toBeInTheDocument();
  });

  it('shows call-to-action button', () => {
    const { getByText } = renderWithProviders(<Hero />);
    
    expect(getByText('Order Now')).toBeInTheDocument();
  });

  it('displays hero description', () => {
    const { getByText } = renderWithProviders(<Hero />);
    
    expect(getByText('Get your favorite meals delivered to your doorstep in minutes.')).toBeInTheDocument();
  });
});
