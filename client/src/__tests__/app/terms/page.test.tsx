import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import TermsPage from '../../../app/terms/page';

describe('Terms Page', () => {
  it('renders terms of service', () => {
    const { getByText } = renderWithProviders(<TermsPage />);
    
    expect(getByText('Terms of Service')).toBeInTheDocument();
  });

  it('shows last updated date', () => {
    const { getByText } = renderWithProviders(<TermsPage />);
    
    expect(getByText('Last updated: January 16, 2024')).toBeInTheDocument();
  });
});
