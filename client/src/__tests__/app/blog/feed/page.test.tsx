import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogFeedPage from '@/app/blog/feed/page';

describe('Blog Feed Page', () => {
  it('renders blog feed page', () => {
    const { getByText } = renderWithProviders(<BlogFeedPage />);
    
    expect(getByText('Blog Feed')).toBeInTheDocument();
  });

  it('shows feed content', () => {
    const { getByText } = renderWithProviders(<BlogFeedPage />);
    
    expect(getByText('Latest blog posts')).toBeInTheDocument();
  });
});
