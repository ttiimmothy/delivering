'use client';

import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';

interface MenuItemOptionsProps {
  options: Array<{
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
    values?: Array<{
      id: string;
      name: string;
      price: string;
      isDefault: boolean;
    }>;
  }>;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionId: string, valueId: string) => void;
}

export function MenuItemOptions({ 
  options, 
  selectedOptions, 
  onOptionChange 
}: MenuItemOptionsProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id} className="space-y-2">
          <Label className="text-sm font-medium">
            {option.name}
            {option.isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          
          {option.type === 'single' ? (
            <RadioGroup
              value={selectedOptions[option.id] || ''}
              onValueChange={(value) => onOptionChange(option.id, value)}
            >
              {option.values?.map((value) => (
                <div key={value.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.id} id={`${option.id}-${value.id}`} />
                  <Label 
                    htmlFor={`${option.id}-${value.id}`}
                    className="flex-1 flex items-center justify-between text-sm"
                  >
                    <span>{value.name}</span>
                    {parseFloat(value.price) > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">
                        +${parseFloat(value.price).toFixed(2)}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {option.values?.map((value) => (
                <div key={value.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${option.id}-${value.id}`}
                    checked={selectedOptions[option.id] === value.id}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onOptionChange(option.id, value.id);
                      } else {
                        onOptionChange(option.id, '');
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`${option.id}-${value.id}`}
                    className="flex-1 flex items-center justify-between text-sm"
                  >
                    <span>{value.name}</span>
                    {parseFloat(value.price) > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">
                        +${parseFloat(value.price).toFixed(2)}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
