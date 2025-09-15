import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogTagsPage from '@/app/blog/tags/page';

describe('Blog Tags Page', () => {
  it('renders blog tags page', () => {
    const { getByText } = renderWithProviders(<BlogTagsPage />);
    
    expect(getByText('Blog Tags')).toBeInTheDocument();
  });

  it('shows tags list', () => {
    const { getByText } = renderWithProviders(<BlogTagsPage />);
    
    expect(getByText('All blog tags')).toBeInTheDocument();
  });
});
