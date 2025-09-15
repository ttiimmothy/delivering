import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Switch } from '@/components/ui/switch';

describe('Switch Component', () => {
  it('renders switch', () => {
    const { getByRole } = renderWithProviders(
      <Switch />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { getByRole } = renderWithProviders(
      <Switch />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toHaveClass('peer', 'inline-flex', 'h-6', 'w-11');
  });

  it('handles checked state', () => {
    const { getByRole } = renderWithProviders(
      <Switch checked />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('handles disabled state', () => {
    const { getByRole } = renderWithProviders(
      <Switch disabled />
    );
    
    const switchElement = getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    const { getByRole } = renderWithProviders(
      <Switch onChange={handleChange} />
    );
    
    const switchElement = getByRole('switch');
    switchElement.click();
    
    expect(handleChange).toHaveBeenCalled();
  });
});
