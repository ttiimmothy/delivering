import { objectType, inputObjectType, enumType, queryField, mutationField, nonNull, intArg, stringArg, arg, list } from 'nexus';
import { db } from '../database/drizzle/client';
import { invoices, orders, users, restaurants } from '../database/drizzle/schema';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

// Enums
export const InvoiceStatus = enumType({
  name: 'InvoiceStatus',
  members: ['pending', 'paid', 'failed'],
});

export const PayoutStatus = enumType({
  name: 'PayoutStatus',
  members: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
});

// Types
export const Invoice = objectType({
  name: 'Invoice',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderId');
    t.nonNull.string('restaurantId');
    t.string('courierId');
    t.nonNull.string('restaurantAmount');
    t.nonNull.string('courierAmount');
    t.nonNull.string('platformFee');
    t.nonNull.field('status', { type: InvoiceStatus });
    t.string('stripeTransferId');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.field('order', {
      type: 'Order',
      resolve: async (parent) => {
        const result = await db.select()
          .from(orders)
          .where(eq(orders.id, parent.orderId))
          .limit(1);
        if (!result[0]) return null;
        const order = result[0];
        return {
          id: order.id,
          orderNumber: order.orderNumber,
          customerId: order.customerId,
          restaurantId: order.restaurantId,
          courierId: order.courierId || null,
          status: order.status,
          paymentStatus: order.paymentStatus,
          subtotal: String(order.subtotal),
          tax: String(order.tax),
          deliveryFee: String(order.deliveryFee),
          tip: String(order.tip),
          total: String(order.total),
          deliveryAddress: String(order.deliveryAddress),
          specialInstructions: order.specialInstructions || null,
          estimatedDeliveryTime: order.estimatedDeliveryTime ? (order.estimatedDeliveryTime instanceof Date ? order.estimatedDeliveryTime.toISOString() : String(order.estimatedDeliveryTime)) : null,
          stripePaymentIntentId: order.stripePaymentIntentId || null,
          stripeSessionId: order.stripeSessionId || null,
          createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : String(order.createdAt),
          updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : String(order.updatedAt),
        };
      },
    });
    t.field('restaurant', {
      type: 'Restaurant',
      resolve: async (parent) => {
        const result = await db.select()
          .from(restaurants)
          .where(eq(restaurants.id, parent.restaurantId))
          .limit(1);
        return result[0] ? {
        ...result[0],
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      } : null;
      },
    });
    t.field('courier', {
      type: 'User',
      resolve: async (parent) => {
        if (!parent.courierId) return null;
        const result = await db.select()
          .from(users)
          .where(eq(users.id, parent.courierId))
          .limit(1);
        if (!result[0]) return null;
        const user = result[0];
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          role: user.role === 'merchant' ? 'restaurant' : user.role as "customer" | "courier" | "admin" | "restaurant",
          isActive: user.isActive,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
        };
      },
    });
  },
});

export const Payout = objectType({
  name: 'Payout',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('recipientId'); // Could be restaurant or courier ID
    t.nonNull.string('recipientType'); // 'restaurant' or 'courier'
    t.nonNull.string('amount');
    t.nonNull.field('status', { type: PayoutStatus });
    t.string('stripeTransferId');
    t.string('stripePayoutId');
    t.string('failureReason');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.string('processedAt');
    
    // Relations
    t.field('recipient', {
      type: 'User',
      resolve: async (parent) => {
        const result = await db.select()
          .from(users)
          .where(eq(users.id, parent.recipientId))
          .limit(1);
        if (!result[0]) return null;
        const user = result[0];
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          role: user.role === 'merchant' ? 'restaurant' : user.role as "customer" | "courier" | "admin" | "restaurant",
          isActive: user.isActive,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
        };
      },
    });
    
    t.field('restaurant', {
      type: 'Restaurant',
      resolve: async (parent) => {
        if (parent.recipientType !== 'restaurant') return null;
        const result = await db.select()
          .from(restaurants)
          .where(eq(restaurants.id, parent.recipientId))
          .limit(1);
        return result[0] ? {
        ...result[0],
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      } : null;
      },
    });
  },
});

// Input Types
export const CreateInvoiceInput = inputObjectType({
  name: 'CreateInvoiceInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('restaurantId');
    t.string('courierId');
    t.nonNull.string('restaurantAmount');
    t.nonNull.string('courierAmount');
    t.nonNull.string('platformFee');
  },
});

