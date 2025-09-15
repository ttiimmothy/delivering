import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogTagPage from '@/app/blog/tag/[tag]/page';

describe('Blog Tag Page', () => {
  it('renders blog tag page', () => {
    const { getByText } = renderWithProviders(<BlogTagPage />);
    
    expect(getByText('Blog Tag')).toBeInTheDocument();
  });

  it('shows tagged posts', () => {
    const { getByText } = renderWithProviders(<BlogTagPage />);
    
    expect(getByText('Posts with this tag')).toBeInTheDocument();
  });
});
