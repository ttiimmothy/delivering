import React from 'react';
import { FieldError, FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Alert, AlertDescription } from '../ui/Alert';

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  rows?: number;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  register,
  error,
  className = '',
  inputClassName = '',
  labelClassName = '',
  rows = 3,
}: FormFieldProps<T>) {
  const fieldId = `field-${name}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label 
        htmlFor={fieldId} 
        className={`text-sm font-medium ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${inputClassName}`}
        />
      ) : (
        <Input
          id={fieldId}
          type={type}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClassName}
        />
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
