import { objectType, inputObjectType, enumType, queryField, mutationField, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../db/client';
import { 
  users, addresses, courierProfiles, restaurants, menuCategories, menuItems, menuItemOptions, menuItemOptionValues,
  carts, cartItems, orders, orderItems, orderEvents, deliveries, reviews, payouts, invoices
} from '../db/schema';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';

// ===== TYPES =====
export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('email');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.string('phone');
    t.nonNull.field('role', { type: 'UserRole' });
    t.string('avatar');
    t.nonNull.boolean('isActive');
    t.nonNull.boolean('emailVerified');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.list.field('addresses', {
      type: 'Address',
      resolve: async (parent) => {
        return await db.select()
          .from(addresses)
          .where(eq(addresses.userId, parent.id))
          .orderBy(asc(addresses.createdAt));
      },
    });
    t.field('courierProfile', {
      type: 'CourierProfile',
      resolve: async (parent) => {
        const result = await db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.userId, parent.id))
          .limit(1);
        return result[0] || null;
      },
    });
  },
});

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('userId');
    t.nonNull.string('label');
    t.nonNull.string('street');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('zipCode');
    t.nonNull.string('country');
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
    t.nonNull.boolean('isDefault');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
  },
});

export const CourierProfile = objectType({
  name: 'CourierProfile',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('userId');
    t.nonNull.field('vehicleType', { type: 'VehicleType' });
    t.string('licensePlate');
    t.nonNull.boolean('isAvailable');
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
    t.nonNull.float('rating');
    t.nonNull.int('reviewCount');
    t.nonNull.int('totalDeliveries');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.field('user', {
      type: 'User',
      resolve: async (parent) => {
        const result = await db.select()
          .from(users)
          .where(eq(users.id, parent.userId))
          .limit(1);
        return result[0] || null;
      },
    });
  },
});

export const Location = objectType({
  name: 'Location',
  definition(t) {
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
    t.string('timestamp');
  },
});

export const Restaurant = objectType({
  name: 'Restaurant',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('description');
    t.string('image');
    t.nonNull.string('cuisine');
    t.float('rating');
    t.nonNull.int('reviewCount');
    t.nonNull.int('deliveryTime');
    t.nonNull.float('deliveryFee');
    t.nonNull.float('minimumOrder');
    t.nonNull.boolean('isOpen');
    t.nonNull.boolean('isActive');
    t.boolean('isFavorite');
    t.string('phone');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.field('address', {
      type: 'Address',
      resolve: async (parent) => {
        const result = await db.select()
          .from(addresses)
          .where(eq(addresses.id, parent.addressId))
          .limit(1);
        return result[0] || null;
      },
    });
    t.list.field('menuCategories', {
      type: 'MenuCategory',
      resolve: async (parent) => {
        return await db.select()
          .from(menuCategories)
          .where(eq(menuCategories.restaurantId, parent.id))
          .orderBy(asc(menuCategories.sortOrder));
      },
    });
  },
});

export const MenuCategory = objectType({
  name: 'MenuCategory',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('restaurantId');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.int('sortOrder');
    t.nonNull.boolean('isActive');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.list.field('menuItems', {
      type: 'MenuItem',
      resolve: async (parent) => {
        return await db.select()
          .from(menuItems)
          .where(eq(menuItems.categoryId, parent.id))
          .orderBy(asc(menuItems.sortOrder));
      },
    });
  },
});

export const MenuItem = objectType({
  name: 'MenuItem',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('restaurantId');
    t.nonNull.string('categoryId');
    t.nonNull.string('name');
    t.string('description');
    t.string('image');
    t.nonNull.float('price');
    t.nonNull.boolean('isAvailable');
    t.nonNull.boolean('isPopular');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.list.field('options', {
      type: 'MenuItemOption',
      resolve: async (parent) => {
        return await db.select()
          .from(menuItemOptions)
          .where(eq(menuItemOptions.menuItemId, parent.id))
          .orderBy(asc(menuItemOptions.sortOrder));
      },
    });
  },
});

export const MenuItemOption = objectType({
  name: 'MenuItemOption',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('menuItemId');
    t.nonNull.string('name');
    t.nonNull.field('type', { type: 'OptionType' });
    t.nonNull.boolean('isRequired');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
    t.list.field('values', {
      type: 'OptionValue',
      resolve: async (parent) => {
        return await db.select()
          .from(menuItemOptionValues)
          .where(eq(menuItemOptionValues.optionId, parent.id))
          .orderBy(asc(menuItemOptionValues.sortOrder));
      },
    });
  },
});

export const OptionValue = objectType({
  name: 'OptionValue',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('optionId');
    t.nonNull.string('name');
    t.nonNull.float('price');
    t.nonNull.boolean('isDefault');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
  },
});

