import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogPostPage from '@/app/blog/[slug]/page';

describe('Blog Post Page', () => {
  it('renders blog post page', () => {
    const { getByText } = renderWithProviders(<BlogPostPage />);
    
    expect(getByText('Blog Post')).toBeInTheDocument();
  });

  it('shows blog post content', () => {
    const { getByText } = renderWithProviders(<BlogPostPage />);
    
    expect(getByText('Blog post content goes here')).toBeInTheDocument();
  });
});
