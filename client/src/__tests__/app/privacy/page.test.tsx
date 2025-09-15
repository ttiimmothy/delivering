import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import PrivacyPage from '@/app/privacy/page';

describe('Privacy Page', () => {
  it('renders privacy policy', () => {
    const { getByText } = renderWithProviders(<PrivacyPage />);
    
    expect(getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('shows last updated date', () => {
    const { getByText } = renderWithProviders(<PrivacyPage />);
    
    expect(getByText('Last updated:')).toBeInTheDocument();
  });
});
