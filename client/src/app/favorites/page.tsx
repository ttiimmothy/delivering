'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { favoriteRestaurantsQuery, toggleFavoriteMutation } from '../../lib/graphql/operations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Heart, Star, Clock, MapPin, Phone, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../hooks/useToast';

export default function FavoritesPage() {
  const { toast } = useToast();
  const { data, loading, error, refetch } = useQuery(favoriteRestaurantsQuery) as any;
  const [toggleFavorite] = useMutation(toggleFavoriteMutation);

  const handleToggleFavorite = async (restaurantId: string) => {
    try {
      await toggleFavorite({
        variables: { restaurantId },
        refetchQueries: ['FavoriteRestaurants']
      });
      toast({
        title: "Removed from favorites",
        description: "Restaurant has been removed from your favorites.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove restaurant from favorites.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Favorites</h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const favorites = data?.favoriteRestaurants || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted-foreground">
          {favorites.length === 0 
            ? "You haven't added any restaurants to your favorites yet." 
            : `${favorites.length} restaurant${favorites.length === 1 ? '' : 's'} in your favorites`
          }
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring restaurants and add them to your favorites for quick access.
          </p>
          <Button asChild>
            <Link href="/restaurants">Browse Restaurants</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={restaurant.image || '/placeholder-restaurant.jpg'}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => handleToggleFavorite(restaurant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {restaurant.isOpen ? (
                  <Badge className="absolute top-2 left-2 bg-green-500">Open</Badge>
                ) : (
                  <Badge variant="secondary" className="absolute top-2 left-2">Closed</Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {restaurant.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                    <span>({restaurant.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">
                      {restaurant.address.street}, {restaurant.address.city}
                    </span>
                  </div>
                  {restaurant.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm">
                    <span className="font-medium">${restaurant.deliveryFee}</span>
                    <span className="text-muted-foreground"> delivery fee</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Min. ${restaurant.minimumOrder}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1">
                    <Link href={`/restaurant/${restaurant.slug}`}>
                      View Menu
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
