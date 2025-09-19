import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, arg } from 'nexus';
import { db } from '../database/drizzle/client';
import { orders, orderItems, orderEvents, users, restaurants, menuItems, carts, cartItems } from '../database/drizzle/schema';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

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
        const result = await db.select()
          .from(restaurants)
          .where(eq(restaurants.id, parent.restaurantId))
          .limit(1);
        if (!result[0]) return null;
        const user = result[0];
        return {
          ...user,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
        };
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
    t.list.field('items', {
      type: 'OrderItem',
      resolve: async (parent) => {
        const items = await db.select()
          .from(orderItems)
          .where(eq(orderItems.orderId, parent.id))
          .orderBy(asc(orderItems.createdAt));
        return items.map(item => ({
          id: item.id,
          orderId: item.orderId,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          selectedOptions: String(item.selectedOptions || '[]'),
          specialInstructions: item.specialInstructions || null,
          createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
          updatedAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt), // Use createdAt as updatedAt since updatedAt doesn't exist
        }));
      },
    });
    t.list.field('events', {
      type: 'OrderEvent',
      resolve: async (parent) => {
        const events = await db.select()
          .from(orderEvents)
          .where(eq(orderEvents.orderId, parent.id))
          .orderBy(asc(orderEvents.createdAt));
        return events.map(event => ({
          id: event.id,
          orderId: event.orderId,
          eventType: event.status, // Map status to eventType
          description: event.message || null,
          metadata: event.metadata,
          createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : String(event.createdAt),
        }));
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
    t.nonNull.string('updatedAt');
    t.field('menuItem', {
      type: 'MenuItem',
      resolve: async (parent) => {
        const result = await db.select()
          .from(menuItems)
          .where(eq(menuItems.id, parent.menuItemId))
          .limit(1);
        if (!result[0]) return null;
        const user = result[0];
        return {
          ...user,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
        };
      },
    });
  },
});

export const OrderEvent = objectType({
  name: 'OrderEvent',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderId');
    t.nonNull.string('eventType');
    t.string('description');
    t.field('metadata', { 
      type: 'Location',
      resolve: (parent: any) => {
        if (!parent.metadata) return null;
        try {
          return typeof parent.metadata === 'string' 
            ? JSON.parse(parent.metadata)
            : parent.metadata;
        } catch {
          return null;
        }
      }
    });
    t.nonNull.string('createdAt');
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
  },
});

// Input Types
export const CreateOrderInput = inputObjectType({
  name: 'CreateOrderInput',
  definition(t) {
    t.nonNull.string('restaurantId');
    t.nonNull.string('deliveryAddress');
    t.string('specialInstructions');
    t.string('stripePaymentIntentId');
  },
});

export const UpdateOrderStatusInput = inputObjectType({
  name: 'UpdateOrderStatusInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.field('status', { type: 'OrderStatus' });
  },
});

export const AssignCourierInput = inputObjectType({
  name: 'AssignCourierInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('courierId');
  },
});

export const UpdateCourierLocationInput = inputObjectType({
  name: 'UpdateCourierLocationInput',
  definition(t) {
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
  },
});