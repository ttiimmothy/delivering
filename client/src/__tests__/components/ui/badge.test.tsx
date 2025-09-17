import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { Badge } from '@/components/ui/Badge';

describe('Badge Component', () => {
  it('renders badge with text', () => {
    const { getByText } = renderWithProviders(
      <Badge>Badge Text</Badge>
    );
    
    expect(getByText('Badge Text')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    const { getByText } = renderWithProviders(
      <Badge>Default Badge</Badge>
    );
    
    const badge = getByText('Default Badge');
    expect(badge).toHaveClass('bg-primary');
  });

  it('applies secondary variant', () => {
    const { getByText } = renderWithProviders(
      <Badge variant="secondary">Secondary Badge</Badge>
    );
    
    const badge = getByText('Secondary Badge');
    expect(badge).toHaveClass('bg-secondary');
  });

  it('applies outline variant', () => {
    const { getByText } = renderWithProviders(
      <Badge variant="outline">Outline Badge</Badge>
    );
    
    const badge = getByText('Outline Badge');
    expect(badge).toHaveClass('border');
  });

  it('applies destructive variant', () => {
    const { getByText } = renderWithProviders(
      <Badge variant="destructive">Destructive Badge</Badge>
    );
    
    const badge = getByText('Destructive Badge');
    expect(badge).toHaveClass('bg-destructive');
  });

  it('applies different sizes', () => {
    const { getByText } = renderWithProviders(
      <Badge size="sm">Small Badge</Badge>
    );
    
    const badge = getByText('Small Badge');
    expect(badge).toHaveClass('text-xs');
  });
});
