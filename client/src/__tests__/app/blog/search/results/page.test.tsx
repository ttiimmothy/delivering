import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogSearchResultsPage from '@/app/blog/search/results/page';

describe('Blog Search Results Page', () => {
  it('renders blog search results page', () => {
    const { getByText } = renderWithProviders(<BlogSearchResultsPage />);
    
    expect(getByText('Search Results')).toBeInTheDocument();
  });

  it('shows search results', () => {
    const { getByText } = renderWithProviders(<BlogSearchResultsPage />);
    
    expect(getByText('Search results for your query')).toBeInTheDocument();
  });
});
