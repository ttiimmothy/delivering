import React, { useState } from 'react';
import { FieldError, FieldPath, FieldValues, UseFormRegister, useWatch } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Alert, AlertDescription } from '../ui/Alert';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  showStrengthIndicator?: boolean;
  showToggle?: boolean;
}

export function PasswordField<T extends FieldValues>({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  register,
  error,
  className = '',
  inputClassName = '',
  labelClassName = '',
  showStrengthIndicator = false,
  showToggle = true,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = `password-${name}`;
  const passwordValue = useWatch({ name }) as string || '';

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label 
        htmlFor={fieldId} 
        className={`text-sm font-medium ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={fieldId}
          type={showPassword ? 'text' : 'password'}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${inputClassName}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {showStrengthIndicator && (
        <div className="space-y-1">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  level <= getPasswordStrength(passwordValue)
                    ? getStrengthColor(getPasswordStrength(passwordValue))
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Password strength: {getStrengthText(getPasswordStrength(passwordValue))}
          </p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-sm">
            {error.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
