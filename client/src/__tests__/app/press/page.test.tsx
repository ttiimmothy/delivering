import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import PressPage from '@/app/press/page';

describe('Press Page', () => {
  it('renders press page', () => {
    const { getByText } = renderWithProviders(<PressPage />);
    
    expect(getByText('Press Kit')).toBeInTheDocument();
  });

  it('shows press releases', () => {
    const { getByText } = renderWithProviders(<PressPage />);
    
    expect(getByText('Press Releases')).toBeInTheDocument();
  });
});
