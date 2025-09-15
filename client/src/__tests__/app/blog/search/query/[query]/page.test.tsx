import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogSearchQueryPage from '@/app/blog/search/query/[query]/page';

describe('Blog Search Query Page', () => {
  it('renders blog search query page', () => {
    const { getByText } = renderWithProviders(<BlogSearchQueryPage />);
    
    expect(getByText('Search Query')).toBeInTheDocument();
  });

  it('shows query results', () => {
    const { getByText } = renderWithProviders(<BlogSearchQueryPage />);
    
    expect(getByText('Results for your search query')).toBeInTheDocument();
  });
});