export const Cart = objectType({
  name: 'Cart',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('userId');
    t.nonNull.string('restaurantId');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.list.field('items', {
      type: 'CartItem',
      resolve: async (parent) => {
        return await db.select()
          .from(cartItems)
          .where(eq(cartItems.cartId, parent.id));
      },
    });
    t.field('restaurant', {
      type: 'Restaurant',
      resolve: async (parent) => {
        const result = await db.select()
          .from(restaurants)
          .where(eq(restaurants.id, parent.restaurantId))
          .limit(1);
        return result[0] || null;
      },
    });
  },
});

export const CartItem = objectType({
  name: 'CartItem',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('cartId');
    t.nonNull.string('menuItemId');
    t.nonNull.int('quantity');
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
    t.nonNull.float('subtotal');
    t.nonNull.float('tax');
    t.nonNull.float('deliveryFee');
    t.nonNull.float('tip');
    t.nonNull.float('total');
    t.nonNull.string('deliveryAddress');
    t.string('specialInstructions');
    t.string('estimatedDeliveryTime');
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
    t.list.field('items', {
      type: 'OrderItem',
      resolve: async (parent) => {
        return await db.select()
          .from(orderItems)
          .where(eq(orderItems.orderId, parent.id))
          .orderBy(asc(orderItems.createdAt));
      },
    });
    t.list.field('events', {
      type: 'OrderEvent',
      resolve: async (parent) => {
        return await db.select()
          .from(orderEvents)
          .where(eq(orderEvents.orderId, parent.id))
          .orderBy(asc(orderEvents.createdAt));
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
    t.nonNull.float('unitPrice');
    t.nonNull.float('totalPrice');
    t.nonNull.string('selectedOptions');
    t.string('specialInstructions');
    t.nonNull.string('createdAt');
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
    t.nonNull.field('status', { type: 'OrderStatus' });
    t.string('message');
    t.string('metadata');
    t.nonNull.string('createdAt');
  },
});

export const Delivery = objectType({
  name: 'Delivery',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderId');
    t.nonNull.string('courierId');
    t.nonNull.field('status', { type: 'DeliveryStatus' });
    t.nonNull.string('assignedAt');
    t.string('acceptedAt');
    t.string('pickedUpAt');
    t.string('deliveredAt');
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
    t.string('estimatedArrival');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
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

export const Review = objectType({
  name: 'Review',
  definition(t) {
    t.nonNull.string('id');
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
        if (!result[0]) return null;
        
        const restaurant = result[0];
        return {
          ...restaurant,
          createdAt: restaurant.createdAt.toISOString(),
          updatedAt: restaurant.updatedAt.toISOString(),
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
        return result[0] || null;
      },
    });
  },
});

// ===== ENUMS =====
export const UserRole = enumType({
  name: 'UserRole',
  members: ['customer', 'merchant', 'courier', 'admin'],
});

export const VehicleType = enumType({
  name: 'VehicleType',
  members: ['bike', 'car', 'motorcycle'],
});

export const OptionType = enumType({
  name: 'OptionType',
  members: ['single', 'multiple'],
});

export const OrderStatus = enumType({
  name: 'OrderStatus',
  members: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
});

export const PaymentStatus = enumType({
  name: 'PaymentStatus',
  members: ['pending', 'paid', 'failed', 'refunded'],
});

export const DeliveryStatus = enumType({
  name: 'DeliveryStatus',
  members: ['assigned', 'accepted', 'picked_up', 'delivered'],
});

export const ReviewType = enumType({
  name: 'ReviewType',
  members: ['restaurant', 'courier'],
});

// ===== INPUT TYPES =====
export const SignupInput = inputObjectType({
  name: 'SignupInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('password');
    t.string('phone');
  },
});

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
  },
});

export const AddressInput = inputObjectType({
  name: 'AddressInput',
  definition(t) {
    t.nonNull.string('label');
    t.nonNull.string('street');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('zipCode');
    t.nonNull.string('country');
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
    t.boolean('isDefault');
  },
});

export const LocationInput = inputObjectType({
  name: 'LocationInput',
  definition(t) {
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
  },
});

export const AddToCartInput = inputObjectType({
  name: 'AddToCartInput',
  definition(t) {
    t.nonNull.string('menuItemId');
    t.nonNull.int('quantity');
    t.string('selectedOptions');
    t.string('specialInstructions');
  },
});

export const UpdateCartItemInput = inputObjectType({
  name: 'UpdateCartItemInput',
  definition(t) {
    t.nonNull.string('cartItemId');
    t.int('quantity');
    t.string('selectedOptions');
    t.string('specialInstructions');
  },
});

