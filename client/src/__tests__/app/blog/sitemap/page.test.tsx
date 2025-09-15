import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogSitemapPage from '@/app/blog/sitemap/page';

describe('Blog Sitemap Page', () => {
  it('renders blog sitemap page', () => {
    const { getByText } = renderWithProviders(<BlogSitemapPage />);
    
    expect(getByText('Blog Sitemap')).toBeInTheDocument();
  });

  it('shows sitemap content', () => {
    const { getByText } = renderWithProviders(<BlogSitemapPage />);
    
    expect(getByText('All blog posts and categories')).toBeInTheDocument();
  });
});
