import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Toaster } from '@/components/ui/toaster';

describe('Toaster Component', () => {
  it('renders toaster', () => {
    const { getByRole } = renderWithProviders(<Toaster />);
    
    const toaster = getByRole('region');
    expect(toaster).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { getByRole } = renderWithProviders(<Toaster />);
    
    const toaster = getByRole('region');
    expect(toaster).toHaveClass('fixed', 'top-0', 'z-[100]', 'flex', 'max-h-screen', 'w-full');
  });
});