export const RemoveFromCartInput = inputObjectType({
  name: 'RemoveFromCartInput',
  definition(t) {
    t.nonNull.string('cartItemId');
  },
});

export const CreateOrderInput = inputObjectType({
  name: 'CreateOrderInput',
  definition(t) {
    t.nonNull.string('deliveryAddress');
    t.string('specialInstructions');
    t.float('tip');
  },
});

export const CreateReviewInput = inputObjectType({
  name: 'CreateReviewInput',
  definition(t) {
    t.nonNull.int('rating');
    t.string('comment');
    t.nonNull.field('type', { type: 'ReviewType' });
    t.string('restaurantId');
    t.string('courierId');
  },
});

export const UpdateCourierLocationInput = inputObjectType({
  name: 'UpdateCourierLocationInput',
  definition(t) {
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
  },
});

// ===== RESPONSE TYPES =====
export const AuthResponse = objectType({
  name: 'AuthResponse',
  definition(t) {
    t.nonNull.string('accessToken');
    t.nonNull.string('refreshToken');
    t.nonNull.field('user', { type: 'User' });
  },
});

export const RefreshTokenResponse = objectType({
  name: 'RefreshTokenResponse',
  definition(t) {
    t.nonNull.string('accessToken');
    t.nonNull.string('refreshToken');
  },
});

export const PaymentIntent = objectType({
  name: 'PaymentIntent',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('status');
    t.nonNull.int('amount');
    t.nonNull.string('currency');
    t.nonNull.string('clientSecret');
    t.string('description');
    t.nonNull.string('createdAt');
    t.string('metadata');
  },
});

export const CheckoutSession = objectType({
  name: 'CheckoutSession',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('url');
    t.string('customerId');
    t.string('customerEmail');
    t.nonNull.string('status');
    t.string('paymentIntentId');
    t.nonNull.string('createdAt');
    t.nonNull.string('expiresAt');
  },
});

export const BillingPortalSession = objectType({
  name: 'BillingPortalSession',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('url');
    t.nonNull.string('returnUrl');
    t.nonNull.string('createdAt');
  },
});

export const Refund = objectType({
  name: 'Refund',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('status');
    t.nonNull.int('amount');
    t.nonNull.string('currency');
    t.string('reason');
    t.nonNull.string('createdAt');
  },
});

// Subscription Types
export const CourierLocationUpdate = objectType({
  name: 'CourierLocationUpdate',
  definition(t) {
    t.nonNull.string('courierId');
    t.nonNull.string('deliveryId');
    t.field('location', {
      type: 'Location',
      resolve: (parent) => parent.location,
    });
    t.string('estimatedArrival');
    t.nonNull.string('timestamp');
  },
});

export const DeliveryAssignment = objectType({
  name: 'DeliveryAssignment',
  definition(t) {
    t.nonNull.string('deliveryId');
    t.nonNull.string('courierId');
    t.nonNull.string('assignedBy');
    t.nonNull.string('timestamp');
  },
});

export const DeliveryStatusUpdate = objectType({
  name: 'DeliveryStatusUpdate',
  definition(t) {
    t.nonNull.string('deliveryId');
    t.nonNull.string('status');
    t.string('message');
    t.nonNull.string('timestamp');
  },
});

export const CourierStatusUpdate = objectType({
  name: 'CourierStatusUpdate',
  definition(t) {
    t.nonNull.string('courierId');
    t.nonNull.boolean('isAvailable');
    t.nonNull.string('timestamp');
  },
});

export const OrderUpdate = objectType({
  name: 'OrderUpdate',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('status');
    t.string('message');
    t.string('metadata');
    t.nonNull.string('timestamp');
  },
});

export const CourierTrackingUpdate = objectType({
  name: 'CourierTrackingUpdate',
  definition(t) {
    t.nonNull.string('courierId');
    t.field('currentLocation', {
      type: 'Location',
      resolve: (parent) => parent.currentLocation,
    });
    t.string('estimatedArrival');
    t.nonNull.string('timestamp');
  },
});

export const OrderQueueUpdate = objectType({
  name: 'OrderQueueUpdate',
  definition(t) {
    t.nonNull.string('restaurantId');
    t.nonNull.list.field('pendingOrders', {
      type: 'Order',
    });
    t.nonNull.list.field('preparingOrders', {
      type: 'Order',
    });
    t.nonNull.list.field('readyOrders', {
      type: 'Order',
    });
    t.nonNull.string('timestamp');
  },
});

export const OrderTrackingUpdate = objectType({
  name: 'OrderTrackingUpdate',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('status');
    t.field('courier', {
      type: 'User',
      resolve: (parent) => parent.courier,
    });
    t.field('currentLocation', {
      type: 'Location',
      resolve: (parent) => parent.currentLocation,
    });
    t.string('estimatedDelivery');
    t.nonNull.string('timestamp');
  },
});

