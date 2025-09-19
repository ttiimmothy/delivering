import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  menuItemId: string;
  menuItem: {
    id: string;
    name: string;
    price: number;
    image?: string;
    restaurant: {
      id: string;
      name: string;
    };
  };
  quantity: number;
  specialInstructions?: string;
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  itemCount: number;
  restaurantId?: string;
  restaurantName?: string;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setCart: (cart: Cart | null) => void;
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  addSpecialInstructions: (id: string, instructions: string) => void;
  setTip: (tip: number) => void;
  setDeliveryFee: (fee: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed values
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: null,
        loading: false,
        error: null,

        setCart: (cart) => set({ cart }),
        
        addItem: (item) => {
          const { cart } = get();
          const totalPrice = item.menuItem.price * item.quantity;
          const newItem: CartItem = {
            ...item,
            id: `${item.menuItemId}-${Date.now()}`,
            totalPrice
          };
          
          if (!cart) {
            const newCart: Cart = {
              id: `cart-${Date.now()}`,
              items: [newItem],
              subtotal: totalPrice,
              tax: 0,
              deliveryFee: 0,
              tip: 0,
              total: totalPrice,
              itemCount: item.quantity,
              restaurantId: item.menuItem.restaurant.id,
              restaurantName: item.menuItem.restaurant.name
            };
            set({ cart: newCart });
          } else {
            // Check if item already exists
            const existingItemIndex = cart.items.findIndex(
              i => i.menuItemId === item.menuItemId && 
                   i.specialInstructions === item.specialInstructions
            );
            
            let updatedItems: CartItem[];
            if (existingItemIndex >= 0) {
              // Update existing item
              updatedItems = cart.items.map((i, index) => 
                index === existingItemIndex 
                  ? { 
                      ...i, 
                      quantity: i.quantity + item.quantity,
                      totalPrice: (i.quantity + item.quantity) * i.menuItem.price
                    }
                  : i
              );
            } else {
              // Add new item
              updatedItems = [...cart.items, newItem];
            }
            
            const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            
            set({ 
              cart: { 
                ...cart, 
                items: updatedItems,
                subtotal,
                itemCount,
                total: subtotal + cart.tax + cart.deliveryFee + cart.tip
              } 
            });
          }
        },
        
        updateItem: (id, updates) => {
          const { cart } = get();
          if (cart) {
            const updatedItems = cart.items.map(item => 
              item.id === id ? { ...item, ...updates } : item
            );
            const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            
            set({ 
              cart: { 
                ...cart, 
                items: updatedItems,
                subtotal,
                itemCount,
                total: subtotal + cart.tax + cart.deliveryFee + cart.tip
              } 
            });
          }
        },
        
        removeItem: (id) => {
          const { cart } = get();
          if (cart) {
            const updatedItems = cart.items.filter(item => item.id !== id);
            const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            
            set({ 
              cart: { 
                ...cart, 
                items: updatedItems,
                subtotal,
                itemCount,
                total: subtotal + cart.tax + cart.deliveryFee + cart.tip
              } 
            });
          }
        },
        
        clearCart: () => set({ cart: null }),
        
        updateQuantity: (id, quantity) => {
          const { cart } = get();
          if (cart) {
            const updatedItems = cart.items.map(item => 
              item.id === id 
                ? { 
                    ...item, 
                    quantity, 
                    totalPrice: quantity * item.menuItem.price 
                  }
                : item
            );
            const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            
            set({ 
              cart: { 
                ...cart, 
                items: updatedItems,
                subtotal,
                itemCount,
                total: subtotal + cart.tax + cart.deliveryFee + cart.tip
              } 
            });
          }
        },
        
        addSpecialInstructions: (id, instructions) => {
          const { cart } = get();
          if (cart) {
            set({ 
              cart: { 
                ...cart, 
                items: cart.items.map(item => 
                  item.id === id ? { ...item, specialInstructions: instructions } : item
                ) 
              } 
            });
          }
        },
        
        setTip: (tip) => {
          const { cart } = get();
          if (cart) {
            set({ 
              cart: { 
                ...cart, 
                tip, 
                total: cart.subtotal + cart.tax + cart.deliveryFee + tip 
              } 
            });
          }
        },
        
        setDeliveryFee: (fee) => {
          const { cart } = get();
          if (cart) {
            set({ 
              cart: { 
                ...cart, 
                deliveryFee: fee, 
                total: cart.subtotal + cart.tax + fee + cart.tip 
              } 
            });
          }
        },
        
        setLoading: (loading) => set({ loading }),
        
        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),
        
        getItemCount: () => {
          const { cart } = get();
          return cart?.itemCount || 0;
        },
        
        getSubtotal: () => {
          const { cart } = get();
          return cart?.subtotal || 0;
        },
        
        getTotal: () => {
          const { cart } = get();
          return cart?.total || 0;
        },
      }),
      {
        name: 'cart-store',
        partialize: (state) => ({ cart: state.cart }),
      }
    ),
    { name: 'cart-store' }
  )
);
