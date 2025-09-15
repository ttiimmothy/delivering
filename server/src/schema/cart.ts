import { objectType, inputObjectType, queryField, mutationField, nonNull, stringArg, arg } from 'nexus';
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

// Queries
export const cart = queryField('cart', {
  type: 'Cart',
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Get user's cart
    const cartResult = await db.select()
      .from(carts)
      .where(eq(carts.userId, ctx.user.id))
      .limit(1);

    if (cartResult.length === 0) {
      return null;
    }

    return cartResult[0];
  },
});

// Mutations
export const addToCart = mutationField('addToCart', {
  type: 'CartItem',
  args: {
    input: nonNull(arg({ type: 'AddToCartInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Get or create cart
    let cartResult = await db.select()
      .from(carts)
      .where(eq(carts.userId, ctx.user.id))
      .limit(1);

    if (cartResult.length === 0) {
      // We need to get the restaurant ID from the menu item
      const menuItemResult = await db.select()
        .from(menuItems)
        .where(eq(menuItems.id, args.input.menuItemId))
        .limit(1);
      
      if (menuItemResult.length === 0) {
        throw new Error('Menu item not found');
      }

      const newCart = await db.insert(carts).values({
        userId: ctx.user.id,
        restaurantId: menuItemResult[0].restaurantId,
      }).returning();
      cartResult = newCart;
    }

    // Check if item already exists in cart
    const existingItem = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.cartId, cartResult[0].id),
        eq(cartItems.menuItemId, args.input.menuItemId),
        eq(cartItems.selectedOptions, args.input.selectedOptions || '[]')
      ))
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const result = await db.update(cartItems)
        .set({
          quantity: existingItem[0].quantity + args.input.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      return result[0];
    } else {
      // Add new item
      const result = await db.insert(cartItems).values({
        cartId: cartResult[0].id,
        menuItemId: args.input.menuItemId,
        quantity: args.input.quantity,
        selectedOptions: args.input.selectedOptions || '[]',
        specialInstructions: args.input.specialInstructions || '',
      }).returning();
      return result[0];
    }
  },
});

export const updateCartItem = mutationField('updateCartItem', {
  type: 'CartItem',
  args: {
    input: nonNull(arg({ type: 'UpdateCartItemInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (args.input.quantity !== undefined) {
      updateData.quantity = args.input.quantity;
    }
    if (args.input.selectedOptions !== undefined) {
      updateData.selectedOptions = args.input.selectedOptions;
    }
    if (args.input.specialInstructions !== undefined) {
      updateData.specialInstructions = args.input.specialInstructions;
    }

    const result = await db.update(cartItems)
      .set(updateData)
      .where(eq(cartItems.id, args.input.cartItemId))
      .returning();

    return result[0];
  },
});

export const removeFromCart = mutationField('removeFromCart', {
  type: 'Boolean',
  args: {
    input: nonNull(arg({ type: 'RemoveFromCartInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    await db.delete(cartItems)
      .where(eq(cartItems.id, args.input.cartItemId));

    return true;
  },
});

export const clearCart = mutationField('clearCart', {
  type: 'Boolean',
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Get user's cart
    const cartResult = await db.select()
      .from(carts)
      .where(eq(carts.userId, ctx.user.id))
      .limit(1);

    if (cartResult.length > 0) {
      // Delete all cart items
      await db.delete(cartItems)
        .where(eq(cartItems.cartId, cartResult[0].id));
    }

    return true;
  },
});