export const UpdateInvoiceStatusInput = inputObjectType({
  name: 'UpdateInvoiceStatusInput',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.field('status', { type: InvoiceStatus });
    t.string('stripeTransferId');
  },
});

export const ProcessPayoutInput = inputObjectType({
  name: 'ProcessPayoutInput',
  definition(t) {
    t.nonNull.string('invoiceId');
    t.nonNull.string('stripeTransferId');
  },
});

// Queries
export const invoicesQuery = queryField('invoices', {
  type: list(Invoice),
  args: {
    restaurantId: stringArg(),
    courierId: stringArg(),
    status: arg({ type: 'InvoiceStatus' }),
    limit: intArg(),
    offset: intArg(),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    let conditions = [];

    // Filter by user role
    if (ctx.user.role === 'merchant') {
      // Get restaurants owned by this merchant
      const userRestaurants = await db.select({ id: restaurants.id })
        .from(restaurants)
        .where(eq(restaurants.ownerId, ctx.user.userId));
      
      const restaurantIds = userRestaurants.map(r => r.id);
      if (restaurantIds.length === 0) return [];
      
      conditions.push(inArray(invoices.restaurantId, restaurantIds));
    } else if (ctx.user.role === 'courier') {
      conditions.push(eq(invoices.courierId, ctx.user.userId));
    } else if (ctx.user.role !== 'admin') {
      const error = new Error('Access denied');
      error.name = 'AuthorizationError';
      throw error;
    }

    if (args.restaurantId) {
      conditions.push(eq(invoices.restaurantId, args.restaurantId));
    }

    if (args.courierId) {
      conditions.push(eq(invoices.courierId, args.courierId));
    }

    if (args.status) {
      conditions.push(eq(invoices.status, args.status));
    }

    let query = db.select()
      .from(invoices)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(invoices.createdAt))
      .limit(args.limit || 100)
      .offset(args.offset || 0);

    const results = await query;
    return results.map(invoice => ({
      ...invoice,
      status: invoice.status as "pending" | "paid" | "failed",
      createdAt: invoice.createdAt instanceof Date ? invoice.createdAt.toISOString() : String(invoice.createdAt),
      updatedAt: invoice.updatedAt instanceof Date ? invoice.updatedAt.toISOString() : String(invoice.updatedAt),
    }));
  },
});

export const invoice = queryField('invoice', {
  type: Invoice,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    const result = await db.select()
      .from(invoices)
      .where(eq(invoices.id, args.id))
      .limit(1);

    if (result.length === 0) {
      const error = new Error('Invoice not found');
      error.name = 'NotFoundError';
      throw error;
    }

    const invoice = result[0];

    // Check if user has access to this invoice
    if (ctx.user.role === 'merchant') {
      const restaurant = await db.select()
        .from(restaurants)
        .where(eq(restaurants.id, invoice.restaurantId))
        .limit(1);
      
      if (restaurant.length === 0 || restaurant[0].ownerId !== ctx.user.userId) {
        const error = new Error('Access denied');
        error.name = 'AuthorizationError';
        throw error;
      }
    } else if (ctx.user.role === 'courier') {
      if (invoice.courierId !== ctx.user.userId) {
        const error = new Error('Access denied');
        error.name = 'AuthorizationError';
        throw error;
      }
    } else if (ctx.user.role !== 'admin') {
      const error = new Error('Access denied');
      error.name = 'AuthorizationError';
      throw error;
    }

    return {
      ...invoice,
      status: invoice.status as "pending" | "paid" | "failed",
      createdAt: invoice.createdAt instanceof Date ? invoice.createdAt.toISOString() : String(invoice.createdAt),
      updatedAt: invoice.updatedAt instanceof Date ? invoice.updatedAt.toISOString() : String(invoice.updatedAt),
    };
  },
});

