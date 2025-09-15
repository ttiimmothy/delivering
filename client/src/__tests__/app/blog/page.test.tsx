import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogPage from '@/app/blog/page';

describe('Blog Page', () => {
  it('renders blog page', () => {
    const { getByText } = renderWithProviders(<BlogPage />);
    
    expect(getByText('Blog')).toBeInTheDocument();
  });

  it('shows blog posts', () => {
    const { getByText } = renderWithProviders(<BlogPage />);
    
    expect(getByText('Latest Posts')).toBeInTheDocument();
  });
});
