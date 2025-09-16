'use client';

import { Hero } from '@/components/hero'
import { RestaurantGrid } from '@/components/restaurant-grid'
import { useRestaurants } from '@/hooks/useRestaurants'

export default function HomePage() {
  const { restaurants, loading, error } = useRestaurants({
    isOpen: true,
    limit: 12,
  });

  return (
    <>
      <Hero />
      <RestaurantGrid 
        restaurants={restaurants} 
        loading={loading} 
        error={error} 
      />
    </>
  )
}
