import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import CareersPage from '@/app/careers/page';

describe('Careers Page', () => {
  it('renders careers page', () => {
    const { getByText } = renderWithProviders(<CareersPage />);
    
    expect(getByText('Join Our Team')).toBeInTheDocument();
  });

  it('shows open positions', () => {
    const { getByText } = renderWithProviders(<CareersPage />);
    
    expect(getByText('Open Positions')).toBeInTheDocument();
  });
});
