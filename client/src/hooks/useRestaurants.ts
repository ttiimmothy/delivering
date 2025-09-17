import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { 
  restaurantsQuery, 
  restaurantQuery, 
  favoriteRestaurantsQuery,
  toggleFavoriteMutation 
} from '@/lib/graphql/operations';
import { 
  RestaurantsQueryVariables, 
  Restaurant 
} from '@/types/graphql';

export const useRestaurants = (variables?: RestaurantsQueryVariables) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(restaurantsQuery, {
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  return {
    restaurants: data?.restaurants || [],
    loading,
    error,
    refetch,
    fetchMore,
  };
};

export const useRestaurant = (slug: string) => {
  const { data, loading, error, refetch } = useQuery(restaurantQuery, {
    variables: { slug },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    skip: !slug,
  });

  return {
    restaurant: data?.restaurant || null,
    loading,
    error,
    refetch,
  };
};

export const useFavoriteRestaurants = () => {
  const { data, loading, error, refetch } = useQuery(favoriteRestaurantsQuery, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  return {
    favoriteRestaurants: data?.favoriteRestaurants || [],
    loading,
    error,
    refetch,
  };
};

export const useToggleFavorite = () => {
  const [toggleFavoriteMutationFn, { loading, error }] = useMutation(toggleFavoriteMutation, {
    refetchQueries: [restaurantsQuery, favoriteRestaurantsQuery],
    errorPolicy: 'all',
  });

  const toggleFavorite = async (restaurantId: string): Promise<boolean> => {
    try {
      const { data } = await toggleFavoriteMutationFn({ 
        variables: { restaurantId } 
      });
      return data?.toggleFavorite || false;
    } catch (error) {
      console.error('Toggle favorite error:', error);
      throw error;
    }
  };

  return {
    toggleFavorite,
    loading,
    error,
  };
};

export const useClearRestaurantCache = () => {
  const client = useApolloClient();

  const clearRestaurantCache = () => {
    client.cache.evict({ fieldName: 'restaurants' });
    client.cache.gc();
  };

  return { clearRestaurantCache };
};
