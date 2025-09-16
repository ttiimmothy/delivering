import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { Footer } from '@/components/footer';

describe('Footer Component', () => {
  it('renders footer with copyright', () => {
    const { getByText } = renderWithProviders(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(getByText(`© ${currentYear} Delivering. All rights reserved.`)).toBeInTheDocument();
  });

  it('shows company name', () => {
    const { getByText } = renderWithProviders(<Footer />);
    
    expect(getByText('🍔 Delivering')).toBeInTheDocument();
  });
});
