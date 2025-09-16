import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { 
  ordersQuery, 
  orderQuery, 
  placeOrderMutation,
  orderStatusChangedSubscription,
  cartQuery
} from '@/lib/graphql/operations';
import { 
  OrdersQueryVariables, 
  CreateOrderInput,
  Order 
} from '@/types/graphql';

export const useOrders = (variables?: OrdersQueryVariables) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(ordersQuery, {
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  return {
    orders: data?.orders || [],
    loading,
    error,
    refetch,
    fetchMore,
  };
};

export const useOrder = (id: string) => {
  const { data, loading, error, refetch } = useQuery(orderQuery, {
    variables: { id },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !id,
  });

  return {
    order: data?.order || null,
    loading,
    error,
    refetch,
  };
};

export const usePlaceOrder = () => {
  const [placeOrderMutationFn, { loading, error }] = useMutation(placeOrderMutation, {
    refetchQueries: [ordersQuery, cartQuery],
    errorPolicy: 'all',
  });

  const placeOrder = async (input: CreateOrderInput): Promise<Order | null> => {
    try {
      const { data } = await placeOrderMutationFn({ variables: { input } });
      return data?.placeOrder || null;
    } catch (error) {
      console.error('Place order error:', error);
      throw error;
    }
  };

  return {
    placeOrder,
    loading,
    error,
  };
};

export const useOrderStatusSubscription = (orderId: string) => {
  const { data, loading, error } = useSubscription(orderStatusChangedSubscription, {
    variables: { orderId },
    skip: !orderId,
    errorPolicy: 'all',
  });

  return {
    orderEvent: data?.orderStatusChanged || null,
    loading,
    error,
  };
};
