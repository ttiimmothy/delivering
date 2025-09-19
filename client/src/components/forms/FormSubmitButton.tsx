import React from 'react';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';

interface FormSubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FormSubmitButton({
  isLoading = false,
  disabled = false,
  children,
  className = '',
  variant = 'default',
  size = 'default',
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className={className}
      variant={variant}
      size={size}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
