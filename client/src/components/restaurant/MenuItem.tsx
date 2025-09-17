'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MenuItemOptions } from './MenuItemOptions';

interface MenuItemProps {
  menuItem: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    price: number;
    isAvailable: boolean;
    isPopular: boolean;
    options?: Array<{
      id: string;
      name: string;
      type: string;
      isRequired: boolean;
      values: Array<{
        id: string;
        name: string;
        price: number;
        isDefault: boolean;
      }>;
    }>;
  };
  onAddToCart: (menuItem: any, options: any[]) => void;
}

export function MenuItem({ menuItem, onAddToCart }: MenuItemProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionChange = (optionId: string, valueId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: valueId
    }));
  };

  const handleAddToCart = () => {
    const options = Object.entries(selectedOptions).map(([optionId, valueId]) => ({
      optionId,
      valueId
    }));
    
    onAddToCart(menuItem, options);
    setSelectedOptions({});
    setShowOptions(false);
  };

  const hasRequiredOptions = menuItem.options?.some(option => option.isRequired);
  const allRequiredOptionsSelected = menuItem.options?.every(option => 
    !option.isRequired || selectedOptions[option.id]
  ) ?? true;

  const canAddToCart = menuItem.isAvailable && (!hasRequiredOptions || allRequiredOptionsSelected);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex">
          {/* Menu Item Image */}
          {menuItem.image && (
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <img
                src={menuItem.image}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Menu Item Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {menuItem.name}
                  </h3>
                  {menuItem.isPopular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                
                {menuItem.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {menuItem.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${menuItem.price.toFixed(2)}
                  </span>
                  
                  {!menuItem.isAvailable && (
                    <Badge variant="destructive" className="text-xs">
                      Unavailable
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Options and Add to Cart */}
            <div className="mt-3">
              {menuItem.options && menuItem.options.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                  className="mb-3"
                >
                  {showOptions ? 'Hide Options' : 'Customize'}
                </Button>
              )}

              {showOptions && menuItem.options && (
                <div className="mb-3">
                  <MenuItemOptions
                    options={menuItem.options}
                    selectedOptions={selectedOptions}
                    onOptionChange={handleOptionChange}
                  />
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                size="sm"
                className="w-full"
              >
                {!menuItem.isAvailable 
                  ? 'Unavailable' 
                  : hasRequiredOptions && !allRequiredOptionsSelected
                    ? 'Select Required Options'
                    : 'Add to Cart'
                }
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
