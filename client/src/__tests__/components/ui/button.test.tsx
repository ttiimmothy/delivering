import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    const { getByText } = renderWithProviders(
      <Button>Click me</Button>
    );
    
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    const { getByRole } = renderWithProviders(
      <Button>Default Button</Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('applies secondary variant', () => {
    const { getByRole } = renderWithProviders(
      <Button variant="secondary">Secondary Button</Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('applies outline variant', () => {
    const { getByRole } = renderWithProviders(
      <Button variant="outline">Outline Button</Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('applies ghost variant', () => {
    const { getByRole } = renderWithProviders(
      <Button variant="ghost">Ghost Button</Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('applies destructive variant', () => {
    const { getByRole } = renderWithProviders(
      <Button variant="destructive">Destructive Button</Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies different sizes', () => {
    const { getByRole } = renderWithProviders(
      <Button size="sm">Small Button</Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('h-9');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    const { getByRole } = renderWithProviders(
      <Button onClick={handleClick}>Clickable Button</Button>
    );
    
    const button = getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
