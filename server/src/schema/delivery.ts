import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../db/client';
import { deliveries, courierProfiles, users, orders } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

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
    t.field('currentLocation', { 
      type: 'Location',
      resolve: (parent) => {
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
      resolve: (parent) => parent.estimatedArrival ? (parent.estimatedArrival instanceof Date ? parent.estimatedArrival.toISOString() : parent.estimatedArrival) : null
    });
    t.nonNull.string('createdAt', {
      resolve: (parent) => parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt
    });
    t.nonNull.string('updatedAt', {
      resolve: (parent) => parent.updatedAt instanceof Date ? parent.updatedAt.toISOString() : parent.updatedAt
    });
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
    t.field('courier', {
      type: 'User',
      resolve: async (parent) => {
        const result = await db.select()
          .from(users)
          .where(eq(users.id, parent.courierId))
          .limit(1);
        return result[0] || null;
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