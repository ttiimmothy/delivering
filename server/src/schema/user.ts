import { objectType, inputObjectType, enumType, extendType, nonNull, stringArg, intArg, booleanArg } from 'nexus';
import { db } from '../db/client';
import { users, addresses, courierProfiles } from '../db/schema';
import { eq, and } from 'drizzle-orm';
// import { AuthenticationError, AuthorizationError, NotFoundError } from '../utils/errors';
import { JWTPayload } from '../utils/auth';
import { AuthController } from '../controllers/auth';

// Enums
export const UserRole = enumType({
  name: 'UserRole',
  members: ['customer', 'courier', 'merchant', 'admin'],
});

// Types
export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('email');
    t.string('firstName');
    t.string('lastName');
    t.string('phone');
    t.nonNull.field('role', { type: 'UserRole' });
    t.string('avatar');
    t.nonNull.boolean('isActive');
    t.nonNull.boolean('emailVerified');
    t.string('googleId');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    
    // Relations
    t.list.field('addresses', {
      type: 'Address',
      resolve: async (parent) => {
        return await db.select().from(addresses).where(eq(addresses.userId, parent.id));
      },
    });
    
    t.field('courierProfile', {
      type: 'CourierProfile',
      resolve: async (parent) => {
        if (parent.role !== 'courier') return null;
        const profile = await db.select().from(courierProfiles).where(eq(courierProfiles.userId, parent.id)).limit(1);
        return profile[0] || null;
      },
    });
  },
});

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('label');
    t.nonNull.string('street');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('zipCode');
    t.nonNull.string('country');
    t.string('latitude');
    t.string('longitude');
    t.nonNull.boolean('isDefault');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
  },
});

export const CourierProfile = objectType({
  name: 'CourierProfile',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('vehicleType');
    t.string('licensePlate');
    t.nonNull.boolean('isAvailable');
    t.field('currentLocation', { type: 'Location' });
    t.string('rating');
    t.nonNull.int('reviewCount');
    t.nonNull.int('totalDeliveries');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
  },
});

export const Location = objectType({
  name: 'Location',
  definition(t) {
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
  },
});

// Input Types
export const SignupInput = inputObjectType({
  name: 'SignupInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.string('phone');
    t.field('role', { type: 'UserRole', default: 'customer' });
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
    t.string('country', { default: 'US' });
    t.string('latitude');
    t.string('longitude');
    t.boolean('isDefault', { default: false });
  },
});

export const UpdateProfileInput = inputObjectType({
  name: 'UpdateProfileInput',
  definition(t) {
    t.string('firstName');
    t.string('lastName');
    t.string('phone');
    t.string('avatar');
  },
});

export const CourierProfileInput = inputObjectType({
  name: 'CourierProfileInput',
  definition(t) {
    t.nonNull.string('vehicleType');
    t.string('licensePlate');
    t.boolean('isAvailable', { default: true });
    t.field('currentLocation', { type: 'LocationInput' });
  },
});

export const LocationInput = inputObjectType({
  name: 'LocationInput',
  definition(t) {
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
  },
});

// Auth Response Types
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

// Queries
export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        const user = await db.select().from(users).where(eq(users.id, context.user.userId)).limit(1);
        if (!user[0]) {
          const error = new Error('User not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        return user[0];
      },
    });

    t.field('user', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        const user = await db.select().from(users).where(eq(users.id, args.id)).limit(1);
        if (!user[0]) {
          const error = new Error('User not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        return user[0];
      },
    });

    t.list.field('users', {
      type: 'User',
      args: {
        role: stringArg(),
        limit: intArg({ default: 50 }),
        offset: intArg({ default: 0 }),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        if (context.user.role !== 'admin') {
          const error = new Error('Admin access required');
          error.name = 'AuthorizationError';
          throw error;
        }
        
        const conditions = [];
        
        if (args.role) {
          conditions.push(eq(users.role, args.role as any));
        }
        
        return await db.select()
          .from(users)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .limit(args.limit || 50)
          .offset(args.offset || 0);
      },
    });
  },
});

