import React from 'react';
import { useRestaurantStore, useUserStore, useCartStore, useOrderStore } from '../stores';

// Example component showing how to use Zustand stores
export function StoreUsageExample() {
  // Restaurant store
  const {
    restaurants,
    currentRestaurant,
    favoriteRestaurants,
    addToFavorites,
    removeFromFavorites,
    loading: restaurantLoading
  } = useRestaurantStore();

  // User store
  const {
    user,
    isAuthenticated,
    updateUser,
    addAddress,
    setDefaultAddress
  } = useUserStore();

  // Cart store
  const {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    getTotal
  } = useCartStore();

  // Order store
  const {
    orders,
    currentOrder,
    addOrder,
    updateOrderStatus,
    getActiveOrders
  } = useOrderStore();

  const handleAddToFavorites = (restaurantId: string) => {
    addToFavorites(restaurantId);
  };

  const handleAddToCart = () => {
    if (currentRestaurant) {
      addItem({
        menuItemId: 'item-1',
        menuItem: {
          id: 'item-1',
          name: 'Pizza',
          price: 15.99,
          restaurant: {
            id: currentRestaurant.id,
            name: currentRestaurant.name
          }
        },
        quantity: 1,
        specialInstructions: 'Extra cheese'
      });
    }
  };

  const handleUpdateProfile = () => {
    if (user) {
      updateUser({
        firstName: 'John',
        lastName: 'Doe'
      });
    }
  };

  const handleAddAddress = () => {
    addAddress({
      id: 'addr-1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isDefault: true,
      label: 'Home'
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Store Usage Example</h2>
      
      {/* Restaurant Section */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold">Restaurants</h3>
        <p>Total restaurants: {restaurants.length}</p>
        <p>Favorites: {favoriteRestaurants.length}</p>
        <p>Loading: {restaurantLoading ? 'Yes' : 'No'}</p>
        {currentRestaurant && (
          <p>Current: {currentRestaurant.name}</p>
        )}
      </div>

      {/* User Section */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold">User</h3>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        {user && (
          <div>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Addresses: {user.addresses?.length || 0}</p>
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold">Cart</h3>
        <p>Items: {getItemCount()}</p>
        <p>Total: ${getTotal().toFixed(2)}</p>
        <p>Items in cart: {cart?.items.length || 0}</p>
      </div>

      {/* Orders Section */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold">Orders</h3>
        <p>Total orders: {orders.length}</p>
        <p>Active orders: {getActiveOrders().length}</p>
        {currentOrder && (
          <p>Current order: {currentOrder.orderNumber}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-x-2">
        <button 
          onClick={() => handleAddToFavorites('rest-1')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add to Favorites
        </button>
        <button 
          onClick={handleAddToCart}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleUpdateProfile}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Update Profile
        </button>
        <button 
          onClick={handleAddAddress}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Add Address
        </button>
      </div>
    </div>
  );
}
