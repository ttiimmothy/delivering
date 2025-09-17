'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Star, Clock, DollarSign, MapPin, Phone, Heart } from 'lucide-react';
import { Restaurant } from '@/types/graphql';
import { useToggleFavorite } from '@/hooks/useRestaurants';
import { useState } from 'react';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const { toggleFavorite, loading: favoriteLoading } = useToggleFavorite();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavorite(restaurant.id);
      setIsFavorite(result);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {restaurant.isOpen ? (
            <Badge className="bg-green-500 text-white">
              Open
            </Badge>
          ) : (
            <Badge variant="destructive">
              Closed
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-4 right-4">
          <Button
            size="sm"
            variant="secondary"
            className="h-10 w-10 p-0"
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
          >
            <Heart 
              className={`h-5 w-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`} 
            />
          </Button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white dark:bg-gray-800 shadow-lg -mt-16 relative z-10 mx-4 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {restaurant.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="font-medium">{restaurant.cuisine}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating || 'N/A'}</span>
                <span>({restaurant.reviewCount || 0} reviews)</span>
              </div>
            </div>

            {restaurant.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {restaurant.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{restaurant.deliveryTime} min delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${restaurant.deliveryFee} delivery fee</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Min. order: ${restaurant.minimumOrder}</span>
              </div>
            </div>
          </div>

          {/* Restaurant Contact Info */}
          <div className="flex flex-col gap-2 text-sm">
            {restaurant.address && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>
                  {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}
                </span>
              </div>
            )}
            {restaurant.phone && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{restaurant.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
