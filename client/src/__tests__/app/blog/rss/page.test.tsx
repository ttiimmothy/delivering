import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogRSSPage from '@/app/blog/rss/page';

describe('Blog RSS Page', () => {
  it('renders blog RSS page', () => {
    const { getByText } = renderWithProviders(<BlogRSSPage />);
    
    expect(getByText('RSS Feed')).toBeInTheDocument();
  });

  it('shows RSS feed content', () => {
    const { getByText } = renderWithProviders(<BlogRSSPage />);
    
    expect(getByText('Subscribe to our RSS feed')).toBeInTheDocument();
  });
});
