import { useMutation } from '@apollo/client/react';
import { 
  createCheckoutSessionMutation,
  createBillingPortalSessionMutation,
  createPaymentIntentMutation,
  confirmPaymentIntentMutation,
  cancelPaymentIntentMutation,
  createRefundMutation 
} from '../lib/graphql/operations';
import { 
  CreateCheckoutSessionInput,
  CreateBillingPortalSessionInput,
  CreatePaymentIntentInput,
  CreateRefundInput 
} from '../types/graphql';

export const useCreateCheckoutSession = () => {
  const [createCheckoutSessionMutationFn, { loading, error }] = useMutation(createCheckoutSessionMutation, {
    errorPolicy: 'all',
  });

  const createCheckoutSession = async (input: CreateCheckoutSessionInput) => {
    try {
      const { data } = await createCheckoutSessionMutationFn({ variables: { input } }) as any;
      return data?.createCheckoutSession || null;
    } catch (error) {
      console.error('Create checkout session error:', error);
      throw error;
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
  };
};

export const useCreateBillingPortalSession = () => {
  const [createBillingPortalSessionMutationFn, { loading, error }] = useMutation(createBillingPortalSessionMutation, {
    errorPolicy: 'all',
  });

  const createBillingPortalSession = async (input: CreateBillingPortalSessionInput) => {
    try {
      const { data } = await createBillingPortalSessionMutationFn({ variables: { input } }) as any;
      return data?.createBillingPortalSession || null;
    } catch (error) {
      console.error('Create billing portal session error:', error);
      throw error;
    }
  };

  return {
    createBillingPortalSession,
    loading,
    error,
  };
};

export const useCreatePaymentIntent = () => {
  const [createPaymentIntentMutationFn, { loading, error }] = useMutation(createPaymentIntentMutation, {
    errorPolicy: 'all',
  });

  const createPaymentIntent = async (input: CreatePaymentIntentInput) => {
    try {
      const { data } = await createPaymentIntentMutationFn({ variables: { input } }) as any;
      return data?.createPaymentIntent || null;
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  };

  return {
    createPaymentIntent,
    loading,
    error,
  };
};

export const useConfirmPaymentIntent = () => {
  const [confirmPaymentIntentMutationFn, { loading, error }] = useMutation(confirmPaymentIntentMutation, {
    errorPolicy: 'all',
  });

  const confirmPaymentIntent = async (paymentIntentId: string) => {
    try {
      const { data } = await confirmPaymentIntentMutationFn({ 
        variables: { paymentIntentId } 
      }) as any;
      return data?.confirmPaymentIntent || null;
    } catch (error) {
      console.error('Confirm payment intent error:', error);
      throw error;
    }
  };

  return {
    confirmPaymentIntent,
    loading,
    error,
  };
};

export const useCancelPaymentIntent = () => {
  const [cancelPaymentIntentMutationFn, { loading, error }] = useMutation(cancelPaymentIntentMutation, {
    errorPolicy: 'all',
  });

  const cancelPaymentIntent = async (paymentIntentId: string) => {
    try {
      const { data } = await cancelPaymentIntentMutationFn({ 
        variables: { paymentIntentId } 
      }) as any;
      return data?.cancelPaymentIntent || null;
    } catch (error) {
      console.error('Cancel payment intent error:', error);
      throw error;
    }
  };

  return {
    cancelPaymentIntent,
    loading,
    error,
  };
};

export const useCreateRefund = () => {
  const [createRefundMutationFn, { loading, error }] = useMutation(createRefundMutation, {
    errorPolicy: 'all',
  });

  const createRefund = async (input: CreateRefundInput) => {
    try {
      const { data } = await createRefundMutationFn({ variables: { input } }) as any;
      return data?.createRefund || null;
    } catch (error) {
      console.error('Create refund error:', error);
      throw error;
    }
  };

  return {
    createRefund,
    loading,
    error,
  };
};
