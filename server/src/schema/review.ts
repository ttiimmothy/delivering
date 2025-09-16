import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, arg } from 'nexus';
import { db } from '../db/client';
import { reviews, users, restaurants, orders } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

// Enums
export const ReviewType = enumType({
  name: 'ReviewType',
  members: ['restaurant', 'courier'],
});

// Types
export const Review = objectType({
  name: 'Review',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('customerId');
    t.nonNull.string('orderId');
    t.nonNull.field('type', { type: 'ReviewType' });
    t.nonNull.int('rating');
    t.string('comment');
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
        if (parent.type !== 'restaurant') return null;
        const order = await db.select()
          .from(orders)
          .where(eq(orders.id, parent.orderId))
          .limit(1);
        if (!order[0]) return null;
        
        const result = await db.select()
          .from(restaurants)
          .where(eq(restaurants.id, order[0].restaurantId))
          .limit(1);
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
      },
    });
    t.field('courier', {
      type: 'User',
      resolve: async (parent) => {
        if (parent.type !== 'courier') return null;
        const order = await db.select()
          .from(orders)
          .where(eq(orders.id, parent.orderId))
          .limit(1);
        if (!order[0] || !order[0].courierId) return null;
        
        const result = await db.select()
          .from(users)
          .where(eq(users.id, order[0].courierId))
          .limit(1);
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
      },
    });
  },
});

// Input Types
export const CreateReviewInput = inputObjectType({
  name: 'CreateReviewInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.field('type', { type: 'ReviewType' });
    t.nonNull.int('rating');
    t.string('comment');
  },
});

export const UpdateReviewInput = inputObjectType({
  name: 'UpdateReviewInput',
  definition(t) {
    t.nonNull.string('reviewId');
    t.int('rating');
    t.string('comment');
  },
});