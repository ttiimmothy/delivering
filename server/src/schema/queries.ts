import { queryField, nonNull, intArg, stringArg, booleanArg, arg, list } from 'nexus';
import { db } from '../db/client';
import { 
  users, addresses, courierProfiles, restaurants, menuCategories, menuItems, menuItemOptions, menuItemOptionValues,
  carts, cartItems, orders, orderItems, orderEvents, deliveries, reviews
} from '../db/schema';
import { eq, and, desc, asc, inArray, or, like } from 'drizzle-orm';

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

    return result[0] || null;
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
      conditions.push(eq(restaurants.cuisine, args.cuisine));
    }
    if (args.isOpen !== undefined) {
      conditions.push(eq(restaurants.isOpen, args.isOpen));
    }
    if (args.search) {
      conditions.push(
        or(
          like(restaurants.name, `%${args.search}%`),
          like(restaurants.description, `%${args.search}%`)
        )
      );
    }

    let query = db.select({
      id: restaurants.id,
      name: restaurants.name,
      description: restaurants.description,
      image: restaurants.image,
      cuisine: restaurants.cuisine,
      rating: restaurants.rating,
      reviewCount: restaurants.reviewCount,
      deliveryTime: restaurants.deliveryTime,
      deliveryFee: restaurants.deliveryFee,
      minimumOrder: restaurants.minimumOrder,
      isOpen: restaurants.isOpen,
      address: restaurants.address,
      phone: restaurants.phone,
      email: restaurants.email,
      website: restaurants.website,
      createdAt: restaurants.createdAt,
      updatedAt: restaurants.updatedAt,
    })
      .from(restaurants)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(restaurants.createdAt));

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
      .from(restaurants)
      .where(eq(restaurants.slug, args.slug))
      .limit(1);

    if (result.length === 0) {
      const error = new Error('Restaurant not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return result[0];
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

    return result[0] || null;
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
    const userRestaurants = await db.select({ id: restaurants.id })
      .from(restaurants)
      .where(eq(restaurants.ownerId, ctx.user.userId));
    
    const restaurantIds = userRestaurants.map(r => r.id);
    if (restaurantIds.length === 0) return [];

    let conditions = [inArray(orders.restaurantId, restaurantIds)];

    if (args.status) {
      conditions.push(eq(orders.status, args.status));
    }

    let query = db.select()
      .from(orders)
      .where(and(...conditions))
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

    return await db.select()
      .from(deliveries)
      .where(eq(deliveries.courierId, ctx.user.userId))
      .orderBy(desc(deliveries.createdAt));
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
      conditions.push(eq(reviews.restaurantId, args.restaurantId));
    }
    if (args.courierId) {
      conditions.push(eq(reviews.courierId, args.courierId));
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
