import { objectType, inputObjectType, enumType, queryField, mutationField, nonNull, intArg, stringArg, arg } from 'nexus';
import { db } from '../db/client';
import { reviews, users, restaurants, orders } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

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
    t.nonNull.string('orderId');
    t.nonNull.string('customerId');
    t.string('restaurantId');
    t.string('courierId');
    t.nonNull.int('rating');
    t.string('comment');
    t.nonNull.field('type', { type: 'ReviewType' });
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
        if (!parent.restaurantId) return null;
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
    t.nonNull.string('id');
    t.int('rating');
    t.string('comment');
  },
});

// Queries
export const ReviewQueries = queryField('review', {
  type: 'Query',
  definition(t) {
    t.list.field('reviews', {
      type: 'Review',
      args: {
        restaurantId: stringArg(),
        courierId: stringArg(),
        type: arg({ type: 'ReviewType' }),
        rating: intArg(),
        limit: intArg(),
        offset: intArg(),
      },
      resolve: async (_, args, ctx) => {
        let conditions = [];

        if (args.restaurantId) {
          conditions.push(eq(reviews.restaurantId, args.restaurantId));
        }

        if (args.courierId) {
          conditions.push(eq(reviews.courierId, args.courierId));
        }

        if (args.type) {
          conditions.push(eq(reviews.type, args.type));
        }

        if (args.rating) {
          conditions.push(eq(reviews.rating, args.rating));
        }

        let query = db.select()
          .from(reviews)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(reviews.createdAt));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });

    t.field('review', {
      type: 'Review',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const result = await db.select()
          .from(reviews)
          .where(eq(reviews.id, args.id))
          .limit(1);

        if (result.length === 0) {
          const error = new Error('Review not found');
          error.name = 'NotFoundError';
          throw error;
        }

        return result[0];
      },
    });

    t.list.field('userReviews', {
      type: 'Review',
      args: {
        userId: nonNull(stringArg()),
        type: arg({ type: 'ReviewType' }),
        limit: intArg(),
        offset: intArg(),
      },
      resolve: async (_, args, ctx) => {
        let conditions = [eq(reviews.customerId, args.userId)];

        if (args.type) {
          conditions.push(eq(reviews.type, args.type));
        }

        let query = db.select()
          .from(reviews)
          .where(and(...conditions))
          .orderBy(desc(reviews.createdAt));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });

    t.field('restaurantRating', {
      type: 'String',
      args: {
        restaurantId: nonNull(stringArg()),
      },
      resolve: async (_, args) => {
        const result = await db.select({
          avgRating: reviews.rating,
          count: reviews.id,
        })
          .from(reviews)
          .where(and(
            eq(reviews.restaurantId, args.restaurantId),
            eq(reviews.type, 'restaurant')
          ));

        if (result.length === 0) {
          return '0.00';
        }

        const totalRating = result.reduce((sum, review) => sum + review.avgRating, 0);
        const count = result.length;
        const average = totalRating / count;

        return average.toFixed(2);
      },
    });

    t.field('courierRating', {
      type: 'String',
      args: {
        courierId: nonNull(stringArg()),
      },
      resolve: async (_, args) => {
        const result = await db.select({
          avgRating: reviews.rating,
          count: reviews.id,
        })
          .from(reviews)
          .where(and(
            eq(reviews.courierId, args.courierId),
            eq(reviews.type, 'courier')
          ));

        if (result.length === 0) {
          return '0.00';
        }

        const totalRating = result.reduce((sum, review) => sum + review.avgRating, 0);
        const count = result.length;
        const average = totalRating / count;

        return average.toFixed(2);
      },
    });
  },
});

// Mutations
export const ReviewMutations = mutationField('review', {
  type: 'Mutation',
  definition(t) {
    t.field('createReview', {
      type: 'Review',
      args: {
        input: nonNull(arg({ type: 'CreateReviewInput' })),
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

        // Validate rating
        if (args.input.rating < 1 || args.input.rating > 5) {
          const error = new Error('Rating must be between 1 and 5');
          error.name = 'ValidationError';
          throw error;
        }

        // Check if order exists and belongs to user
        const order = await db.select()
          .from(orders)
          .where(eq(orders.id, args.input.orderId))
          .limit(1);

        if (order.length === 0) {
          const error = new Error('Order not found');
          error.name = 'NotFoundError';
          throw error;
        }

        if (order[0].customerId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        // Check if order is delivered
        if (order[0].status !== 'delivered') {
          const error = new Error('Order must be delivered before reviewing');
          error.name = 'ValidationError';
          throw error;
        }

        // Check if review already exists for this order and type
        const existingReview = await db.select()
          .from(reviews)
          .where(and(
            eq(reviews.orderId, args.input.orderId),
            eq(reviews.type, args.input.type)
          ))
          .limit(1);

        if (existingReview.length > 0) {
          const error = new Error('Review already exists for this order');
          error.name = 'ConflictError';
          throw error;
        }

        // Determine restaurantId and courierId based on type
        let restaurantId = null;
        let courierId = null;

        if (args.input.type === 'restaurant') {
          restaurantId = order[0].restaurantId;
        } else if (args.input.type === 'courier') {
          courierId = order[0].courierId;
        }

        const result = await db.insert(reviews).values({
          orderId: args.input.orderId,
          customerId: ctx.user.userId,
          restaurantId,
          courierId,
          rating: args.input.rating,
          comment: args.input.comment,
          type: args.input.type,
        }).returning();

        return result[0];
      },
    });

    t.field('updateReview', {
      type: 'Review',
      args: {
        input: nonNull(arg({ type: 'UpdateReviewInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        // Check if review exists and belongs to user
        const review = await db.select()
          .from(reviews)
          .where(eq(reviews.id, args.input.id))
          .limit(1);

        if (review.length === 0) {
          const error = new Error('Review not found');
          error.name = 'NotFoundError';
          throw error;
        }

        if (review[0].customerId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        const updateData: any = { updatedAt: new Date() };
        if (args.input.rating !== undefined) {
          if (args.input.rating < 1 || args.input.rating > 5) {
            const error = new Error('Rating must be between 1 and 5');
            error.name = 'ValidationError';
            throw error;
          }
          updateData.rating = args.input.rating;
        }
        if (args.input.comment !== undefined) {
          updateData.comment = args.input.comment;
        }

        const result = await db.update(reviews)
          .set(updateData)
          .where(eq(reviews.id, args.input.id))
          .returning();

        return result[0];
      },
    });

    t.field('deleteReview', {
      type: 'Boolean',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        // Check if review exists and belongs to user
        const review = await db.select()
          .from(reviews)
          .where(eq(reviews.id, args.id))
          .limit(1);

        if (review.length === 0) {
          const error = new Error('Review not found');
          error.name = 'NotFoundError';
          throw error;
        }

        if (review[0].customerId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        const result = await db.delete(reviews)
          .where(eq(reviews.id, args.id))
          .returning();

        return result.length > 0;
      },
    });
  },
});
