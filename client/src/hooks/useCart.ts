import { useQuery, useMutation } from '@apollo/client/react';
import { 
  cartQuery, 
  addToCartMutation, 
  updateCartItemMutation,
  removeFromCartMutation,
  clearCartMutation 
} from '../lib/graphql/operations';
import { 
  AddToCartInput, 
  UpdateCartItemInput, 
  RemoveFromCartInput,
  Cart,
  CartItem 
} from '../types/graphql';

export const useCart = () => {
  const { data, loading, error, refetch } = useQuery(cartQuery, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  }) as any;

  const [addToCartMutationFn, { loading: addLoading }] = useMutation(addToCartMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const [updateCartItemMutationFn, { loading: updateLoading }] = useMutation(updateCartItemMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const [removeFromCartMutationFn, { loading: removeLoading }] = useMutation(removeFromCartMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const [clearCartMutationFn, { loading: clearLoading }] = useMutation(clearCartMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const addToCart = async (input: AddToCartInput): Promise<CartItem | null> => {
    try {
      const { data } = await addToCartMutationFn({ variables: { input } }) as any;
      return data?.addToCart || null;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number): Promise<CartItem | null> => {
    try {
      const { data } = await updateCartItemMutationFn({ 
        variables: { input: { itemId, quantity } } 
      }) as any;
      return data?.updateCartItem || null;
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
    try {
      const { data } = await removeFromCartMutationFn({ 
        variables: { input: { itemId } } 
      }) as any;
      return data?.removeFromCart || false;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      const { data } = await clearCartMutationFn() as any;
      return data?.clearCart || false;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  };

  const cart = data?.cart;
  const items = cart?.items || [];
  const total = cart?.total || 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    items,
    total,
    itemCount,
    loading: loading || addLoading || updateLoading || removeLoading || clearLoading,
    error,
    refetch,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
};

export const useAddToCart = () => {
  const [addToCartMutationFn, { loading, error }] = useMutation(addToCartMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const addToCart = async (input: AddToCartInput): Promise<CartItem | null> => {
    try {
      const { data } = await addToCartMutationFn({ variables: { input } }) as any;
      return data?.addToCart || null;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  };

  return {
    addToCart,
    loading,
    error,
  };
};

export const useUpdateCartItem = () => {
  const [updateCartItemMutationFn, { loading, error }] = useMutation(updateCartItemMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const updateCartItem = async (input: UpdateCartItemInput): Promise<CartItem | null> => {
    try {
      const { data } = await updateCartItemMutationFn({ variables: { input } }) as any;
      return data?.updateCartItem || null;
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  };

  return {
    updateCartItem,
    loading,
    error,
  };
};

export const useRemoveFromCart = () => {
  const [removeFromCartMutationFn, { loading, error }] = useMutation(removeFromCartMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const removeFromCart = async (input: RemoveFromCartInput): Promise<boolean> => {
    try {
      const { data } = await removeFromCartMutationFn({ variables: { input } }) as any;
      return data?.removeFromCart || false;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  };

  return {
    removeFromCart,
    loading,
    error,
  };
};

export const useClearCart = () => {
  const [clearCartMutationFn, { loading, error }] = useMutation(clearCartMutation, {
    refetchQueries: [cartQuery],
    errorPolicy: 'all',
  });

  const clearCart = async (): Promise<boolean> => {
    try {
      const { data } = await clearCartMutationFn() as any;
      return data?.clearCart || false;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  };

  return {
    clearCart,
    loading,
    error,
  };
};
