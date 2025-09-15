import { objectType, inputObjectType, enumType, queryField, mutationField, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../db/client';
import { menuCategories, menuItems, menuItemOptions, menuItemOptionValues } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

// Enums
export const MenuItemOptionType = enumType({
  name: 'MenuItemOptionType',
  members: ['single', 'multiple'],
});

// Types
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
      resolve: async (parent, args, ctx) => {
        return await db.select()
          .from(menuItems)
          .where(and(
            eq(menuItems.categoryId, parent.id),
            eq(menuItems.isAvailable, true)
          ))
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
    t.nonNull.string('price');
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
    t.nonNull.field('type', { type: 'MenuItemOptionType' });
    t.nonNull.boolean('isRequired');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
    t.list.field('values', {
      type: 'MenuItemOptionValue',
      resolve: async (parent) => {
        return await db.select()
          .from(menuItemOptionValues)
          .where(eq(menuItemOptionValues.optionId, parent.id))
          .orderBy(asc(menuItemOptionValues.sortOrder));
      },
    });
  },
});

export const MenuItemOptionValue = objectType({
  name: 'MenuItemOptionValue',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('optionId');
    t.nonNull.string('name');
    t.nonNull.string('price');
    t.nonNull.boolean('isDefault');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
  },
});

// Input Types
export const CreateMenuCategoryInput = inputObjectType({
  name: 'CreateMenuCategoryInput',
  definition(t) {
    t.nonNull.string('restaurantId');
    t.nonNull.string('name');
    t.string('description');
    t.int('sortOrder');
  },
});

export const UpdateMenuCategoryInput = inputObjectType({
  name: 'UpdateMenuCategoryInput',
  definition(t) {
    t.nonNull.string('id');
    t.string('name');
    t.string('description');
    t.int('sortOrder');
    t.boolean('isActive');
  },
});

export const CreateMenuItemInput = inputObjectType({
  name: 'CreateMenuItemInput',
  definition(t) {
    t.nonNull.string('restaurantId');
    t.nonNull.string('categoryId');
    t.nonNull.string('name');
    t.string('description');
    t.string('image');
    t.nonNull.string('price');
    t.boolean('isAvailable');
    t.boolean('isPopular');
    t.int('sortOrder');
  },
});

export const UpdateMenuItemInput = inputObjectType({
  name: 'UpdateMenuItemInput',
  definition(t) {
    t.nonNull.string('id');
    t.string('name');
    t.string('description');
    t.string('image');
    t.string('price');
    t.boolean('isAvailable');
    t.boolean('isPopular');
    t.int('sortOrder');
  },
});

export const CreateMenuItemOptionInput = inputObjectType({
  name: 'CreateMenuItemOptionInput',
  definition(t) {
    t.nonNull.string('menuItemId');
    t.nonNull.string('name');
    t.nonNull.field('type', { type: 'MenuItemOptionType' });
    t.boolean('isRequired');
    t.int('sortOrder');
  },
});

export const CreateMenuItemOptionValueInput = inputObjectType({
  name: 'CreateMenuItemOptionValueInput',
  definition(t) {
    t.nonNull.string('optionId');
    t.nonNull.string('name');
    t.string('price');
    t.boolean('isDefault');
    t.int('sortOrder');
  },
});

