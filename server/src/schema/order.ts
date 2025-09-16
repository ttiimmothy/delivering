import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, arg } from 'nexus';
import { db } from '../db/client';
import { orders, orderItems, orderEvents, users, restaurants, menuItems, carts, cartItems } from '../db/schema';
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
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
      },
    });
    t.field('restaurant', {
      type: 'Restaurant',
      resolve: async (parent) => {
        const result = await db.select()
          .from(restaurants)
          .where(eq(restaurants.id, parent.restaurantId))
          .limit(1);
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
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
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
      },
    });
    t.list.field('items', {
      type: 'OrderItem',
      resolve: async (parent) => {
        const items = await db.select()
          .from(orderItems)
          .where(eq(orderItems.orderId, parent.id))
          .orderBy(asc(orderItems.createdAt));
        return items.map(item => convertDateFields(item, ['createdAt', 'updatedAt']));
      },
    });
    t.list.field('events', {
      type: 'OrderEvent',
      resolve: async (parent) => {
        const events = await db.select()
          .from(orderEvents)
          .where(eq(orderEvents.orderId, parent.id))
          .orderBy(asc(orderEvents.createdAt));
        return events.map(event => convertDateFields(event, ['createdAt', 'updatedAt']));
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
    t.nonNull.string('price');
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
    t.nonNull.string('eventType');
    t.string('description');
    t.nonNull.string('createdAt');
    t.field('order', {
      type: 'Order',
      resolve: async (parent) => {
        const result = await db.select()
          .from(orders)
          .where(eq(orders.id, parent.orderId))
          .limit(1);
        return result[0] || null;
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