'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, Star, Clock, MapPin, Heart, Loader2 } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert, AlertDescription } from '../../components/ui/Alert'
import { Skeleton } from '../../components/ui/Skeleton'
import { useRestaurants, useToggleFavorite } from "../../hooks/useRestaurants";
import { useFavoritesStore } from '../../stores/favoritesStore';
import Link from 'next/link';
import {useAuth} from "../../hooks/useAuth";

const cuisineTypes = ["All", "Italian", "Japanese", "American", "Mexican", "Indian", "Chinese", "Thai"]

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [sortBy, setSortBy] = useState('rating')
  
  // Apollo Client data
  const { restaurants, loading, error, refetch } = useRestaurants({
    search: searchQuery || undefined,
    cuisine: selectedCuisine !== 'All' ? selectedCuisine : undefined,
    sortBy,
    limit: 20
  });
  
  // Zustand stores
  const { toggleRestaurantFavorite, isRestaurantFavorite } = useFavoritesStore();
  const { toggleFavorite, loading: favoriteLoading } = useToggleFavorite();

  // Handle favorite toggle
  const handleToggleFavorite = async (restaurantId: string) => {
    try {
      await toggleFavorite(restaurantId);
      toggleRestaurantFavorite(restaurantId, user.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Memoized filtered and sorted restaurants
  const processedRestaurants = useMemo(() => {
    let filtered = restaurants;
    
    // Client-side filtering for search (server already handles most filtering)
    if (searchQuery) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Client-side filtering for cuisine
    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }
    
    // Client-side sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
        case 'deliveryTime':
          return a.deliveryTime - b.deliveryTime;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [restaurants, searchQuery, selectedCuisine, sortBy]);

  const [showFavorite, setShowFavorite] = useState(false)
  const {user, isAuthenticated} = useAuth()

  useEffect(() => {
    if (user && isAuthenticated) {
      setShowFavorite(true)
    } else {
      setShowFavorite(false)
    }
  },[user, isAuthenticated])

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Restaurants</h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing restaurants delivering to your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2">
            {cuisineTypes.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: 'rating', label: 'Rating' },
                { value: 'deliveryTime', label: 'Delivery Time' },
                { value: 'distance', label: 'Distance' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-24 mt-2" />
                  <Skeleton className="h-3 w-full mt-1" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {/* Failed to load restaurants: {error.message} */}
              Failed to load restaurants
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {processedRestaurants.length} restaurant{processedRestaurants.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Restaurant Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Favorite Button */}
                  {showFavorite && <button
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
                  </button>}
                  
                  {/* Status Badges */}
                  {!restaurant.isOpen && (
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      Closed
                    </Badge>
                  )}
                  
                  {showFavorite && isRestaurantFavorite(restaurant.id) && (
                    <Badge className="absolute bottom-2 left-2 bg-red-500">
                      <Heart className="h-3 w-3 mr-1" />
                      Favorite
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{restaurant.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{restaurant.rating || 'N/A'}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {restaurant.cuisine} • {restaurant.reviewCount} reviews
                  </p>
                  {restaurant.description && (
                    <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
                      {restaurant.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime} min delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{restaurant.address.city}, {restaurant.address.state}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delivery fee: ${restaurant.deliveryFee}</span>
                      <span className="text-muted-foreground">Min: ${restaurant.minimumOrder}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      asChild
                      className="flex-1" 
                      disabled={!restaurant.isOpen}
                    >
                      <Link href={`/restaurant/${restaurant.slug}`}>
                        {restaurant.isOpen ? 'View Menu' : 'Currently Closed'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && processedRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCuisine !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'No restaurants are available in your area'
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCuisine('All')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
