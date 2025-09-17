import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Hero } from '../../components/Hero';

describe('Hero Component', () => {
  it('renders hero section', () => {
    const { getByText } = renderWithProviders(<Hero />);
    
    expect(getByText('Delicious Food, Delivered Fast')).toBeInTheDocument();
  });

  it('shows call-to-action button', () => {
    const { getByText } = renderWithProviders(<Hero />);
    
    expect(getByText('Find Food')).toBeInTheDocument();
  });

  it('displays hero description', () => {
    const { getByText } = renderWithProviders(<Hero />);
    
    expect(getByText('Order from your favorite restaurants and get it delivered to your doorstep')).toBeInTheDocument();
  });
});
