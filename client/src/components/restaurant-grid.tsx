'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Clock, DollarSign, Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Restaurant } from '@/types/graphql'

interface RestaurantGridProps {
  restaurants: Restaurant[]
  loading?: boolean
  error?: any
}

export function RestaurantGrid({ restaurants, loading, error }: RestaurantGridProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Restaurants
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover amazing food from top-rated restaurants in your area
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading restaurants...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load restaurants</p>
            <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                {restaurant.isOpen ? (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    Open
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="absolute top-2 left-2">
                    Closed
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{restaurant.cuisine}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating || 'N/A'}</span>
                    <span>({restaurant.reviewCount || 0})</span>
                  </div>
                </div>
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
                </div>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/restaurant/${restaurant.slug}`}>
                    View Menu
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
