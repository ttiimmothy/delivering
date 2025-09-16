import { objectType, inputObjectType, enumType, queryField, mutationField, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../db/client';
import { deliveries, courierProfiles, users, orders } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

// Enums
export const DeliveryStatus = enumType({
  name: 'DeliveryStatus',
  members: ['assigned', 'accepted', 'picked_up', 'delivered'],
});

export const VehicleType = enumType({
  name: 'VehicleType',
  members: ['bike', 'car', 'motorcycle'],
});

// Types
export const Delivery = objectType({
  name: 'Delivery',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('orderId');
    t.nonNull.string('courierId');
    t.nonNull.field('status', { type: 'DeliveryStatus' });
    t.nonNull.string('assignedAt', {
      resolve: (parent) => parent.assignedAt instanceof Date ? parent.assignedAt.toISOString() : parent.assignedAt
    });
    t.string('acceptedAt', {
      resolve: (parent) => parent.acceptedAt ? (parent.acceptedAt instanceof Date ? parent.acceptedAt.toISOString() : parent.acceptedAt) : null
    });
    t.string('pickedUpAt', {
      resolve: (parent) => parent.pickedUpAt ? (parent.pickedUpAt instanceof Date ? parent.pickedUpAt.toISOString() : parent.pickedUpAt) : null
    });
    t.string('deliveredAt', {
      resolve: (parent) => parent.deliveredAt ? (parent.deliveredAt instanceof Date ? parent.deliveredAt.toISOString() : parent.deliveredAt) : null
    });
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
    t.nonNull.string('rating');
    t.nonNull.int('reviewCount');
    t.nonNull.int('totalDeliveries');
    t.nonNull.string('createdAt', {
      resolve: (parent) => parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt
    });
    t.nonNull.string('updatedAt', {
      resolve: (parent) => parent.updatedAt instanceof Date ? parent.updatedAt.toISOString() : parent.updatedAt
    });
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

// Input Types
export const CreateCourierProfileInput = inputObjectType({
  name: 'CreateCourierProfileInput',
  definition(t) {
    t.nonNull.field('vehicleType', { type: 'VehicleType' });
    t.string('licensePlate');
    t.boolean('isAvailable');
    t.field('currentLocation', { type: 'LocationInput' });
  },
});

export const UpdateCourierProfileInput = inputObjectType({
  name: 'UpdateCourierProfileInput',
  definition(t) {
    t.nonNull.string('id');
    t.field('vehicleType', { type: 'VehicleType' });
    t.string('licensePlate');
    t.boolean('isAvailable');
    t.field('currentLocation', { type: 'LocationInput' });
  },
});

export const UpdateDeliveryStatusInput = inputObjectType({
  name: 'UpdateDeliveryStatusInput',
  definition(t) {
    t.nonNull.string('deliveryId');
    t.nonNull.field('status', { type: 'DeliveryStatus' });
    t.field('currentLocation', { type: 'LocationInput' });
    t.string('estimatedArrival');
  },
});

export const UpdateCourierLocationInput = inputObjectType({
  name: 'UpdateCourierLocationInput',
  definition(t) {
    t.nonNull.string('latitude');
    t.nonNull.string('longitude');
  },
});

// Queries
export const DeliveryQueries = queryField('delivery', {
  type: 'Query',
  definition(t) {
    t.list.field('deliveries', {
      type: 'Delivery',
      args: {
        courierId: stringArg(),
        status: arg({ type: 'DeliveryStatus' }),
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

        if (ctx.user.role === 'courier') {
          conditions.push(eq(deliveries.courierId, ctx.user.userId));
        } else if (args.courierId) {
          conditions.push(eq(deliveries.courierId, args.courierId));
        }

        if (args.status) {
          conditions.push(eq(deliveries.status, args.status));
        }

        let query = db.select()
          .from(deliveries)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(deliveries.createdAt));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });

    t.field('delivery', {
      type: 'Delivery',
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
          .from(deliveries)
          .where(eq(deliveries.id, args.id))
          .limit(1);

        if (result.length === 0) {
          const error = new Error('Delivery not found');
          error.name = 'NotFoundError';
          throw error;
        }

        const delivery = result[0];

        // Check if user has access to this delivery
        if (ctx.user.role === 'courier' && delivery.courierId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        return delivery;
      },
    });

    t.list.field('courierProfiles', {
      type: 'CourierProfile',
      args: {
        isAvailable: booleanArg(),
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

        if (args.isAvailable !== undefined) {
          conditions.push(eq(courierProfiles.isAvailable, args.isAvailable));
        }

        let query = db.select()
          .from(courierProfiles)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(courierProfiles.rating));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });

    t.field('courierProfile', {
      type: 'CourierProfile',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        // Users can only view their own profile unless they're admin
        if (ctx.user.role !== 'admin' && ctx.user.userId !== args.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        const result = await db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.userId, args.userId))
          .limit(1);

        if (result.length === 0) {
          const error = new Error('Courier profile not found');
          error.name = 'NotFoundError';
          throw error;
        }

        return result[0];
      },
    });

    t.list.field('availableCouriers', {
      type: 'CourierProfile',
      args: {
        limit: intArg(),
        offset: intArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'admin') {
          const error = new Error('Access denied. Admin role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        let query = db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.isAvailable, true))
          .orderBy(desc(courierProfiles.rating));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });
  },
});

// Mutations
export const DeliveryMutations = mutationField('delivery', {
  type: 'Mutation',
  definition(t) {
    t.field('createCourierProfile', {
      type: 'CourierProfile',
      args: {
        input: nonNull(arg({ type: 'CreateCourierProfileInput' })),
      },
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

        // Check if profile already exists
        const existingProfile = await db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.userId, ctx.user.userId))
          .limit(1);

        if (existingProfile.length > 0) {
          const error = new Error('Courier profile already exists');
          error.name = 'ConflictError';
          throw error;
        }

        const result = await db.insert(courierProfiles).values({
          userId: ctx.user.userId,
          vehicleType: args.input.vehicleType,
          licensePlate: args.input.licensePlate,
          isAvailable: args.input.isAvailable ?? true,
          currentLocation: args.input.currentLocation ? JSON.stringify(args.input.currentLocation) : null,
        }).returning();

        return result[0];
      },
    });

    t.field('updateCourierProfile', {
      type: 'CourierProfile',
      args: {
        input: nonNull(arg({ type: 'UpdateCourierProfileInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        // Check if user owns this profile or is admin
        const profile = await db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.id, args.input.id))
          .limit(1);

        if (profile.length === 0) {
          const error = new Error('Courier profile not found');
          error.name = 'NotFoundError';
          throw error;
        }

        if (ctx.user.role !== 'admin' && profile[0].userId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        const updateData: any = { updatedAt: new Date() };
        if (args.input.vehicleType !== undefined) updateData.vehicleType = args.input.vehicleType;
        if (args.input.licensePlate !== undefined) updateData.licensePlate = args.input.licensePlate;
        if (args.input.isAvailable !== undefined) updateData.isAvailable = args.input.isAvailable;
        if (args.input.currentLocation !== undefined) updateData.currentLocation = JSON.stringify(args.input.currentLocation);

        const result = await db.update(courierProfiles)
          .set(updateData)
          .where(eq(courierProfiles.id, args.input.id))
          .returning();

        return result[0];
      },
    });

    t.field('updateCourierLocation', {
      type: 'CourierProfile',
      args: {
        input: nonNull(arg({ type: 'UpdateCourierLocationInput' })),
      },
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

        const location = {
          latitude: parseFloat(args.input.latitude),
          longitude: parseFloat(args.input.longitude),
        };

        const result = await db.update(courierProfiles)
          .set({
            currentLocation: JSON.stringify(location),
            updatedAt: new Date(),
          })
          .where(eq(courierProfiles.userId, ctx.user.userId))
          .returning();

        if (result.length === 0) {
          const error = new Error('Courier profile not found');
          error.name = 'NotFoundError';
          throw error;
        }

        return result[0];
      },
    });

    t.field('updateDeliveryStatus', {
      type: 'Delivery',
      args: {
        input: nonNull(arg({ type: 'UpdateDeliveryStatusInput' })),
      },
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

        // Check if courier owns this delivery
        const delivery = await db.select()
          .from(deliveries)
          .where(eq(deliveries.id, args.input.deliveryId))
          .limit(1);

        if (delivery.length === 0) {
          const error = new Error('Delivery not found');
          error.name = 'NotFoundError';
          throw error;
        }

        if (delivery[0].courierId !== ctx.user.userId) {
          const error = new Error('Access denied');
          error.name = 'AuthorizationError';
          throw error;
        }

        const updateData: any = {
          status: args.input.status,
          updatedAt: new Date(),
        };

        // Set timestamps based on status
        if (args.input.status === 'accepted' && !delivery[0].acceptedAt) {
          updateData.acceptedAt = new Date();
        } else if (args.input.status === 'picked_up' && !delivery[0].pickedUpAt) {
          updateData.pickedUpAt = new Date();
        } else if (args.input.status === 'delivered' && !delivery[0].deliveredAt) {
          updateData.deliveredAt = new Date();
        }

        if (args.input.currentLocation) {
          updateData.currentLocation = JSON.stringify(args.input.currentLocation);
        }

        if (args.input.estimatedArrival) {
          updateData.estimatedArrival = new Date(args.input.estimatedArrival);
        }

        const result = await db.update(deliveries)
          .set(updateData)
          .where(eq(deliveries.id, args.input.deliveryId))
          .returning();

        return result[0];
      },
    });

    t.field('acceptDelivery', {
      type: 'Delivery',
      args: {
        deliveryId: nonNull(stringArg()),
      },
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

        // Check if courier is available
        const profile = await db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.userId, ctx.user.userId))
          .limit(1);

        if (profile.length === 0 || !profile[0].isAvailable) {
          const error = new Error('Courier is not available');
          error.name = 'ValidationError';
          throw error;
        }

        // Check if delivery exists and is assigned
        const delivery = await db.select()
          .from(deliveries)
          .where(eq(deliveries.id, args.deliveryId))
          .limit(1);

        if (delivery.length === 0) {
          const error = new Error('Delivery not found');
          error.name = 'NotFoundError';
          throw error;
        }

        if (delivery[0].status !== 'assigned') {
          const error = new Error('Delivery is not available for acceptance');
          error.name = 'ValidationError';
          throw error;
        }

        // Update delivery status
        const result = await db.update(deliveries)
          .set({
            status: 'accepted',
            acceptedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(deliveries.id, args.deliveryId))
          .returning();

        return result[0];
      },
    });
  },
});