// Queries
export const MenuQueries = queryField('menu', {
  type: 'Query',
  definition(t) {
    t.list.field('menuCategories', {
      type: 'MenuCategory',
      args: {
        restaurantId: nonNull(stringArg()),
        isActive: booleanArg(),
      },
      resolve: async (_, args) => {
        const conditions = [eq(menuCategories.restaurantId, args.restaurantId)];
        if (args.isActive !== undefined) {
          conditions.push(eq(menuCategories.isActive, args.isActive));
        }
        
        return await db.select()
          .from(menuCategories)
          .where(and(...conditions))
          .orderBy(asc(menuCategories.sortOrder));
      },
    });

    t.list.field('menuItems', {
      type: 'MenuItem',
      args: {
        restaurantId: nonNull(stringArg()),
        categoryId: stringArg(),
        isAvailable: booleanArg(),
        isPopular: booleanArg(),
        limit: intArg(),
        offset: intArg(),
      },
      resolve: async (_, args) => {
        const conditions = [eq(menuItems.restaurantId, args.restaurantId)];
        
        if (args.categoryId) {
          conditions.push(eq(menuItems.categoryId, args.categoryId));
        }
        if (args.isAvailable !== undefined) {
          conditions.push(eq(menuItems.isAvailable, args.isAvailable));
        }
        if (args.isPopular !== undefined) {
          conditions.push(eq(menuItems.isPopular, args.isPopular));
        }

        let query = db.select()
          .from(menuItems)
          .where(and(...conditions))
          .orderBy(asc(menuItems.sortOrder));

        if (args.limit) {
          query = query.limit(args.limit);
        }
        if (args.offset) {
          query = query.offset(args.offset);
        }

        return await query;
      },
    });

    t.field('menuItem', {
      type: 'MenuItem',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, args) => {
        const result = await db.select()
          .from(menuItems)
          .where(eq(menuItems.id, args.id))
          .limit(1);
        
        if (result.length === 0) {
          const error = new Error('Menu item not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        return result[0];
      },
    });
  },
});

// Mutations
export const MenuMutations = mutationField('menu', {
  type: 'Mutation',
  definition(t) {
    t.field('createMenuCategory', {
      type: 'MenuCategory',
      args: {
        input: nonNull(arg({ type: 'CreateMenuCategoryInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'merchant' && ctx.user.role !== 'admin') {
          const error = new Error('Access denied. Merchant role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        const result = await db.insert(menuCategories).values({
          restaurantId: args.input.restaurantId,
          name: args.input.name,
          description: args.input.description,
          sortOrder: args.input.sortOrder || 0,
        }).returning();

        return result[0];
      },
    });

    t.field('updateMenuCategory', {
      type: 'MenuCategory',
      args: {
        input: nonNull(arg({ type: 'UpdateMenuCategoryInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'merchant' && ctx.user.role !== 'admin') {
          const error = new Error('Access denied. Merchant role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        const updateData: any = {};
        if (args.input.name !== undefined) updateData.name = args.input.name;
        if (args.input.description !== undefined) updateData.description = args.input.description;
        if (args.input.sortOrder !== undefined) updateData.sortOrder = args.input.sortOrder;
        if (args.input.isActive !== undefined) updateData.isActive = args.input.isActive;

        const result = await db.update(menuCategories)
          .set(updateData)
          .where(eq(menuCategories.id, args.input.id))
          .returning();

        if (result.length === 0) {
          const error = new Error('Menu category not found');
          error.name = 'NotFoundError';
          throw error;
        }

        return result[0];
      },
    });

    t.field('createMenuItem', {
      type: 'MenuItem',
      args: {
        input: nonNull(arg({ type: 'CreateMenuItemInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'merchant' && ctx.user.role !== 'admin') {
          const error = new Error('Access denied. Merchant role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        const result = await db.insert(menuItems).values({
          restaurantId: args.input.restaurantId,
          categoryId: args.input.categoryId,
          name: args.input.name,
          description: args.input.description,
          image: args.input.image,
          price: args.input.price,
          isAvailable: args.input.isAvailable ?? true,
          isPopular: args.input.isPopular ?? false,
          sortOrder: args.input.sortOrder || 0,
        }).returning();

        return result[0];
      },
    });

    t.field('updateMenuItem', {
      type: 'MenuItem',
      args: {
        input: nonNull(arg({ type: 'UpdateMenuItemInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'merchant' && ctx.user.role !== 'admin') {
          const error = new Error('Access denied. Merchant role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        const updateData: any = {};
        if (args.input.name !== undefined) updateData.name = args.input.name;
        if (args.input.description !== undefined) updateData.description = args.input.description;
        if (args.input.image !== undefined) updateData.image = args.input.image;
        if (args.input.price !== undefined) updateData.price = args.input.price;
        if (args.input.isAvailable !== undefined) updateData.isAvailable = args.input.isAvailable;
        if (args.input.isPopular !== undefined) updateData.isPopular = args.input.isPopular;
        if (args.input.sortOrder !== undefined) updateData.sortOrder = args.input.sortOrder;

        const result = await db.update(menuItems)
          .set(updateData)
          .where(eq(menuItems.id, args.input.id))
          .returning();

        if (result.length === 0) {
          const error = new Error('Menu item not found');
          error.name = 'NotFoundError';
          throw error;
        }

        return result[0];
      },
    });

    t.field('createMenuItemOption', {
      type: 'MenuItemOption',
      args: {
        input: nonNull(arg({ type: 'CreateMenuItemOptionInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'merchant' && ctx.user.role !== 'admin') {
          const error = new Error('Access denied. Merchant role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        const result = await db.insert(menuItemOptions).values({
          menuItemId: args.input.menuItemId,
          name: args.input.name,
          type: args.input.type,
          isRequired: args.input.isRequired ?? false,
          sortOrder: args.input.sortOrder || 0,
        }).returning();

        return result[0];
      },
    });

    t.field('createMenuItemOptionValue', {
      type: 'MenuItemOptionValue',
      args: {
        input: nonNull(arg({ type: 'CreateMenuItemOptionValueInput' })),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }

        if (ctx.user.role !== 'merchant' && ctx.user.role !== 'admin') {
          const error = new Error('Access denied. Merchant role required');
          error.name = 'AuthorizationError';
          throw error;
        }

        const result = await db.insert(menuItemOptionValues).values({
          optionId: args.input.optionId,
          name: args.input.name,
          price: args.input.price || '0.00',
          isDefault: args.input.isDefault ?? false,
          sortOrder: args.input.sortOrder || 0,
        }).returning();

        return result[0];
      },
    });
  },
});
