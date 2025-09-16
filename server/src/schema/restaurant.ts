import { objectType, inputObjectType, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../db/client';
import { restaurants, addresses, users, menuCategories, menuItems } from '../db/schema';
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

    t.field('address', {
      type: 'Address',
      resolve: async (parent) => {
        const result = await db.select()
          .from(addresses)
          .where(eq(addresses.id, parent.addressId))
          .limit(1);
        return result[0] ? convertDateFields(result[0], ['createdAt', 'updatedAt']) : null;
      },
    });
    
    // Relations
    t.field('owner', {
      type: 'User',
      resolve: async (parent) => {
        const owner = await db.select().from(users).where(eq(users.id, parent.ownerId)).limit(1);
        return owner[0] ? convertDateFields(owner[0], ['createdAt', 'updatedAt']) : null;
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
        
        return categories.map(category => 
          convertDateFields(category, ['createdAt', 'updatedAt'])
        );
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
        
        return items.map(item => 
          convertDateFields(item, ['createdAt', 'updatedAt'])
        );
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