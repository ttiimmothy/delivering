import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import BlogDayPage from '@/app/blog/day/[day]/page';

describe('Blog Day Page', () => {
  it('renders blog day page', () => {
    const { getByText } = renderWithProviders(<BlogDayPage />);
    
    expect(getByText('Blog Day')).toBeInTheDocument();
  });

  it('shows day posts', () => {
    const { getByText } = renderWithProviders(<BlogDayPage />);
    
    expect(getByText('Posts from this day')).toBeInTheDocument();
  });
});
