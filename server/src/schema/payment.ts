import { objectType, inputObjectType, queryField, mutationField, nonNull, stringArg, arg } from 'nexus';
import { StripeService } from '../services/stripe';
import { db } from '../db/client';
import { orders } from '../db/schema';
import { eq } from 'drizzle-orm';

// Types
export const CheckoutSession = objectType({
  name: 'CheckoutSession',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('url');
    t.string('customerId');
    t.string('customerEmail');
    t.nonNull.string('status');
    t.string('paymentIntentId');
    t.nonNull.string('createdAt');
    t.nonNull.string('expiresAt');
  },
});

export const BillingPortalSession = objectType({
  name: 'BillingPortalSession',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('url');
    t.nonNull.string('returnUrl');
    t.nonNull.string('createdAt');
  },
});

export const PaymentIntent = objectType({
  name: 'PaymentIntent',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('status');
    t.nonNull.string('amount');
    t.nonNull.string('currency');
    t.string('clientSecret');
    t.string('description');
    t.nonNull.string('createdAt');
    t.string('metadata');
  },
});

export const Refund = objectType({
  name: 'Refund',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('status');
    t.nonNull.string('amount');
    t.nonNull.string('currency');
    t.string('reason');
    t.nonNull.string('createdAt');
  },
});

// Input Types
export const CreateCheckoutSessionInput = inputObjectType({
  name: 'CreateCheckoutSessionInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('successUrl');
    t.nonNull.string('cancelUrl');
    t.string('customerEmail');
  },
});

export const CreateBillingPortalSessionInput = inputObjectType({
  name: 'CreateBillingPortalSessionInput',
  definition(t) {
    t.nonNull.string('customerId');
    t.nonNull.string('returnUrl');
  },
});

export const CreatePaymentIntentInput = inputObjectType({
  name: 'CreatePaymentIntentInput',
  definition(t) {
    t.nonNull.float('amount');
    t.string('currency');
    t.string('description');
    t.string('metadata');
  },
});

export const CreateRefundInput = inputObjectType({
  name: 'CreateRefundInput',
  definition(t) {
    t.nonNull.string('paymentIntentId');
    t.float('amount');
    t.string('reason');
  },
});

// Queries
export const PaymentQueries = queryField('paymentQueries', {
  type: 'Query',
  definition(t) {
    t.field('paymentIntent', {
      type: 'PaymentIntent',
      args: {
        paymentIntentId: nonNull(stringArg()),
      },
      resolve: async (_, { paymentIntentId }, ctx) => {
        if (!ctx.user) {
          throw new Error('Authentication required');
        }

        try {
          const paymentIntent = await StripeService.getPaymentIntent(paymentIntentId);
          
          return {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: (paymentIntent.amount / 100).toString(), // Convert from cents
            currency: paymentIntent.currency,
            clientSecret: paymentIntent.client_secret,
            description: paymentIntent.description || '',
            createdAt: new Date(paymentIntent.created * 1000).toISOString(),
            metadata: JSON.stringify(paymentIntent.metadata),
          };
        } catch (error) {
          console.error('Error fetching payment intent:', error);
          throw new Error('Failed to fetch payment intent');
        }
      },
    });
  },
});

