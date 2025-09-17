import { queryField, nonNull, intArg, stringArg, booleanArg, arg, list } from 'nexus';
import { db } from '../database/drizzle/client';
import { 
  users, addresses, courierProfiles, restaurants as restaurantsTable, menuCategories, menuItems, menuItemOptions, menuItemOptionValues,
  carts, cartItems, orders as ordersTable, orderItems, orderEvents, deliveries, reviews as reviewsTable, favorites
} from '../database/drizzle/schema';
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

    if (!result[0]) return null;
    const user = result[0];
    return {
      ...user,
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
      ownerId: restaurantsTable.ownerId,
      name: restaurantsTable.name,
      slug: restaurantsTable.slug,
      description: restaurantsTable.description,
      image: restaurantsTable.image,
      cuisine: restaurantsTable.cuisine,
      rating: restaurantsTable.rating,
      reviewCount: restaurantsTable.reviewCount,
      deliveryTime: restaurantsTable.deliveryTime,
      deliveryFee: restaurantsTable.deliveryFee,
      minimumOrder: restaurantsTable.minimumOrder,
      isOpen: restaurantsTable.isOpen,
      isActive: restaurantsTable.isActive,
      addressId: restaurantsTable.addressId,
      phone: restaurantsTable.phone,
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

    const results = await query;
    return results.map(restaurant => ({
      ...restaurant,
      createdAt: restaurant.createdAt instanceof Date ? restaurant.createdAt.toISOString() : String(restaurant.createdAt),
      updatedAt: restaurant.updatedAt instanceof Date ? restaurant.updatedAt.toISOString() : String(restaurant.updatedAt),
    }));
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

export const favoriteRestaurants = queryField('favoriteRestaurants', {
  type: nonNull(list('Restaurant')),
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Get user's favorite restaurants
    const userFavorites = await db
      .select({
        restaurant: restaurantsTable,
      })
      .from(favorites)
      .innerJoin(restaurantsTable, eq(favorites.restaurantId, restaurantsTable.id))
      .where(eq(favorites.userId, ctx.user.userId))
      .orderBy(desc(favorites.createdAt));

    return userFavorites.map(fav => {
      const restaurant = convertDateFields(fav.restaurant, ['createdAt', 'updatedAt']);
      return {
        ...restaurant,
        createdAt: restaurant.createdAt instanceof Date ? restaurant.createdAt.toISOString() : String(restaurant.createdAt),
        updatedAt: restaurant.updatedAt instanceof Date ? restaurant.updatedAt.toISOString() : String(restaurant.updatedAt),
      };
    });
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

    if (!result[0]) return null;
    const cart = result[0];
    return {
      id: cart.id,
      userId: cart.userId,
      restaurantId: cart.restaurantId,
      createdAt: cart.createdAt instanceof Date ? cart.createdAt.toISOString() : String(cart.createdAt),
      updatedAt: cart.updatedAt instanceof Date ? cart.updatedAt.toISOString() : String(cart.updatedAt),
    };
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
    return results.map(order => ({
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
    }));
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
    return results.map(order => ({
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
    }));
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

    const courierDeliveries = await db.select()
      .from(deliveries)
      .where(eq(deliveries.courierId, ctx.user.userId))
      .orderBy(desc(deliveries.createdAt));
    
    return courierDeliveries.map(delivery => ({
      id: delivery.id,
      orderId: delivery.orderId,
      courierId: delivery.courierId,
      status: delivery.status,
      assignedAt: delivery.assignedAt ? (delivery.assignedAt instanceof Date ? delivery.assignedAt.toISOString() : String(delivery.assignedAt)) : null,
      acceptedAt: delivery.acceptedAt ? (delivery.acceptedAt instanceof Date ? delivery.acceptedAt.toISOString() : String(delivery.acceptedAt)) : null,
      pickedUpAt: delivery.pickedUpAt ? (delivery.pickedUpAt instanceof Date ? delivery.pickedUpAt.toISOString() : String(delivery.pickedUpAt)) : null,
      deliveredAt: delivery.deliveredAt ? (delivery.deliveredAt instanceof Date ? delivery.deliveredAt.toISOString() : String(delivery.deliveredAt)) : null,
      currentLocation: delivery.currentLocation,
      estimatedArrival: delivery.estimatedArrival ? (delivery.estimatedArrival instanceof Date ? delivery.estimatedArrival.toISOString() : String(delivery.estimatedArrival)) : null,
      createdAt: delivery.createdAt instanceof Date ? delivery.createdAt.toISOString() : String(delivery.createdAt),
      updatedAt: delivery.updatedAt instanceof Date ? delivery.updatedAt.toISOString() : String(delivery.updatedAt),
    }));
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
