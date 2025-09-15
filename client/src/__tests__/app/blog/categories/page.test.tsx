import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogCategoriesPage from '@/app/blog/categories/page';

describe('Blog Categories Page', () => {
  it('renders blog categories page', () => {
    const { getByText } = renderWithProviders(<BlogCategoriesPage />);
    
    expect(getByText('Blog Categories')).toBeInTheDocument();
  });

  it('shows categories list', () => {
    const { getByText } = renderWithProviders(<BlogCategoriesPage />);
    
    expect(getByText('All blog categories')).toBeInTheDocument();
  });
});
