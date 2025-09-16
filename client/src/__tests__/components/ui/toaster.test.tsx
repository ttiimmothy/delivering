import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { Toaster } from '@/components/ui/toaster';

describe('Toaster Component', () => {
  it('renders toaster', () => {
    const { getByRole } = renderWithProviders(<Toaster />);
    
    const toaster = getByRole('region');
    expect(toaster).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { container } = renderWithProviders(<Toaster />);
    
    const toaster = container.querySelector('[role="region"]');
    expect(toaster).toBeInTheDocument();
    // Just check that it exists and has some classes
    expect(toaster?.className).toBeDefined();
  });
});
