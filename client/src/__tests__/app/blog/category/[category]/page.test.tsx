import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogCategoryPage from '@/app/blog/category/[category]/page';

describe('Blog Category Page', () => {
  it('renders blog category page', () => {
    const { getByText } = renderWithProviders(<BlogCategoryPage />);
    
    expect(getByText('Blog Category')).toBeInTheDocument();
  });

  it('shows category posts', () => {
    const { getByText } = renderWithProviders(<BlogCategoryPage />);
    
    expect(getByText('Posts in this category')).toBeInTheDocument();
  });
});