// Mutations
export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthResponse',
      args: {
        input: nonNull('SignupInput'),
      },
      resolve: async (parent, args, context) => {
        return await AuthController.signup(args.input);
      },
    });

    t.field('login', {
      type: 'AuthResponse',
      args: {
        input: nonNull('LoginInput'),
      },
      resolve: async (parent, args, context) => {
        return await AuthController.login(args.input);
      },
    });

    t.field('loginWithGoogle', {
      type: 'AuthResponse',
      args: {
        idToken: nonNull(stringArg()),
      },
      resolve: async (parent, args, context) => {
        return await AuthController.loginWithGoogle(args.idToken);
      },
    });

    t.field('refreshToken', {
      type: 'RefreshTokenResponse',
      args: {
        refreshToken: nonNull(stringArg()),
      },
      resolve: async (parent, args, context) => {
        return await AuthController.refreshToken(args.refreshToken);
      },
    });

    t.field('logout', {
      type: 'Boolean',
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        return await AuthController.logout(context.user.userId);
      },
    });

    t.field('updateProfile', {
      type: 'User',
      args: {
        input: nonNull('UpdateProfileInput'),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        const updateData: any = {
          updatedAt: new Date(),
        };
        
        if (args.input.firstName) updateData.firstName = args.input.firstName;
        if (args.input.lastName) updateData.lastName = args.input.lastName;
        if (args.input.phone) updateData.phone = args.input.phone;
        if (args.input.avatar) updateData.avatar = args.input.avatar;
        
        await db.update(users).set(updateData).where(eq(users.id, context.user.userId));
        
        const updatedUser = await db.select().from(users).where(eq(users.id, context.user.userId)).limit(1);
        return updatedUser[0];
      },
    });

    t.field('addAddress', {
      type: 'Address',
      args: {
        input: nonNull('AddressInput'),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        // If this is set as default, unset other defaults
        if (args.input.isDefault) {
          await db.update(addresses)
            .set({ isDefault: false, updatedAt: new Date() })
            .where(and(
              eq(addresses.userId, context.user.userId),
              eq(addresses.isDefault, true)
            ));
        }
        
        const [newAddress] = await db.insert(addresses).values({
          userId: context.user.userId,
          label: args.input.label,
          street: args.input.street,
          city: args.input.city,
          state: args.input.state,
          zipCode: args.input.zipCode,
          country: args.input.country || 'US',
          latitude: args.input.latitude,
          longitude: args.input.longitude,
          isDefault: args.input.isDefault || false,
        }).returning();
        
        return newAddress;
      },
    });

    t.field('updateAddress', {
      type: 'Address',
      args: {
        id: nonNull(stringArg()),
        input: nonNull('AddressInput'),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        // Verify address belongs to user
        const existingAddress = await db.select()
          .from(addresses)
          .where(and(
            eq(addresses.id, args.id),
            eq(addresses.userId, context.user.userId)
          ))
          .limit(1);
        
        if (!existingAddress[0]) {
          const error = new Error('Address not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        // If this is set as default, unset other defaults
        if (args.input.isDefault) {
          await db.update(addresses)
            .set({ isDefault: false, updatedAt: new Date() })
            .where(and(
              eq(addresses.userId, context.user.userId),
              eq(addresses.isDefault, true)
            ));
        }
        
        const [updatedAddress] = await db.update(addresses)
          .set({
            label: args.input.label,
            street: args.input.street,
            city: args.input.city,
            state: args.input.state,
            zipCode: args.input.zipCode,
            country: args.input.country || 'US',
            latitude: args.input.latitude,
            longitude: args.input.longitude,
            isDefault: args.input.isDefault || false,
            updatedAt: new Date(),
          })
          .where(eq(addresses.id, args.id))
          .returning();
        
        return updatedAddress;
      },
    });

    t.field('deleteAddress', {
      type: 'Boolean',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        // Verify address belongs to user
        const existingAddress = await db.select()
          .from(addresses)
          .where(and(
            eq(addresses.id, args.id),
            eq(addresses.userId, context.user.userId)
          ))
          .limit(1);
        
        if (!existingAddress[0]) {
          const error = new Error('Address not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        await db.delete(addresses).where(eq(addresses.id, args.id));
        return true;
      },
    });

    t.field('updateCourierProfile', {
      type: 'CourierProfile',
      args: {
        input: nonNull('CourierProfileInput'),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        if (context.user.role !== 'courier') {
          const error = new Error('Courier access required');
          error.name = 'AuthorizationError';
          throw error;
        }
        
        const existingProfile = await db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.userId, context.user.userId))
          .limit(1);
        
        if (existingProfile[0]) {
          const [updatedProfile] = await db.update(courierProfiles)
            .set({
              vehicleType: args.input.vehicleType,
              licensePlate: args.input.licensePlate,
              isAvailable: args.input.isAvailable,
              currentLocation: args.input.currentLocation,
              updatedAt: new Date(),
            })
            .where(eq(courierProfiles.userId, context.user.userId))
            .returning();
          
          return updatedProfile;
        } else {
          const [newProfile] = await db.insert(courierProfiles).values({
            userId: context.user.userId,
            vehicleType: args.input.vehicleType,
            licensePlate: args.input.licensePlate,
            isAvailable: args.input.isAvailable,
            currentLocation: args.input.currentLocation,
          }).returning();
          
          return newProfile;
        }
      },
    });
  },
});
