import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogAuthorPage from '@/app/blog/author/[author]/page';

describe('Blog Author Page', () => {
  it('renders blog author page', () => {
    const { getByText } = renderWithProviders(<BlogAuthorPage />);
    
    expect(getByText('Blog Author')).toBeInTheDocument();
  });

  it('shows author posts', () => {
    const { getByText } = renderWithProviders(<BlogAuthorPage />);
    
    expect(getByText('Posts by this author')).toBeInTheDocument();
  });
});
