import { objectType, inputObjectType, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../database/drizzle/client';
import { restaurants, addresses, users, menuCategories, menuItems, favorites } from '../database/drizzle/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

// Types
export const Restaurant = objectType({
  name: 'Restaurant',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('description');
    t.string('image');
    t.nonNull.string('cuisine');
    t.string('rating');
    t.nonNull.int('reviewCount');
    t.nonNull.int('deliveryTime');
    t.nonNull.string('deliveryFee');
    t.nonNull.string('minimumOrder');
    t.nonNull.boolean('isOpen');
    t.nonNull.boolean('isActive');
    t.nonNull.string('addressId');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.nonNull.string('ownerId');
    t.string('phone');
    t.boolean('isFavorited');

    t.field('address', {
      type: 'Address',
      resolve: async (parent) => {
        const result = await db.select()
          .from(addresses)
          .where(eq(addresses.id, parent.addressId))
          .limit(1);
        if (!result[0]) return null;
        
        const address = result[0];
        return {
          id: address.id,
          userId: address.userId,
          label: address.label,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          latitude: address.latitude,
          longitude: address.longitude,
          isDefault: address.isDefault,
          createdAt: address.createdAt instanceof Date ? address.createdAt.toISOString() : String(address.createdAt),
          updatedAt: address.updatedAt instanceof Date ? address.updatedAt.toISOString() : String(address.updatedAt),
        };
      },
    });
    
    // Relations
    t.field('owner', {
      type: 'User',
      resolve: async (parent) => {
        const result = await db.select().from(users).where(eq(users.id, parent.ownerId)).limit(1);
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
    
    t.list.field('menuCategories', {
      type: 'MenuCategory',
      resolve: async (parent) => {
        const categories = await db.select()
          .from(menuCategories)
          .where(and(
            eq(menuCategories.restaurantId, parent.id),
            eq(menuCategories.isActive, true)
          ))
          .orderBy(asc(menuCategories.sortOrder));
        
        return categories.map(category => ({
          id: category.id,
          restaurantId: category.restaurantId,
          name: category.name,
          description: category.description || null,
          sortOrder: category.sortOrder,
          isActive: category.isActive,
          createdAt: category.createdAt instanceof Date ? category.createdAt.toISOString() : String(category.createdAt),
          updatedAt: category.updatedAt instanceof Date ? category.updatedAt.toISOString() : String(category.updatedAt),
        }));
      },
    });
    
    t.list.field('menuItems', {
      type: 'MenuItem',
      args: {
        categoryId: stringArg(),
        limit: intArg({ default: 50 }),
      },
      resolve: async (parent, args) => {
        const conditions = [
          eq(menuItems.restaurantId, parent.id),
          eq(menuItems.isAvailable, true)
        ];
        
        if (args.categoryId) {
          conditions.push(eq(menuItems.categoryId, args.categoryId));
        }
        
        const items = await db.select()
          .from(menuItems)
          .where(and(...conditions))
          .orderBy(asc(menuItems.sortOrder))
          .limit(args.limit || 50);
        
        return items.map(item => ({
          id: item.id,
          restaurantId: item.restaurantId,
          categoryId: item.categoryId,
          name: item.name,
          description: item.description || null,
          image: item.image || null,
          price: String(item.price),
          isAvailable: item.isAvailable,
          sortOrder: item.sortOrder,
          createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
          updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt),
        }));
      },
    });

    t.field('isFavorited', {
      type: 'Boolean',
      resolve: async (parent, args, ctx) => {
        if (!ctx.user) {
          return false;
        }

        const favorite = await db
          .select()
          .from(favorites)
          .where(
            and(
              eq(favorites.userId, ctx.user.userId),
              eq(favorites.restaurantId, parent.id)
            )
          )
          .limit(1);

        return favorite.length > 0;
      },
    });
  },
});

// Input Types
export const CreateRestaurantInput = inputObjectType({
  name: 'CreateRestaurantInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('description');
    t.string('image');
    t.nonNull.string('cuisine');
    t.nonNull.int('deliveryTime');
    t.nonNull.string('deliveryFee');
    t.nonNull.string('minimumOrder');
    t.nonNull.field('address', { type: 'AddressInput' });
    t.string('phone');
  },
});

export const UpdateRestaurantInput = inputObjectType({
  name: 'UpdateRestaurantInput',
  definition(t) {
    t.nonNull.string('restaurantId');
    t.string('name');
    t.string('slug');
    t.string('description');
    t.string('image');
    t.string('cuisine');
    t.int('deliveryTime');
    t.string('deliveryFee');
    t.string('minimumOrder');
    t.field('address', { type: 'AddressInput' });
    t.string('phone');
    t.boolean('isOpen');
    t.boolean('isActive');
  },
});