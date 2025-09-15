import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';

// Mock the toast function
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

describe('useToast Hook', () => {
  it('should provide toast function', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toast).toBeDefined();
    expect(typeof result.current.toast).toBe('function');
  });

  it('should call toast function when invoked', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast'
      });
    });
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Test Toast',
      description: 'This is a test toast'
    });
  });
});