// Mutations
export const PaymentMutations = mutationField('paymentMutations', {
  type: 'Mutation',
  definition(t) {
    t.field('createCheckoutSession', {
      type: 'CheckoutSession',
      args: {
        input: nonNull(arg({ type: 'CreateCheckoutSessionInput' })),
      },
      resolve: async (_, { input }, ctx) => {
        if (!ctx.user) {
          throw new Error('Authentication required');
        }

        try {
          // Verify the order belongs to the user
          const orderResult = await db
            .select()
            .from(orders)
            .where(eq(orders.id, input.orderId))
            .limit(1);

          if (orderResult.length === 0) {
            throw new Error('Order not found');
          }

          const order = orderResult[0];
          if (order.customerId !== ctx.user.id) {
            throw new Error('Unauthorized access to order');
          }

          const session = await StripeService.createCheckoutSession(input);
          
          return {
            id: session.id,
            url: session.url!,
            customerId: session.customer as string,
            customerEmail: session.customer_email || '',
            status: session.status!,
            paymentIntentId: session.payment_intent as string,
            createdAt: new Date(session.created * 1000).toISOString(),
            expiresAt: new Date(session.expires_at! * 1000).toISOString(),
          };
        } catch (error) {
          console.error('Error creating checkout session:', error);
          throw new Error('Failed to create checkout session');
        }
      },
    });

    t.field('createBillingPortalSession', {
      type: 'BillingPortalSession',
      args: {
        input: nonNull(arg({ type: 'CreateBillingPortalSessionInput' })),
      },
      resolve: async (_, { input }, ctx) => {
        if (!ctx.user) {
          throw new Error('Authentication required');
        }

        try {
          const session = await StripeService.createBillingPortalSession(input);
          
          return {
            id: session.id,
            url: session.url,
            returnUrl: session.return_url,
            createdAt: new Date(session.created * 1000).toISOString(),
          };
        } catch (error) {
          console.error('Error creating billing portal session:', error);
          throw new Error('Failed to create billing portal session');
        }
      },
    });

    t.field('createPaymentIntent', {
      type: 'PaymentIntent',
      args: {
        input: nonNull(arg({ type: 'CreatePaymentIntentInput' })),
      },
      resolve: async (_, { input }, ctx) => {
        if (!ctx.user) {
          throw new Error('Authentication required');
        }

        try {
          const metadata = input.metadata ? JSON.parse(input.metadata) : {};
          metadata.userId = ctx.user.id;

          const paymentIntent = await StripeService.createPaymentIntent(
            input.amount,
            input.currency || 'usd',
            metadata
          );
          
          return {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: (paymentIntent.amount / 100).toString(), // Convert from cents
            currency: paymentIntent.currency,
            clientSecret: paymentIntent.client_secret,
            description: paymentIntent.description || '',
            createdAt: new Date(paymentIntent.created * 1000).toISOString(),
            metadata: JSON.stringify(paymentIntent.metadata),
          };
        } catch (error) {
          console.error('Error creating payment intent:', error);
          throw new Error('Failed to create payment intent');
        }
      },
    });

    t.field('confirmPaymentIntent', {
      type: 'PaymentIntent',
      args: {
        paymentIntentId: nonNull(stringArg()),
      },
      resolve: async (_, { paymentIntentId }, ctx) => {
        if (!ctx.user) {
          throw new Error('Authentication required');
        }

        try {
          const paymentIntent = await StripeService.confirmPaymentIntent(paymentIntentId);
          
          return {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: (paymentIntent.amount / 100).toString(), // Convert from cents
            currency: paymentIntent.currency,
            clientSecret: paymentIntent.client_secret,
            description: paymentIntent.description || '',
            createdAt: new Date(paymentIntent.created * 1000).toISOString(),
            metadata: JSON.stringify(paymentIntent.metadata),
          };
        } catch (error) {
          console.error('Error confirming payment intent:', error);
          throw new Error('Failed to confirm payment intent');
        }
      },
    });

    t.field('cancelPaymentIntent', {
      type: 'PaymentIntent',
      args: {
        paymentIntentId: nonNull(stringArg()),
      },
      resolve: async (_, { paymentIntentId }, ctx) => {
        if (!ctx.user) {
          throw new Error('Authentication required');
        }

        try {
          const paymentIntent = await StripeService.cancelPaymentIntent(paymentIntentId);
          
          return {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: (paymentIntent.amount / 100).toString(), // Convert from cents
            currency: paymentIntent.currency,
            clientSecret: paymentIntent.client_secret,
            description: paymentIntent.description || '',
            createdAt: new Date(paymentIntent.created * 1000).toISOString(),
            metadata: JSON.stringify(paymentIntent.metadata),
          };
        } catch (error) {
          console.error('Error cancelling payment intent:', error);
          throw new Error('Failed to cancel payment intent');
        }
      },
    });

    t.field('createRefund', {
      type: 'Refund',
      args: {
        input: nonNull(arg({ type: 'CreateRefundInput' })),
      },
      resolve: async (_, { input }, ctx) => {
        if (!ctx.user) {
          throw new Error('Authentication required');
        }

        try {
          const refund = await StripeService.createRefund(
            input.paymentIntentId,
            input.amount,
            input.reason || undefined
          );
          
          return {
            id: refund.id,
            status: refund.status,
            amount: (refund.amount / 100).toString(), // Convert from cents
            currency: refund.currency,
            reason: refund.reason || '',
            createdAt: new Date(refund.created * 1000).toISOString(),
          };
        } catch (error) {
          console.error('Error creating refund:', error);
          throw new Error('Failed to create refund');
        }
      },
    });
  },
});
