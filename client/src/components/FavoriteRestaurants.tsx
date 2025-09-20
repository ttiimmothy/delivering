'use client'

import { useFavoriteRestaurants } from '../hooks/useRestaurants'
import { RestaurantGrid } from './RestaurantGrid'
import { useFavoritesStore } from '../stores/favoritesStore'
import { useMemo } from 'react'

export function FavoriteRestaurants() {
  const { favoriteRestaurants, loading, error } = useFavoriteRestaurants()
  const { favoriteRestaurantIds } = useFavoritesStore()

  // Filter restaurants to only show those that are actually favorited
  const filteredFavorites = useMemo(() => {
    return favoriteRestaurants.filter(restaurant => 
      favoriteRestaurantIds.includes(restaurant.id)
    )
  }, [favoriteRestaurants, favoriteRestaurantIds])

  return (
    <RestaurantGrid
      restaurants={filteredFavorites}
      loading={loading}
      error={error}
      showFavorites={true}
      title="Your Favorite Restaurants"
      description="Restaurants you've marked as favorites"
    />
  )
}
