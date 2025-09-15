import { objectType, inputObjectType, enumType, queryField, mutationField, nonNull, intArg, stringArg, arg } from 'nexus';
import { db } from '../db/client';
import { orders, orderItems, orderEvents, users, restaurants, menuItems, carts, cartItems } from '../db/schema';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';

// Enums
export const OrderStatus = enumType({
  name: 'OrderStatus',
  members: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
});

export const PaymentStatus = enumType({
  name: 'PaymentStatus',
  members: ['pending', 'paid', 'failed', 'refunded'],
});

// Types
export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderNumber');
    t.nonNull.string('customerId');
    t.nonNull.string('restaurantId');
    t.string('courierId');
    t.nonNull.field('status', { type: 'OrderStatus' });
    t.nonNull.field('paymentStatus', { type: 'PaymentStatus' });
    t.nonNull.string('subtotal');
    t.nonNull.string('tax');
    t.nonNull.string('deliveryFee');
    t.nonNull.string('tip');
    t.nonNull.string('total');
    t.nonNull.string('deliveryAddress');
    t.string('specialInstructions');
    t.string('estimatedDeliveryTime');
    t.string('stripePaymentIntentId');
    t.string('stripeSessionId');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.field('customer', {
      type: 'User',
      resolve: async (parent) => {
        const result = await db.select()
          .from(users)
          .where(eq(users.id, parent.customerId))
          .limit(1);
        return result[0] || null;
      },
    });
    t.field('restaurant', {
      type: 'Restaurant',
      resolve: async (parent) => {
        const result = await db.select()
          .from(restaurants)
          .where(eq(restaurants.id, parent.restaurantId))
          .limit(1);
        return result[0] || null;
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
        return result[0] || null;
      },
    });
    t.list.field('items', {
      type: 'OrderItem',
      resolve: async (parent) => {
        return await db.select()
          .from(orderItems)
          .where(eq(orderItems.orderId, parent.id))
          .orderBy(asc(orderItems.createdAt));
      },
    });
    t.list.field('events', {
      type: 'OrderEvent',
      resolve: async (parent) => {
        return await db.select()
          .from(orderEvents)
          .where(eq(orderEvents.orderId, parent.id))
          .orderBy(asc(orderEvents.createdAt));
      },
    });
  },
});

export const OrderItem = objectType({
  name: 'OrderItem',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderId');
    t.nonNull.string('menuItemId');
    t.nonNull.int('quantity');
    t.nonNull.string('unitPrice');
    t.nonNull.string('totalPrice');
    t.nonNull.string('selectedOptions');
    t.string('specialInstructions');
    t.nonNull.string('createdAt');
    t.field('menuItem', {
      type: 'MenuItem',
      resolve: async (parent) => {
        const result = await db.select()
          .from(menuItems)
          .where(eq(menuItems.id, parent.menuItemId))
          .limit(1);
        return result[0] || null;
      },
    });
  },
});

export const OrderEvent = objectType({
  name: 'OrderEvent',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderId');
    t.nonNull.field('status', { type: 'OrderStatus' });
    t.string('message');
    t.string('metadata');
    t.nonNull.string('createdAt');
  },
});

// Input Types
export const CreateOrderInput = inputObjectType({
  name: 'CreateOrderInput',
  definition(t) {
    t.nonNull.string('restaurantId');
    t.nonNull.string('deliveryAddress');
    t.string('specialInstructions');
    t.string('tip');
    t.string('stripePaymentIntentId');
  },
});

export const UpdateOrderStatusInput = inputObjectType({
  name: 'UpdateOrderStatusInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.field('status', { type: 'OrderStatus' });
    t.string('message');
    t.string('metadata');
  },
});

export const AssignCourierInput = inputObjectType({
  name: 'AssignCourierInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('courierId');
  },
});

