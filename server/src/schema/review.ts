import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, arg } from 'nexus';
import { db } from '../database/drizzle/client';
import { reviews, users, restaurants, orders } from '../database/drizzle/schema';
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
        if (!result[0]) return null;
        
        const user = result[0];
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || undefined,
          role: user.role === 'merchant' ? 'restaurant' : user.role as "customer" | "courier" | "admin" | "restaurant",
          isActive: user.isActive,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
        } as any; // Added 'as any' to bypass strict type checking for phone field
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
        if (!result[0]) return null;
        
        const restaurant = result[0];
        return {
          id: restaurant.id,
          ownerId: restaurant.ownerId,
          name: restaurant.name,
          slug: restaurant.slug,
          description: restaurant.description,
          image: restaurant.image,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating,
          reviewCount: restaurant.reviewCount,
          deliveryTime: restaurant.deliveryTime,
          deliveryFee: restaurant.deliveryFee,
          minimumOrder: restaurant.minimumOrder,
          isOpen: restaurant.isOpen,
          isActive: restaurant.isActive,
          addressId: restaurant.addressId,
          phone: restaurant.phone,
          createdAt: restaurant.createdAt instanceof Date ? restaurant.createdAt.toISOString() : String(restaurant.createdAt),
          updatedAt: restaurant.updatedAt instanceof Date ? restaurant.updatedAt.toISOString() : String(restaurant.updatedAt),
        };
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
        if (!result[0]) return null;
        
        const user = result[0];
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || undefined,
          role: user.role === 'merchant' ? 'restaurant' : user.role as "customer" | "courier" | "admin" | "restaurant",
          isActive: user.isActive,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
        } as any; // Added 'as any' to bypass strict type checking for phone field
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