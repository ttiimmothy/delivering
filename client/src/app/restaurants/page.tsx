'use client'

import { useState } from 'react'
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data for restaurants
const mockRestaurants = [
  {
    id: 1,
    name: "Bella Vista Italian",
    cuisine: "Italian",
    rating: 4.8,
    deliveryTime: "25-35 min",
    distance: "0.8 mi",
    image: "/api/placeholder/300/200",
    priceRange: "$$",
    isOpen: true,
    featured: true
  },
  {
    id: 2,
    name: "Sushi Zen",
    cuisine: "Japanese",
    rating: 4.9,
    deliveryTime: "30-40 min",
    distance: "1.2 mi",
    image: "/api/placeholder/300/200",
    priceRange: "$$$",
    isOpen: true,
    featured: false
  },
  {
    id: 3,
    name: "Burger Palace",
    cuisine: "American",
    rating: 4.6,
    deliveryTime: "20-30 min",
    distance: "0.5 mi",
    image: "/api/placeholder/300/200",
    priceRange: "$",
    isOpen: true,
    featured: false
  },
  {
    id: 4,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.7,
    deliveryTime: "15-25 min",
    distance: "0.3 mi",
    image: "/api/placeholder/300/200",
    priceRange: "$",
    isOpen: false,
    featured: false
  },
  {
    id: 5,
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.5,
    deliveryTime: "35-45 min",
    distance: "1.5 mi",
    image: "/api/placeholder/300/200",
    priceRange: "$$",
    isOpen: true,
    featured: false
  },
  {
    id: 6,
    name: "Pizza Corner",
    cuisine: "Italian",
    rating: 4.4,
    deliveryTime: "25-35 min",
    distance: "0.9 mi",
    image: "/api/placeholder/300/200",
    priceRange: "$$",
    isOpen: true,
    featured: false
  }
]

const cuisineTypes = ["All", "Italian", "Japanese", "American", "Mexican", "Indian", "Chinese", "Thai"]

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [sortBy, setSortBy] = useState('rating')

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine
    return matchesSearch && matchesCuisine
  })

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'deliveryTime':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-muted-foreground">Restaurant Image</span>
                </div>
                {restaurant.featured && (
                  <Badge className="absolute top-2 left-2 bg-orange-500">
                    Featured
                  </Badge>
                )}
                {!restaurant.isOpen && (
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    Closed
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{restaurant.cuisine} • {restaurant.priceRange}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.distance} away</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  disabled={!restaurant.isOpen}
                >
                  {restaurant.isOpen ? 'Order Now' : 'Currently Closed'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No restaurants found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedCuisine('All')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
