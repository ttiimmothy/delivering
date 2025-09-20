'use client';

import { FavoriteRestaurants } from '../../components/FavoriteRestaurants';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { Heart } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favoriteRestaurantIds } = useFavoritesStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteRestaurantIds.length === 0 
              ? "You haven't added any restaurants to your favorites yet." 
              : `${favoriteRestaurantIds.length} restaurant${favoriteRestaurantIds.length === 1 ? '' : 's'} in your favorites`
            }
          </p>
        </div>

        {favoriteRestaurantIds.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring restaurants and add them to your favorites for quick access.
              </p>
              <Button asChild>
                <Link href="/restaurants">Browse Restaurants</Link>
              </Button>
            </div>
          </div>
        ) : (
          <FavoriteRestaurants />
        )}
      </div>
    </div>
  );
}
