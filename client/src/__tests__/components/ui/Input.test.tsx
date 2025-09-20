import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../setup';
import { Input } from '../../../components/ui/Input';

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <Input placeholder="Enter text" />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { getByRole } = renderWithProviders(
      <Input />
    );
    
    const input = getByRole('textbox');
    expect(input).toHaveClass('flex', 'h-10', 'w-full');
  });

  it('handles value changes', () => {
    const { getByRole } = renderWithProviders(
      <Input defaultValue="test value" />
    );
    
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('handles different input types', () => {
    const { getByRole } = renderWithProviders(
      <Input type="email" />
    );
    
    const input = getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('handles disabled state', () => {
    const { getByRole } = renderWithProviders(
      <Input disabled />
    );
    
    const input = getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
