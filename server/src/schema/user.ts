import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../db/client';
import { users, addresses, courierProfiles } from '../db/schema';
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
    t.nonNull.field('role', { type: 'UserRole' });
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
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
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
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
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
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
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