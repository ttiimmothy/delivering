import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Toast, ToastDescription, ToastTitle } from '@/components/ui/toast';

describe('Toast Component', () => {
  it('renders toast with title and description', () => {
    const { getByText } = renderWithProviders(
      <Toast>
        <ToastTitle>Toast Title</ToastTitle>
        <ToastDescription>Toast description</ToastDescription>
      </Toast>
    );
    
    expect(getByText('Toast Title')).toBeInTheDocument();
    expect(getByText('Toast description')).toBeInTheDocument();
  });

  it('applies correct classes to toast', () => {
    const { getByText } = renderWithProviders(
      <Toast>
        <ToastTitle>Toast Title</ToastTitle>
      </Toast>
    );
    
    const toast = getByText('Toast Title').parentElement;
    expect(toast).toHaveClass('group', 'pointer-events-auto', 'relative', 'flex', 'w-full');
  });

  it('applies correct classes to toast title', () => {
    const { getByText } = renderWithProviders(
      <Toast>
        <ToastTitle>Toast Title</ToastTitle>
      </Toast>
    );
    
    const title = getByText('Toast Title');
    expect(title).toHaveClass('text-sm', 'font-semibold');
  });

  it('applies correct classes to toast description', () => {
    const { getByText } = renderWithProviders(
      <Toast>
        <ToastDescription>Toast description</ToastDescription>
      </Toast>
    );
    
    const description = getByText('Toast description');
    expect(description).toHaveClass('text-sm', 'opacity-90');
  });
});
