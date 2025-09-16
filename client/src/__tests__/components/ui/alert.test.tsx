import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { Alert, AlertDescription } from '@/components/ui/alert';

describe('Alert Component', () => {
  it('renders alert with content', () => {
    const { getByText } = renderWithProviders(
      <Alert>
        <AlertDescription>Alert message</AlertDescription>
      </Alert>
    );
    
    expect(getByText('Alert message')).toBeInTheDocument();
  });

  it('applies correct classes to alert', () => {
    const { getByText } = renderWithProviders(
      <Alert>
        <AlertDescription>Alert message</AlertDescription>
      </Alert>
    );
    
    const alert = getByText('Alert message').parentElement;
    expect(alert).toHaveClass('relative', 'w-full', 'rounded-lg', 'border');
  });

  it('applies correct classes to alert description', () => {
    const { getByText } = renderWithProviders(
      <Alert>
        <AlertDescription>Alert message</AlertDescription>
      </Alert>
    );
    
    const description = getByText('Alert message');
    expect(description).toHaveClass('text-sm', '[&_p]:leading-relaxed');
  });
});
