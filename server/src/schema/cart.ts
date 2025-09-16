import { objectType, inputObjectType, nonNull, stringArg, arg } from 'nexus';
import { db } from '../db/client';
import { carts, cartItems, menuItems } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

// Types
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
        const items = await db.select()
          .from(cartItems)
          .where(eq(cartItems.cartId, parent.id));
        return items.map(item => ({
          id: item.id,
          cartId: item.cartId,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          selectedOptions: String(item.selectedOptions || '[]'),
          specialInstructions: item.specialInstructions || null,
          createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
          updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt),
        }));
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
        if (!result[0]) return null;
        
        const menuItem = result[0];
        return {
          ...menuItem,
          createdAt: menuItem.createdAt instanceof Date ? menuItem.createdAt.toISOString() : String(menuItem.createdAt),
          updatedAt: menuItem.updatedAt instanceof Date ? menuItem.updatedAt.toISOString() : String(menuItem.updatedAt),
        };
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