export const payoutSummary = queryField('payoutSummary', {
  type: 'String',
  args: {
    userId: nonNull(stringArg()),
    role: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'admin' && ctx.user.userId !== args.userId) {
      const error = new Error('Access denied');
      error.name = 'AuthorizationError';
      throw error;
    }

    let conditions = [];

    if (args.role === 'merchant') {
      // Get restaurants owned by this user
      const userRestaurants = await db.select({ id: restaurants.id })
        .from(restaurants)
        .where(eq(restaurants.ownerId, args.userId));
      
      const restaurantIds = userRestaurants.map(r => r.id);
      if (restaurantIds.length === 0) return '0.00';
      
      conditions.push(inArray(invoices.restaurantId, restaurantIds));
    } else if (args.role === 'courier') {
      conditions.push(eq(invoices.courierId, args.userId));
    }

    const result = await db.select({
      totalAmount: invoices.restaurantAmount,
      courierAmount: invoices.courierAmount,
    })
      .from(invoices)
      .where(and(
        ...conditions,
        eq(invoices.status, 'paid')
      ));

    if (result.length === 0) {
      return '0.00';
    }

    const total = result.reduce((sum, invoice) => {
      const amount = args.role === 'merchant' 
        ? parseFloat(invoice.totalAmount) 
        : parseFloat(invoice.courierAmount);
      return sum + amount;
    }, 0);

    return total.toFixed(2);
  },
});

// Mutations
export const createInvoice = mutationField('createInvoice', {
  type: Invoice,
  args: {
    input: nonNull(arg({ type: 'CreateInvoiceInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'admin') {
      const error = new Error('Access denied. Admin role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Check if order exists
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, args.input.orderId))
      .limit(1);

    if (order.length === 0) {
      const error = new Error('Order not found');
      error.name = 'NotFoundError';
      throw error;
    }

    // Check if invoice already exists for this order
    const existingInvoice = await db.select()
      .from(invoices)
      .where(eq(invoices.orderId, args.input.orderId))
      .limit(1);

    if (existingInvoice.length > 0) {
      const error = new Error('Invoice already exists for this order');
      error.name = 'ConflictError';
      throw error;
    }

    const result = await db.insert(invoices).values({
      orderId: args.input.orderId,
      restaurantId: args.input.restaurantId,
      courierId: args.input.courierId,
      restaurantAmount: args.input.restaurantAmount,
      courierAmount: args.input.courierAmount,
      platformFee: args.input.platformFee,
      status: 'pending',
    }).returning();

    return {
      ...result[0],
      status: result[0].status as "pending" | "paid" | "failed",
      createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
      updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
    };
  },
});

export const updateInvoiceStatus = mutationField('updateInvoiceStatus', {
  type: Invoice,
  args: {
    input: nonNull(arg({ type: 'UpdateInvoiceStatusInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'admin') {
      const error = new Error('Access denied. Admin role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    const updateData: any = {
      status: args.input.status,
      updatedAt: new Date(),
    };

    if (args.input.stripeTransferId) {
      updateData.stripeTransferId = args.input.stripeTransferId;
    }

    const result = await db.update(invoices)
      .set(updateData)
      .where(eq(invoices.id, args.input.id))
      .returning();

    if (result.length === 0) {
      const error = new Error('Invoice not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return {
      ...result[0],
      status: result[0].status as "pending" | "paid" | "failed",
      createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
      updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
    };
  },
});

export const processPayout = mutationField('processPayout', {
  type: Invoice,
  args: {
    input: nonNull(arg({ type: 'ProcessPayoutInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'admin') {
      const error = new Error('Access denied. Admin role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Check if invoice exists and is pending
    const invoice = await db.select()
      .from(invoices)
      .where(eq(invoices.id, args.input.invoiceId))
      .limit(1);

    if (invoice.length === 0) {
      const error = new Error('Invoice not found');
      error.name = 'NotFoundError';
      throw error;
    }

    if (invoice[0].status !== 'pending') {
      const error = new Error('Invoice is not pending');
      error.name = 'ValidationError';
      throw error;
    }

    // Update invoice status to paid
    const result = await db.update(invoices)
      .set({
        status: 'paid',
        stripeTransferId: args.input.stripeTransferId,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, args.input.invoiceId))
      .returning();

    return {
      ...result[0],
      status: result[0].status as "pending" | "paid" | "failed",
      createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
      updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
    };
  },
});

export const markPayoutFailed = mutationField('markPayoutFailed', {
  type: Invoice,
  args: {
    invoiceId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'admin') {
      const error = new Error('Access denied. Admin role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    const result = await db.update(invoices)
      .set({
        status: 'failed',
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, args.invoiceId))
      .returning();

    if (result.length === 0) {
      const error = new Error('Invoice not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return {
      ...result[0],
      status: result[0].status as "pending" | "paid" | "failed",
      createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
      updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
    };
  },
});
