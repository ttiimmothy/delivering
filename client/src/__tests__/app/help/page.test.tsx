import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import HelpPage from '@/app/help/page';

describe('Help Page', () => {
  it('renders help page', () => {
    const { getByText } = renderWithProviders(<HelpPage />);
    
    expect(getByText('Help & Support')).toBeInTheDocument();
  });

  it('shows FAQ section', () => {
    const { getByText } = renderWithProviders(<HelpPage />);
    
    expect(getByText('Frequently Asked Questions')).toBeInTheDocument();
  });
});
