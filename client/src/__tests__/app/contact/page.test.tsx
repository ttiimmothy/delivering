import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import ContactPage from '@/app/contact/page';

describe('Contact Page', () => {
  it('renders contact page', () => {
    const { getByText } = renderWithProviders(<ContactPage />);
    
    expect(getByText('Contact Us')).toBeInTheDocument();
  });

  it('shows contact form', () => {
    const { getByText } = renderWithProviders(<ContactPage />);
    
    expect(getByText('Send us a message')).toBeInTheDocument();
  });
});
