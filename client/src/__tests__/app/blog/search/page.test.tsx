import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogSearchPage from '@/app/blog/search/page';

describe('Blog Search Page', () => {
  it('renders blog search page', () => {
    const { getByText } = renderWithProviders(<BlogSearchPage />);
    
    expect(getByText('Search Blog')).toBeInTheDocument();
  });

  it('shows search form', () => {
    const { getByText } = renderWithProviders(<BlogSearchPage />);
    
    expect(getByText('Search for posts')).toBeInTheDocument();
  });
});
