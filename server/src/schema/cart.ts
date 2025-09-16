import { objectType, inputObjectType, nonNull, stringArg, arg } from 'nexus';
import { db } from '../db/client';
import { carts, cartItems, menuItems } from '../db/schema';
import { eq, and } from 'drizzle-orm';

// Types
export const Cart = objectType({
  name: 'Cart',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('userId');
    t.nonNull.string('restaurantId');
    t.nonNull.string('createdAt', {
      resolve: (parent) => (parent.createdAt as any) instanceof Date ? (parent.createdAt as any as Date).toISOString() : parent.createdAt
    });
    t.nonNull.string('updatedAt', {
      resolve: (parent) => (parent.updatedAt as any) instanceof Date ? (parent.updatedAt as any as Date).toISOString() : parent.updatedAt
    });
    t.list.field('items', {
      type: 'CartItem',
      resolve: async (parent) => {
        return await db.select()
          .from(cartItems)
          .where(eq(cartItems.cartId, parent.id));
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
    t.nonNull.string('createdAt', {
      resolve: (parent) => (parent.createdAt as any) instanceof Date ? (parent.createdAt as any as Date).toISOString() : parent.createdAt
    });
    t.nonNull.string('updatedAt', {
      resolve: (parent) => (parent.updatedAt as any) instanceof Date ? (parent.updatedAt as any as Date).toISOString() : parent.updatedAt
    });
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

// Input Types
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