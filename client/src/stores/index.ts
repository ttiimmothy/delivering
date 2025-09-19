// Core data stores (use with Apollo Client)
export { useCartStore } from './cartStore';

// UI and client-side stores
export { useUIStore } from './uiStore';
export { useFavoritesStore } from './favoritesStore';

// Re-export types for convenience
export type { CartItem, Cart } from './cartStore';