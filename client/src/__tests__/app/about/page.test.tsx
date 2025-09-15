import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import AboutPage from '@/app/about/page';

describe('About Page', () => {
  it('renders about page', () => {
    const { getByText } = renderWithProviders(<AboutPage />);
    
    expect(getByText('About Delivering')).toBeInTheDocument();
  });

  it('shows mission statement', () => {
    const { getByText } = renderWithProviders(<AboutPage />);
    
    expect(getByText('Our Mission')).toBeInTheDocument();
  });
});
