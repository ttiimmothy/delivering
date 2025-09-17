import { describe, it, expect } from 'vitest';
import {renderHook} from '@testing-library/react';
import {act} from "react"
import { useToast } from '../../hooks/useToast';

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
    
    // Check that the toast was added to the state
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('This is a test toast');
  });
});
