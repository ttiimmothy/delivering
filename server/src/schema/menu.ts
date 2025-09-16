import { objectType, inputObjectType, enumType, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../db/client';
import { menuCategories, menuItems, menuItemOptions, menuItemOptionValues } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { convertDateFields } from '../lib/dateHelpers';

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
      resolve: async (parent) => {
        const items = await db.select()
          .from(menuItems)
          .where(and(
            eq(menuItems.categoryId, parent.id),
            eq(menuItems.isAvailable, true)
          ))
          .orderBy(asc(menuItems.sortOrder));
        return items.map(item => convertDateFields(item, ['createdAt', 'updatedAt']));
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
    t.nonNull.string('price');
    t.string('image');
    t.nonNull.boolean('isAvailable');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    t.list.field('options', {
      type: 'MenuItemOption',
      resolve: async (parent) => {
        const options = await db.select()
          .from(menuItemOptions)
          .where(eq(menuItemOptions.menuItemId, parent.id))
          .orderBy(asc(menuItemOptions.sortOrder));
        return options.map(option => convertDateFields(option, ['createdAt', 'updatedAt']));
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
    t.nonNull.string('updatedAt');
    t.list.field('values', {
      type: 'MenuItemOptionValue',
      resolve: async (parent) => {
        const values = await db.select()
          .from(menuItemOptionValues)
          .where(eq(menuItemOptionValues.optionId, parent.id))
          .orderBy(asc(menuItemOptionValues.sortOrder));
        return values.map(value => convertDateFields(value, ['createdAt', 'updatedAt']));
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
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
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
    t.boolean('isActive');
  },
});

export const UpdateMenuCategoryInput = inputObjectType({
  name: 'UpdateMenuCategoryInput',
  definition(t) {
    t.nonNull.string('categoryId');
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
    t.nonNull.string('price');
    t.string('image');
    t.boolean('isAvailable');
    t.int('sortOrder');
  },
});

export const UpdateMenuItemInput = inputObjectType({
  name: 'UpdateMenuItemInput',
  definition(t) {
    t.nonNull.string('menuItemId');
    t.string('name');
    t.string('description');
    t.string('price');
    t.string('image');
    t.boolean('isAvailable');
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
    t.nonNull.string('price');
    t.int('sortOrder');
  },
});