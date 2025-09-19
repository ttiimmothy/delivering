import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Layout
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Filters
  selectedCuisine: string | null;
  selectedPriceRange: [number, number] | null;
  sortBy: 'rating' | 'deliveryTime' | 'price' | 'name';
  
  // Modals
  cartOpen: boolean;
  loginModalOpen: boolean;
  orderTrackingModalOpen: boolean;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSelectedCuisine: (cuisine: string | null) => void;
  setSelectedPriceRange: (range: [number, number] | null) => void;
  setSortBy: (sort: 'rating' | 'deliveryTime' | 'price' | 'name') => void;
  setCartOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
  setOrderTrackingModalOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: false,
        mobileMenuOpen: false,
        selectedCuisine: null,
        selectedPriceRange: null,
        sortBy: 'rating',
        cartOpen: false,
        loginModalOpen: false,
        orderTrackingModalOpen: false,
        theme: 'system',

        // Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
        setSelectedCuisine: (cuisine) => set({ selectedCuisine: cuisine }),
        setSelectedPriceRange: (range) => set({ selectedPriceRange: range }),
        setSortBy: (sort) => set({ sortBy: sort }),
        setCartOpen: (open) => set({ cartOpen: open }),
        setLoginModalOpen: (open) => set({ loginModalOpen: open }),
        setOrderTrackingModalOpen: (open) => set({ orderTrackingModalOpen: open }),
        setTheme: (theme) => set({ theme }),
        resetFilters: () => set({ 
          selectedCuisine: null, 
          selectedPriceRange: null, 
          sortBy: 'rating' 
        }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({ 
          theme: state.theme,
          sortBy: state.sortBy,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);
