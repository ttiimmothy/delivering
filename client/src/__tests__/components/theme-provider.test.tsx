import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  )
}));

describe('ThemeProvider', () => {
  it('renders children with theme context', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    
    expect(getByTestId('theme-provider')).toBeInTheDocument();
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('provides theme context to children', () => {
    const { getByTestId } = renderWithProviders(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    
    expect(getByTestId('theme-provider')).toBeInTheDocument();
  });
});
