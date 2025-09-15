import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogAuthorsPage from '@/app/blog/authors/page';

describe('Blog Authors Page', () => {
  it('renders blog authors page', () => {
    const { getByText } = renderWithProviders(<BlogAuthorsPage />);
    
    expect(getByText('Blog Authors')).toBeInTheDocument();
  });

  it('shows authors list', () => {
    const { getByText } = renderWithProviders(<BlogAuthorsPage />);
    
    expect(getByText('All blog authors')).toBeInTheDocument();
  });
});
