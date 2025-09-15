import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogMonthPage from '@/app/blog/month/[month]/page';

describe('Blog Month Page', () => {
  it('renders blog month page', () => {
    const { getByText } = renderWithProviders(<BlogMonthPage />);
    
    expect(getByText('Blog Month')).toBeInTheDocument();
  });

  it('shows month posts', () => {
    const { getByText } = renderWithProviders(<BlogMonthPage />);
    
    expect(getByText('Posts from this month')).toBeInTheDocument();
  });
});