// Payment Input Types
export const CreateCheckoutSessionInput = inputObjectType({
  name: 'CreateCheckoutSessionInput',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('successUrl');
    t.nonNull.string('cancelUrl');
    t.string('customerEmail');
  },
});

export const CreateBillingPortalSessionInput = inputObjectType({
  name: 'CreateBillingPortalSessionInput',
  definition(t) {
    t.nonNull.string('customerId');
    t.nonNull.string('returnUrl');
  },
});

export const CreatePaymentIntentInput = inputObjectType({
  name: 'CreatePaymentIntentInput',
  definition(t) {
    t.nonNull.float('amount');
    t.string('currency');
    t.string('description');
    t.string('metadata');
  },
});

export const CreateRefundInput = inputObjectType({
  name: 'CreateRefundInput',
  definition(t) {
    t.nonNull.string('paymentIntentId');
    t.float('amount');
    t.string('reason');
  },
});

// Payment Mutations
export const createCheckoutSession = mutationField('createCheckoutSession', {
  type: 'CheckoutSession',
  args: {
    input: nonNull(arg({ type: 'CreateCheckoutSessionInput' })),
  },
  resolve: async (_, { input }, ctx) => {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    try {
      // Verify the order belongs to the user
      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (orderResult.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult[0];
      if (order.customerId !== ctx.user.id) {
        throw new Error('Unauthorized access to order');
      }

      // For now, return a mock response
      return {
        id: 'cs_test_' + Date.now(),
        url: 'https://checkout.stripe.com/test',
        customerId: ctx.user.id,
        customerEmail: ctx.user.email,
        status: 'open',
        paymentIntentId: 'pi_test_' + Date.now(),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  },
});

export const createBillingPortalSession = mutationField('createBillingPortalSession', {
  type: 'BillingPortalSession',
  args: {
    input: nonNull(arg({ type: 'CreateBillingPortalSessionInput' })),
  },
  resolve: async (_, { input }, ctx) => {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    try {
      // For now, return a mock response
      return {
        id: 'bps_test_' + Date.now(),
        url: 'https://billing.stripe.com/test',
        returnUrl: input.returnUrl,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw new Error('Failed to create billing portal session');
    }
  },
});

export const createPaymentIntent = mutationField('createPaymentIntent', {
  type: 'PaymentIntent',
  args: {
    input: nonNull(arg({ type: 'CreatePaymentIntentInput' })),
  },
  resolve: async (_, { input }, ctx) => {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    try {
      // For now, return a mock response
      return {
        id: 'pi_test_' + Date.now(),
        status: 'requires_payment_method',
        amount: Math.round(input.amount * 100), // Convert to cents
        currency: input.currency || 'usd',
        clientSecret: 'pi_test_' + Date.now() + '_secret',
        description: input.description || '',
        createdAt: new Date().toISOString(),
        metadata: input.metadata || '',
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  },
});

export const confirmPaymentIntent = mutationField('confirmPaymentIntent', {
  type: 'PaymentIntent',
  args: {
    paymentIntentId: nonNull(stringArg()),
  },
  resolve: async (_, { paymentIntentId }, ctx) => {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    try {
      // For now, return a mock response
      return {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 1000, // Mock amount
        currency: 'usd',
        clientSecret: paymentIntentId + '_secret',
        description: 'Test payment',
        createdAt: new Date().toISOString(),
        metadata: '',
      };
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment intent');
    }
  },
});

export const cancelPaymentIntent = mutationField('cancelPaymentIntent', {
  type: 'PaymentIntent',
  args: {
    paymentIntentId: nonNull(stringArg()),
  },
  resolve: async (_, { paymentIntentId }, ctx) => {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    try {
      // For now, return a mock response
      return {
        id: paymentIntentId,
        status: 'canceled',
        amount: 1000, // Mock amount
        currency: 'usd',
        clientSecret: paymentIntentId + '_secret',
        description: 'Test payment',
        createdAt: new Date().toISOString(),
        metadata: '',
      };
    } catch (error) {
      console.error('Error cancelling payment intent:', error);
      throw new Error('Failed to cancel payment intent');
    }
  },
});

export const createRefund = mutationField('createRefund', {
  type: 'Refund',
  args: {
    input: nonNull(arg({ type: 'CreateRefundInput' })),
  },
  resolve: async (_, { input }, ctx) => {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    try {
      // For now, return a mock response
      return {
        id: 're_test_' + Date.now(),
        status: 'succeeded',
        amount: Math.round((input.amount || 1000) * 100), // Convert to cents
        currency: 'usd',
        reason: input.reason || 'requested_by_customer',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  },
});