// Queries
export const OrderQueries = queryField('order', {
  type: 'Query',
  definition(t) {
    t.field('order', {
      type: 'Order',
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
          .from(orders)
          .where(eq(orders.id, args.id))
          .limit(1);

        if (result.length === 0) {
          const error = new Error('Order not found');
          error.name = 'NotFoundError';
          throw error;
        }

        const order = result[0];

        // Check if user has access to this order
        if (ctx.user.role === 'customer' && order.customerId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        if (ctx.user.role === 'courier' && order.courierId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        if (ctx.user.role === 'merchant') {
          // Check if user owns the restaurant
          const restaurant = await db.select()
            .from(restaurants)
            .where(eq(restaurants.id, order.restaurantId))
            .limit(1);
          
          if (restaurant.length === 0 || restaurant[0].ownerId !== ctx.user.userId) {
            const error = new Error('Access denied');
            error.name = 'AuthorizationError';
            throw error;
          }
        }

        return order;
      },
    });

    t.list.field('orders', {
      type: 'Order',
      args: {
        status: arg({ type: 'OrderStatus' }),
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

        if (ctx.user.role === 'customer') {
          conditions.push(eq(orders.customerId, ctx.user.userId));
        } else if (ctx.user.role === 'courier') {
          conditions.push(eq(orders.courierId, ctx.user.userId));
        } else if (ctx.user.role === 'merchant') {
          // Get restaurants owned by this merchant
          const userRestaurants = await db.select({ id: restaurants.id })
            .from(restaurants)
            .where(eq(restaurants.ownerId, ctx.user.userId));
          
          const restaurantIds = userRestaurants.map(r => r.id);
          if (restaurantIds.length === 0) return [];
          
          conditions.push(inArray(orders.restaurantId, restaurantIds));
        }

        if (args.status) {
          conditions.push(eq(orders.status, args.status));
        }

        let query = db.select()
          .from(orders)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(orders.createdAt));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });

    t.list.field('availableOrders', {
      type: 'Order',
      args: {
        limit: intArg(),
        offset: intArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'courier') {
          const error = new Error('Access denied. Courier role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        const conditions = [
          eq(orders.status, 'ready'),
          eq(orders.courierId, null)
        ];

        let query = db.select()
          .from(orders)
          .where(and(...conditions))
          .orderBy(asc(orders.createdAt));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });
  },
});

// Mutations
export const OrderMutations = mutationField('order', {
  type: 'Mutation',
  definition(t) {
    t.field('createOrder', {
      type: 'Order',
      args: {
        input: nonNull(arg({ type: 'CreateOrderInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'customer') {
          const error = new Error('Access denied. Customer role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        // Get user's cart for this restaurant
        const cart = await db.select()
          .from(carts)
          .where(and(
            eq(carts.userId, ctx.user.userId),
            eq(carts.restaurantId, args.input.restaurantId)
          ))
          .limit(1);

        if (cart.length === 0) {
          const error = new Error('Cart is empty');
          error.name = 'ValidationError';
          throw error;
        }

        // Get cart items
        const cartItemsData = await db.select()
          .from(cartItems)
          .innerJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
          .where(eq(cartItems.cartId, cart[0].id));

        if (cartItemsData.length === 0) {
          const error = new Error('Cart is empty');
          error.name = 'ValidationError';
          throw error;
        }

        // Calculate totals
        const subtotal = cartItemsData.reduce((sum, item) => {
          const itemPrice = parseFloat(item.menu_items.price);
          const quantity = item.cart_items.quantity;
          return sum + (itemPrice * quantity);
        }, 0);

        const tax = subtotal * 0.08; // 8% tax
        const deliveryFee = 2.99;
        const tip = parseFloat(args.input.tip || '0');
        const total = subtotal + tax + deliveryFee + tip;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const order = await db.insert(orders).values({
          orderNumber,
          customerId: ctx.user.userId,
          restaurantId: args.input.restaurantId,
          status: 'pending',
          paymentStatus: 'pending',
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          deliveryFee: deliveryFee.toFixed(2),
          tip: tip.toFixed(2),
          total: total.toFixed(2),
          deliveryAddress: args.input.deliveryAddress,
          specialInstructions: args.input.specialInstructions,
          stripePaymentIntentId: args.input.stripePaymentIntentId,
        }).returning();

        // Create order items
        const orderItemsData = cartItemsData.map(item => ({
          orderId: order[0].id,
          menuItemId: item.cart_items.menuItemId,
          quantity: item.cart_items.quantity,
          unitPrice: item.menu_items.price,
          totalPrice: (parseFloat(item.menu_items.price) * item.cart_items.quantity).toFixed(2),
          selectedOptions: item.cart_items.selectedOptions,
          specialInstructions: item.cart_items.specialInstructions,
        }));

        await db.insert(orderItems).values(orderItemsData);

        // Create order event
        await db.insert(orderEvents).values({
          orderId: order[0].id,
          status: 'pending',
          message: 'Order created',
        });

        // Clear cart
        await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id));
        await db.delete(carts).where(eq(carts.id, cart[0].id));

        return order[0];
      },
    });

    t.field('updateOrderStatus', {
      type: 'Order',
      args: {
        input: nonNull(arg({ type: 'UpdateOrderStatusInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        // Check if user has permission to update this order
        const order = await db.select()
          .from(orders)
          .where(eq(orders.id, args.input.orderId))
          .limit(1);

        if (order.length === 0) {
          const error = new Error('Order not found');
          error.name = 'NotFoundError';
          throw error;
        }

        const orderData = order[0];

        if (ctx.user.role === 'merchant') {
          // Check if user owns the restaurant
          const restaurant = await db.select()
            .from(restaurants)
            .where(eq(restaurants.id, orderData.restaurantId))
            .limit(1);
          
          if (restaurant.length === 0 || restaurant[0].ownerId !== ctx.user.userId) {
            const error = new Error('Access denied');
            error.name = 'AuthorizationError';
            throw error;
          }
        } else if (ctx.user.role === 'courier') {
          if (orderData.courierId !== ctx.user.userId) {
            const error = new Error('Access denied');
            error.name = 'AuthorizationError';
            throw error;
          }
        } else {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        // Update order status
        const updatedOrder = await db.update(orders)
          .set({
            status: args.input.status,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, args.input.orderId))
          .returning();

        // Create order event
        await db.insert(orderEvents).values({
          orderId: args.input.orderId,
          status: args.input.status,
          message: args.input.message || `Order status updated to ${args.input.status}`,
          metadata: args.input.metadata,
        });

        return updatedOrder[0];
      },
    });

    t.field('assignCourier', {
      type: 'Order',
      args: {
        input: nonNull(arg({ type: 'AssignCourierInput' })),
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

        const updatedOrder = await db.update(orders)
          .set({
            courierId: args.input.courierId,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, args.input.orderId))
          .returning();

        if (updatedOrder.length === 0) {
          const error = new Error('Order not found');
          error.name = 'NotFoundError';
          throw error;
        }

        // Create order event
        await db.insert(orderEvents).values({
          orderId: args.input.orderId,
          status: 'confirmed',
          message: `Courier assigned: ${args.input.courierId}`,
        });

        return updatedOrder[0];
      },
    });

    t.field('cancelOrder', {
      type: 'Order',
      args: {
        orderId: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        const order = await db.select()
          .from(orders)
          .where(eq(orders.id, args.orderId))
          .limit(1);

        if (order.length === 0) {
          const error = new Error('Order not found');
          error.name = 'NotFoundError';
          throw error;
        }

        const orderData = order[0];

        // Check if user can cancel this order
        if (ctx.user.role === 'customer' && orderData.customerId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        if (ctx.user.role === 'merchant') {
          const restaurant = await db.select()
            .from(restaurants)
            .where(eq(restaurants.id, orderData.restaurantId))
            .limit(1);
          
          if (restaurant.length === 0 || restaurant[0].ownerId !== ctx.user.userId) {
            const error = new Error('Access denied');
            error.name = 'AuthorizationError';
            throw error;
          }
        }

        // Only allow cancellation if order is pending or confirmed
        if (!['pending', 'confirmed'].includes(orderData.status)) {
          const error = new Error('Order cannot be cancelled at this stage');
          error.name = 'ValidationError';
          throw error;
        }

        const updatedOrder = await db.update(orders)
          .set({
            status: 'cancelled',
            updatedAt: new Date(),
          })
          .where(eq(orders.id, args.orderId))
          .returning();

        // Create order event
        await db.insert(orderEvents).values({
          orderId: args.orderId,
          status: 'cancelled',
          message: 'Order cancelled',
        });

        return updatedOrder[0];
      },
    });
  },
});
