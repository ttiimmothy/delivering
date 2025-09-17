'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MenuItem } from '@/components/restaurant/MenuItem';
import { Restaurant } from '@/types/graphql';
import { useCart } from '@/hooks/useCart';

interface RestaurantMenuProps {
  restaurant: Restaurant;
}

export function RestaurantMenu({ restaurant }: RestaurantMenuProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    restaurant.menuCategories?.[0]?.id || null
  );

  const activeCategories = restaurant.menuCategories?.filter(category => category.isActive) || [];
  const selectedCategoryData = activeCategories.find(cat => cat.id === selectedCategory);

  const handleAddToCart = (menuItem: any, options: any[] = []) => {
    addToCart({
      menuItemId: menuItem.id,
      quantity: 1,
      options: options.map(opt => ({
        optionId: opt.optionId,
        valueId: opt.valueId
      }))
    });
  };

  if (!restaurant.menuCategories || restaurant.menuCategories.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Menu Available
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            This restaurant hasn't added their menu yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {activeCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="text-sm"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Items */}
      {selectedCategoryData && (
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategoryData.name}
            </h2>
            {selectedCategoryData.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedCategoryData.description}
              </p>
            )}
          </div>

          <div className="grid gap-4">
            {selectedCategoryData.menuItems
              ?.filter(item => item.isActive)
              ?.sort((a, b) => a.sortOrder - b.sortOrder)
              ?.map((menuItem) => (
                <MenuItem
                  key={menuItem.id}
                  menuItem={menuItem}
                  onAddToCart={handleAddToCart}
                />
              ))}
          </div>
        </div>
      )}

      {activeCategories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Active Menu Categories
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              This restaurant doesn't have any active menu categories.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
