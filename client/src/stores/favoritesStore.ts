import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteRestaurantIds: string[];
  favoriteMenuItemIds: string[];
  
  // Actions
  toggleRestaurantFavorite: (restaurantId: string) => void;
  toggleMenuItemFavorite: (menuItemId: string) => void;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  isMenuItemFavorite: (menuItemId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    persist(
      (set, get) => ({
        favoriteRestaurantIds: [],
        favoriteMenuItemIds: [],

        toggleRestaurantFavorite: (restaurantId) => {
          const { favoriteRestaurantIds } = get();
          set({
            favoriteRestaurantIds: favoriteRestaurantIds.includes(restaurantId)
              ? favoriteRestaurantIds.filter(id => id !== restaurantId)
              : [...favoriteRestaurantIds, restaurantId]
          });
        },

        toggleMenuItemFavorite: (menuItemId) => {
          const { favoriteMenuItemIds } = get();
          set({
            favoriteMenuItemIds: favoriteMenuItemIds.includes(menuItemId)
              ? favoriteMenuItemIds.filter(id => id !== menuItemId)
              : [...favoriteMenuItemIds, menuItemId]
          });
        },

        isRestaurantFavorite: (restaurantId) => {
          return get().favoriteRestaurantIds.includes(restaurantId);
        },

        isMenuItemFavorite: (menuItemId) => {
          return get().favoriteMenuItemIds.includes(menuItemId);
        },

        clearFavorites: () => set({
          favoriteRestaurantIds: [],
          favoriteMenuItemIds: []
        }),
      }),
      {
        name: 'favorites-store',
      }
    ),
    { name: 'favorites-store' }
  )
);
