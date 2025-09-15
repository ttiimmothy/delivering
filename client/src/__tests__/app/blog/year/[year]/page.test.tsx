import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogYearPage from '@/app/blog/year/[year]/page';

describe('Blog Year Page', () => {
  it('renders blog year page', () => {
    const { getByText } = renderWithProviders(<BlogYearPage />);
    
    expect(getByText('Blog Year')).toBeInTheDocument();
  });

  it('shows year posts', () => {
    const { getByText } = renderWithProviders(<BlogYearPage />);
    
    expect(getByText('Posts from this year')).toBeInTheDocument();
  });
});
