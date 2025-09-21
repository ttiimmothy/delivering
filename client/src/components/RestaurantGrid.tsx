'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Star, Clock, DollarSign, Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Restaurant } from '../types/graphql'
import { useFavoritesStore } from '../stores/favoritesStore'
import { useToggleFavorite } from '../hooks/useRestaurants'
import {useAuth} from "../hooks/useAuth";
import {useEffect, useState} from "react";

interface RestaurantGridProps {
  restaurants: Restaurant[]
  loading?: boolean
  error?: any
  showFavorites?: boolean
  title?: string
  description?: string
}

export function RestaurantGrid({ 
  restaurants, 
  loading, 
  error, 
  showFavorites = true,
  title = "Popular Restaurants",
  description = "Discover amazing food from top-rated restaurants in your area"
}: RestaurantGridProps) {
  // Favorites functionality
  const { toggleRestaurantFavorite, isRestaurantFavorite } = useFavoritesStore();
  const { toggleFavorite, loading: favoriteLoading } = useToggleFavorite();
  const {user, isAuthenticated} = useAuth()
  const [showFavorite, setShowFavorite] = useState(showFavorites)

  useEffect(() => {
    if (user && isAuthenticated) {
      setShowFavorite(true)
    } else {
      setShowFavorite(false)
    }
  },[user, isAuthenticated])

  // Handle favorite toggle
  const handleToggleFavorite = async (restaurantId: string) => {
    try {
      await toggleFavorite(restaurantId);
      toggleRestaurantFavorite(restaurantId, user.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {description}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading restaurants...</span>
          </div>
        ) : error ? (
          <div className="border-2 border-red-500 rounded-lg p-8 text-center bg-red-50 dark:bg-red-900/20">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <h3 className="text-lg font-semibold mb-2">Failed to fetch restaurants</h3>
              <p className="text-sm">{error.message}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Reload
            </Button>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Favorite Button */}
                {showFavorites && (
                  <button
                    onClick={() => handleToggleFavorite(restaurant.id)}
                    disabled={favoriteLoading}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        isRestaurantFavorite(restaurant.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </button>
                )}
                
                {/* Status Badges */}
                {restaurant.isOpen ? (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    Open
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="absolute top-2 left-2">
                    Closed
                  </Badge>
                )}
                
                {/* Favorite Badge */}
                {showFavorites && isRestaurantFavorite(restaurant.id) && (
                  <Badge className="absolute bottom-2 left-2 bg-red-500">
                    <Heart className="h-3 w-3 mr-1" />
                    Favorite
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{restaurant.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{restaurant.cuisine}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating || 'N/A'}</span>
                    <span>({restaurant.reviewCount || 0})</span>
                  </div>
                </div>
                {restaurant.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">
                    {restaurant.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{restaurant.deliveryTime} min delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>${restaurant.deliveryFee} delivery fee</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Min. order: ${restaurant.minimumOrder}
                  </div>
                  {restaurant.address && (
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {restaurant.address.city}, {restaurant.address.state}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  asChild 
                  className="w-full" 
                  disabled={!restaurant.isOpen}
                >
                  <Link href={`/restaurant/${restaurant.slug}`}>
                    {restaurant.isOpen ? 'View Menu' : 'Currently Closed'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/restaurants">
              View All Restaurants
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
