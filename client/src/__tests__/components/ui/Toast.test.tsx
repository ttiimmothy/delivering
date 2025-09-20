import { describe, it, expect, vi } from 'vitest';
import {ReactNode} from 'react';
import { renderWithProviders } from '../../setup';
import { Toast, ToastDescription, ToastTitle, ToastProvider } from '../../../components/ui/Toast';

// Mock Radix UI Toast components for testing
vi.mock('@radix-ui/react-toast', () => ({
  Provider: ({ children }: { children: ReactNode }) => <div data-testid="toast-provider">{children}</div>,
  Root: ({ children, className, ...props }: any) => (
    <div data-testid="toast-root" className={className} {...props}>
      {children}
    </div>
  ),
  Title: ({ children, className, ...props }: any) => (
    <div data-testid="toast-title" className={className} {...props}>
      {children}
    </div>
  ),
  Description: ({ children, className, ...props }: any) => (
    <div data-testid="toast-description" className={className} {...props}>
      {children}
    </div>
  ),
  Viewport: ({ children, className, ...props }: any) => (
    <div data-testid="toast-viewport" className={className} {...props}>
      {children}
    </div>
  ),
  Action: ({ children, className, ...props }: any) => (
    <button data-testid="toast-action" className={className} {...props}>
      {children}
    </button>
  ),
  Close: ({ children, className, ...props }: any) => (
    <button data-testid="toast-close" className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('Toast Component', () => {
  it('renders toast with title and description', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <ToastProvider>
        <Toast>
          <ToastTitle>Toast Title</ToastTitle>
          <ToastDescription>Toast description</ToastDescription>
        </Toast>
      </ToastProvider>
    );
    
    expect(getByText('Toast Title')).toBeInTheDocument();
    expect(getByText('Toast description')).toBeInTheDocument();
    expect(getByTestId('toast-root')).toBeInTheDocument();
    expect(getByTestId('toast-title')).toBeInTheDocument();
    expect(getByTestId('toast-description')).toBeInTheDocument();
  });

  it('applies correct classes to toast', () => {
    const { getByTestId } = renderWithProviders(
      <ToastProvider>
        <Toast>
          <ToastTitle>Toast Title</ToastTitle>
        </Toast>
      </ToastProvider>
    );
    
    const toast = getByTestId('toast-root');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('group', 'pointer-events-auto', 'relative', 'flex', 'w-full');
  });

  it('applies correct classes to toast title', () => {
    const { getByTestId } = renderWithProviders(
      <ToastProvider>
        <Toast>
          <ToastTitle>Toast Title</ToastTitle>
        </Toast>
      </ToastProvider>
    );
    
    const title = getByTestId('toast-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-sm', 'font-semibold');
  });

  it('applies correct classes to toast description', () => {
    const { getByTestId } = renderWithProviders(
      <ToastProvider>
        <Toast>
          <ToastDescription>Toast description</ToastDescription>
        </Toast>
      </ToastProvider>
    );
    
    const description = getByTestId('toast-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm', 'opacity-90');
  });
});
