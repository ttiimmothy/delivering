import React from 'react';
import { FieldError, FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import { Label } from '../ui/Label';
import { Alert, AlertDescription } from '../ui/Alert';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  register,
  error,
  className = '',
  selectClassName = '',
  labelClassName = '',
}: FormSelectProps<T>) {
  const fieldId = `select-${name}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label 
        htmlFor={fieldId} 
        className={`text-sm font-medium ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <select
        id={fieldId}
        {...register(name)}
        disabled={disabled}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${selectClassName}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
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
