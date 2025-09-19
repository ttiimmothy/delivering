import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../database/drizzle/client';
import { deliveries, courierProfiles, users, orders } from '../database/drizzle/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

// Enums
export const DeliveryStatus = enumType({
  name: 'DeliveryStatus',
  members: ['assigned', 'accepted', 'picked_up', 'delivered'],
});

// Types
export const Delivery = objectType({
  name: 'Delivery',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderId');
    t.nonNull.string('courierId');
    t.nonNull.field('status', { type: 'DeliveryStatus' });
    t.nonNull.dateTime('assignedAt');
    t.nonNull.dateTime('acceptedAt');
    t.nonNull.dateTime('pickedUpAt');
    t.nonNull.dateTime('deliveredAt');
    t.field('currentLocation', { 
      type: 'Location',
      resolve: (parent: any) => {
        if (!parent.currentLocation) return null;
        try {
          return typeof parent.currentLocation === 'string' 
            ? JSON.parse(parent.currentLocation)
            : parent.currentLocation;
        } catch {
          return null;
        }
      }
    });
    t.string('estimatedArrival', {
      resolve: (parent: any) => parent.estimatedArrival ? (parent.estimatedArrival instanceof Date ? parent.estimatedArrival.toISOString() : parent.estimatedArrival) : null
    });
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
    t.field('courier', {
      type: 'User',
      resolve: async (parent) => {
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
          phone: user.phone || undefined,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
        } as any;
      },
    });
  },
});

// Input Types
export const UpdateDeliveryStatusInput = inputObjectType({
  name: 'UpdateDeliveryStatusInput',
  definition(t) {
    t.nonNull.string('deliveryId');
    t.nonNull.field('status', { type: 'DeliveryStatus' });
    t.field('currentLocation', { type: 'LocationInput' });
    t.string('estimatedArrival');
  },
});