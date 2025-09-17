'use client';

import { useParams } from 'next/navigation';
import { useRestaurant } from '../../../hooks/useRestaurants';
import { RestaurantHeader } from '../../../components/restaurant/RestaurantHeader';
import { RestaurantMenu } from '../../../components/restaurant/RestaurantMenu';
import { RestaurantInfo } from '../../../components/restaurant/RestaurantInfo';
import { CartSidebar } from '../../../components/restaurant/CartSidebar';
import { Loader2 } from 'lucide-react';

export default function RestaurantPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { restaurant, loading, error } = useRestaurant(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message || 'The restaurant you are looking for does not exist.'}
          </p>
          <a 
            href="/restaurants" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Browse all restaurants
          </a>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The restaurant you are looking for does not exist.
          </p>
          <a 
            href="/restaurants" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Browse all restaurants
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RestaurantMenu restaurant={restaurant} />
          </div>
          
          <div className="lg:col-span-1">
            <RestaurantInfo restaurant={restaurant} />
          </div>
        </div>
      </div>
      
      <CartSidebar />
    </div>
  );
}
