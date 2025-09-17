import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { Label } from '@/components/ui/Label';

describe('Label Component', () => {
  it('renders label with text', () => {
    const { getByText } = renderWithProviders(
      <Label>Label Text</Label>
    );
    
    expect(getByText('Label Text')).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { getByText } = renderWithProviders(
      <Label>Label Text</Label>
    );
    
    const label = getByText('Label Text');
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
  });

  it('handles htmlFor attribute', () => {
    const { getByText } = renderWithProviders(
      <Label htmlFor="test-input">Label Text</Label>
    );
    
    const label = getByText('Label Text');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('handles disabled state', () => {
    const { getByText } = renderWithProviders(
      <Label disabled>Disabled Label</Label>
    );
    
    const label = getByText('Disabled Label');
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
  });
});
