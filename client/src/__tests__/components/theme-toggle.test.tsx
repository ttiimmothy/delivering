import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import { ThemeToggle } from '@/components/theme-toggle';

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme
  })
}));

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    const { getByRole } = renderWithProviders(<ThemeToggle />);
    
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    const { getByRole } = renderWithProviders(<ThemeToggle />);
    
    const button = getByRole('button');
    button.click();
    
    expect(mockSetTheme).toHaveBeenCalled();
  });
});
