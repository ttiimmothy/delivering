import { queryField, nonNull, intArg, stringArg, booleanArg, arg, list } from 'nexus';
import { db } from '../db/client';
import { 
  users, addresses, courierProfiles, restaurants as restaurantsTable, menuCategories, menuItems, menuItemOptions, menuItemOptionValues,
  carts, cartItems, orders as ordersTable, orderItems, orderEvents, deliveries, reviews as reviewsTable
} from '../db/schema';
import { eq, and, desc, asc, inArray, or, like } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

// ===== QUERY FIELDS =====
export const me = queryField('me', {
  type: 'User',
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    const result = await db.select()
      .from(users)
      .where(eq(users.id, ctx.user.userId))
      .limit(1);

    return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
  },
});

export const restaurants = queryField('restaurants', {
  type: nonNull(list('Restaurant')),
  args: {
    cuisine: stringArg(),
    isOpen: booleanArg(),
    limit: intArg(),
    offset: intArg(),
    search: stringArg(),
    sortBy: stringArg(),
    sortOrder: stringArg(),
  },
  resolve: async (_, args, ctx) => {
    let conditions = [];

    if (args.cuisine) {
      conditions.push(eq(restaurantsTable.cuisine, args.cuisine));
    }
    if (args.isOpen !== undefined) {
      conditions.push(eq(restaurantsTable.isOpen, args.isOpen));
    }
    if (args.search) {
      conditions.push(
        or(
          like(restaurantsTable.name, `%${args.search}%`),
          like(restaurantsTable.description, `%${args.search}%`)
        )
      );
    }

    let query = db.select({
      id: restaurantsTable.id,
      name: restaurantsTable.name,
      description: restaurantsTable.description,
      image: restaurantsTable.image,
      cuisine: restaurantsTable.cuisine,
      rating: restaurantsTable.rating,
      reviewCount: restaurantsTable.reviewCount,
      deliveryTime: restaurantsTable.deliveryTime,
      deliveryFee: restaurantsTable.deliveryFee,
      minimumOrder: restaurantsTable.minimumOrder,
      isOpen: restaurantsTable.isOpen,
      address: restaurantsTable.address,
      phone: restaurantsTable.phone,
      email: restaurantsTable.email,
      website: restaurantsTable.website,
      createdAt: restaurantsTable.createdAt,
      updatedAt: restaurantsTable.updatedAt,
    })
      .from(restaurants)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(restaurantsTable.createdAt));

    if (args.limit) {
      query = query.limit(args.limit);
    }
    if (args.offset) {
      query = query.offset(args.offset);
    }

    return await query;
  },
});

export const restaurant = queryField('restaurant', {
  type: 'Restaurant',
  args: {
    slug: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    const result = await db.select()
      .from(restaurantsTable)
      .where(eq(restaurantsTable.slug, args.slug))
      .limit(1);

    if (result.length === 0) {
      const error = new Error('Restaurant not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return convertDateFields(result[0], ['createdAt', 'updatedAt']);
  },
});

export const favoriteRestaurants = queryField('favoriteRestaurants', {
  type: nonNull(list('Restaurant')),
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would need to be implemented based on your favorite system
    // For now, returning empty array
    return [];
  },
});

export const cart = queryField('cart', {
  type: 'Cart',
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    const result = await db.select()
      .from(carts)
      .where(eq(carts.userId, ctx.user.userId))
      .limit(1);

    return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
  },
});

export const order = queryField('order', {
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
      .from(ordersTable)
      .where(eq(ordersTable.id, args.id))
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
        .where(eq(restaurantsTable.id, order.restaurantId))
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

export const orders = queryField('orders', {
  type: nonNull(list('Order')),
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
      conditions.push(eq(ordersTable.customerId, ctx.user.userId));
    } else if (ctx.user.role === 'courier') {
      conditions.push(eq(ordersTable.courierId, ctx.user.userId));
    } else if (ctx.user.role === 'merchant') {
      // Get restaurants owned by this merchant
      const userRestaurants = await db.select({ id: restaurantsTable.id })
        .from(restaurants)
        .where(eq(restaurantsTable.ownerId, ctx.user.userId));
      
      const restaurantIds = userRestaurants.map(r => r.id);
      if (restaurantIds.length === 0) return [];
      
      conditions.push(inArray(ordersTable.restaurantId, restaurantIds));
    }

    if (args.status) {
      conditions.push(eq(ordersTable.status, args.status));
    }

    let query = db.select()
      .from(ordersTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(ordersTable.createdAt))
      .limit(args.limit || 100)
      .offset(args.offset || 0);

    const results = await query;
    return results;
  },
});

export const merchantOrders = queryField('merchantOrders', {
  type: nonNull(list('Order')),
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

    if (ctx.user.role !== 'merchant') {
      const error = new Error('Access denied. Merchant role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Get restaurants owned by this merchant
    const userRestaurants = await db.select({ id: restaurantsTable.id })
      .from(restaurants)
      .where(eq(restaurantsTable.ownerId, ctx.user.userId));
    
    const restaurantIds = userRestaurants.map(r => r.id);
    if (restaurantIds.length === 0) return [];

    let conditions = [inArray(ordersTable.restaurantId, restaurantIds)];

    if (args.status) {
      conditions.push(eq(ordersTable.status, args.status));
    }

    let query = db.select()
      .from(ordersTable)
      .where(and(...conditions))
      .orderBy(desc(ordersTable.createdAt))
      .limit(args.limit || 100)
      .offset(args.offset || 0);

    const results = await query;
    return results;
  },
});

export const courierAssignments = queryField('courierAssignments', {
  type: nonNull(list('Delivery')),
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

    const deliveries = await db.select()
      .from(deliveries)
      .where(eq(deliveries.courierId, ctx.user.userId))
      .orderBy(desc(deliveries.createdAt));
    
    return deliveries.map(delivery => convertDateFields(delivery, ['createdAt', 'updatedAt']));
  },
});

export const reviews = queryField('reviews', {
  type: nonNull(list('Review')),
  args: {
    restaurantId: stringArg(),
    courierId: stringArg(),
    limit: intArg(),
    offset: intArg(),
  },
  resolve: async (_, args, ctx) => {
    let conditions = [];

    if (args.restaurantId) {
      conditions.push(eq(reviewsTable.restaurantId, args.restaurantId));
    }
    if (args.courierId) {
      conditions.push(eq(reviewsTable.courierId, args.courierId));
    }

    let query = db.select()
      .from(reviews)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reviewsTable.createdAt));

    if (args.limit) {
      query = query.limit(args.limit);
    }
    if (args.offset) {
      query = query.offset(args.offset);
    }

    return await query;
  },
});

export const paymentIntent = queryField('paymentIntent', {
  type: 'PaymentIntent',
  args: {
    paymentIntentId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would need to be implemented with Stripe integration
    // For now, returning null
    return null;
  },
});
