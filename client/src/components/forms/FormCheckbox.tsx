import React from 'react';
import { FieldError, FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import { Label } from '../ui/Label';
import { Alert, AlertDescription } from '../ui/Alert';

interface FormCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  register,
  error,
  className = '',
  checkboxClassName = '',
  labelClassName = '',
}: FormCheckboxProps<T>) {
  const fieldId = `checkbox-${name}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-2">
        <input
          id={fieldId}
          type="checkbox"
          {...register(name)}
          disabled={disabled}
          className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${checkboxClassName}`}
        />
        <div className="space-y-1">
          <Label 
            htmlFor={fieldId} 
            className={`text-sm font-medium ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      
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
