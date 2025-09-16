import Stripe from 'stripe';
import { db } from '../db/client';
import { orders, orderEvents } from '../db/schema';
import { eq } from 'drizzle-orm';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

export interface CreateCheckoutSessionParams {
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface CreateBillingPortalSessionParams {
  customerId: string;
  returnUrl: string;
}

export class StripeService {
  /**
   * Create a Stripe Checkout session for an order
   */
  static async createCheckoutSession({
    orderId,
    successUrl,
    cancelUrl,
    customerEmail,
  }: CreateCheckoutSessionParams) {
    try {
      // Get order details from database
      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (orderResult.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult[0];

      // Create or get customer
      let customerId: string | undefined;
      if (customerEmail) {
        const customers = await stripe.customers.list({
          email: customerEmail,
          limit: 1,
        });
        
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await stripe.customers.create({
            email: customerEmail,
            metadata: {
              orderId,
            },
          });
          customerId = customer.id;
        }
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Order #${order.orderNumber}`,
                description: `Food delivery order from ${order.restaurantId}`,
              },
              unit_amount: Math.round(parseFloat(order.total) * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId,
        },
        customer_email: customerEmail,
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Create a Stripe Billing Portal session
   */
  static async createBillingPortalSession({
    customerId,
    returnUrl,
  }: CreateBillingPortalSessionParams) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session;
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  static async handlePaymentSuccess(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session.metadata?.orderId) {
        throw new Error('No order ID in session metadata');
      }

      const orderId = session.metadata.orderId;

      // Update order status to confirmed
      await db
        .update(orders)
        .set({
          paymentStatus: 'paid',
          status: 'confirmed',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));

      // Add order event
      await db.insert(orderEvents).values({
        orderId,
        status: 'confirmed',
        message: 'Payment successful, order confirmed',
        metadata: {
          stripeSessionId: sessionId,
          paymentIntentId: session.payment_intent,
        },
        createdAt: new Date(),
      });

      return { success: true, orderId };
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  /**
   * Handle payment failure
   */
  static async handlePaymentFailure(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session.metadata?.orderId) {
        throw new Error('No order ID in session metadata');
      }

      const orderId = session.metadata.orderId;

      // Update order status to cancelled
      await db
        .update(orders)
        .set({
          paymentStatus: 'failed',
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));

      // Add order event
      await db.insert(orderEvents).values({
        orderId,
        status: 'cancelled',
        message: 'Payment failed, order cancelled',
        metadata: {
          stripeSessionId: sessionId,
        },
        createdAt: new Date(),
      });

      return { success: true, orderId };
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  /**
   * Create a payment intent for direct payment
   */
  static async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Retrieve a payment intent
   */
  static async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm a payment intent
   */
  static async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw error;
    }
  }

  /**
   * Cancel a payment intent
   */
  static async cancelPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error cancelling payment intent:', error);
      throw error;
    }
  }

  /**
   * Create a refund
   */
  static async createRefund(paymentIntentId: string, amount?: number, reason?: string) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
        reason: reason as any,
      });

      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw error;
    }
  }
}
