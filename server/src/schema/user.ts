import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../database/drizzle/client';
import { users, addresses, courierProfiles } from '../database/drizzle/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

// Enums
export const UserRole = enumType({
  name: 'UserRole',
  members: ['customer', 'restaurant', 'courier', 'admin'],
});

// Types
export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('email');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.string('phone');
    t.string("avatar");
    t.nonNull.field('role', { type: 'UserRole' });
    t.nonNull.boolean("emailVerified")
    t.nonNull.boolean('isActive');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.field('courierProfile', {
      type: 'CourierProfile',
      resolve: async (parent) => {
        if (parent.role !== 'courier') return null;
        const result = await db.select()
          .from(courierProfiles)
          .where(eq(courierProfiles.userId, parent.id))
          .limit(1);
        if (!result[0]) return null;
        
        const profile = result[0];
        return {
          id: profile.id,
          userId: profile.userId,
          vehicleType: profile.vehicleType as "bike" | "car" | "motorcycle",
          licensePlate: profile.licensePlate || null,
          isAvailable: profile.isAvailable,
          currentLocation: profile.currentLocation,
          rating: parseFloat(profile.rating),
          reviewCount: profile.reviewCount,
          totalDeliveries: profile.totalDeliveries,
          createdAt: profile.createdAt instanceof Date ? profile.createdAt.toISOString() : String(profile.createdAt),
          updatedAt: profile.updatedAt instanceof Date ? profile.updatedAt.toISOString() : String(profile.updatedAt),
        };
      },
    });
  },
});

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('userId');
    t.nonNull.string('street');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('zipCode');
    t.nonNull.string('country');
    t.string("latitude");
    t.string("longitude");
    t.nonNull.boolean('isDefault');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.field('user', {
      type: 'User',
      resolve: async (parent) => {
        const result = await db.select()
          .from(users)
          .where(eq(users.id, parent.userId))
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
      resolve: (parent: any) => {
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

export const VehicleType = enumType({
  name: 'VehicleType',
  members: ['bike', 'car', 'motorcycle'],
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

// Input Types
export const SignupInput = inputObjectType({
  name: 'SignupInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.string('phone');
    t.nonNull.field('role', { type: 'UserRole' });
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
    t.nonNull.string('street');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('zipCode');
    t.nonNull.string('country');
    t.boolean('isDefault');
  },
});

export const UpdateProfileInput = inputObjectType({
  name: 'UpdateProfileInput',
  definition(t) {
    t.string('firstName');
    t.string('lastName');
    t.string('phone');
  },
});

export const CourierProfileInput = inputObjectType({
  name: 'CourierProfileInput',
  definition(t) {
    t.nonNull.field('vehicleType', { type: 'VehicleType' });
    t.string('licensePlate');
    t.boolean('isAvailable', { default: true });
    t.field('currentLocation', { type: 'LocationInput' });
  },
});

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
    t.field('vehicleType', { type: 'VehicleType' });
    t.string('licensePlate');
    t.boolean('isAvailable');
    t.field('currentLocation', { type: 'LocationInput' });
  },
});