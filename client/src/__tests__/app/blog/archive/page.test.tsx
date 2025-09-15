import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogArchivePage from '@/app/blog/archive/page';

describe('Blog Archive Page', () => {
  it('renders blog archive page', () => {
    const { getByText } = renderWithProviders(<BlogArchivePage />);
    
    expect(getByText('Blog Archive')).toBeInTheDocument();
  });

  it('shows archive posts', () => {
    const { getByText } = renderWithProviders(<BlogArchivePage />);
    
    expect(getByText('All blog posts')).toBeInTheDocument();
  });
});
