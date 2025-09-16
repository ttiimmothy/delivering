import { objectType, inputObjectType, extendType, nonNull, stringArg, intArg, booleanArg, floatArg } from 'nexus';
import { db } from '../db/client';
import { restaurants, menuCategories, menuItems, menuItemOptions, menuItemOptionValues, users, favorites } from '../db/schema';
import { convertDateFields } from '../lib/dateHelpers';
import { eq, and, desc, asc, like, sql } from 'drizzle-orm';
// Removed custom error imports - using standard Error instead

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
    t.nonNull.field('address', { type: 'RestaurantAddress' });
    t.string('phone');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    
    // Relations
    t.field('owner', {
      type: 'User',
      resolve: async (parent) => {
        const owner = await db.select().from(users).where(eq(users.id, parent.ownerId)).limit(1);
        return owner[0] || null;
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
        
        return await db.select()
          .from(menuItems)
          .where(and(...conditions))
          .orderBy(asc(menuItems.sortOrder))
          .limit(args.limit || 50);
      },
    });
    
    t.boolean('isFavorite', {
      resolve: async (parent, args, context) => {
        if (!context.user) return false;
        
        const favorite = await db.select()
          .from(favorites)
          .where(and(
            eq(favorites.userId, context.user.userId),
            eq(favorites.restaurantId, parent.id)
          ))
          .limit(1);
        
        return favorite.length > 0;
      },
    });
  },
});

export const RestaurantAddress = objectType({
  name: 'RestaurantAddress',
  definition(t) {
    t.nonNull.string('street');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('zipCode');
    t.field('coordinates', { type: 'Location' });
  },
});

export const MenuCategory = objectType({
  name: 'MenuCategory',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.int('sortOrder');
    t.nonNull.boolean('isActive');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    
    // Relations
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
        
        return items.map(item => 
          convertDateFields(item, ['createdAt', 'updatedAt'])
        );
      },
    });
  },
});

export const MenuItem = objectType({
  name: 'MenuItem',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.string('description');
    t.string('image');
    t.nonNull.string('price');
    t.nonNull.boolean('isAvailable');
    t.nonNull.boolean('isPopular');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
    
    // Relations
    t.field('category', {
      type: 'MenuCategory',
      resolve: async (parent) => {
        const category = await db.select()
          .from(menuCategories)
          .where(eq(menuCategories.id, parent.categoryId))
          .limit(1);
        return category[0] || null;
      },
    });
    
    t.list.field('options', {
      type: 'MenuItemOption',
      resolve: async (parent) => {
        const options = await db.select()
          .from(menuItemOptions)
          .where(eq(menuItemOptions.menuItemId, parent.id))
          .orderBy(asc(menuItemOptions.sortOrder));
        
        return options.map(option => 
          convertDateFields(option, ['createdAt'])
        );
      },
    });
  },
});

export const MenuItemOption = objectType({
  name: 'MenuItemOption',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.nonNull.string('type');
    t.nonNull.boolean('isRequired');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
    
    // Relations
    t.list.field('values', {
      type: 'OptionValue',
      resolve: async (parent) => {
        const values = await db.select()
          .from(menuItemOptionValues)
          .where(eq(menuItemOptionValues.optionId, parent.id))
          .orderBy(asc(menuItemOptionValues.sortOrder));
        
        return values.map(value => 
          convertDateFields(value, ['createdAt'])
        );
      },
    });
  },
});

export const MenuItemOptionValue = objectType({
  name: 'MenuItemOptionValue',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.nonNull.string('price');
    t.nonNull.boolean('isDefault');
    t.nonNull.int('sortOrder');
    t.nonNull.string('createdAt');
  },
});

// Input Types
export const CreateRestaurantInput = inputObjectType({
  name: 'CreateRestaurantInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('description');
    t.string('image');
    t.nonNull.string('cuisine');
    t.nonNull.int('deliveryTime');
    t.nonNull.string('deliveryFee');
    t.nonNull.string('minimumOrder');
    t.nonNull.field('address', { type: 'RestaurantAddressInput' });
    t.string('phone');
  },
});

export const UpdateRestaurantInput = inputObjectType({
  name: 'UpdateRestaurantInput',
  definition(t) {
    t.string('name');
    t.string('description');
    t.string('image');
    t.string('cuisine');
    t.int('deliveryTime');
    t.string('deliveryFee');
    t.string('minimumOrder');
    t.field('address', { type: 'RestaurantAddressInput' });
    t.string('phone');
    t.boolean('isOpen');
    t.boolean('isActive');
  },
});

export const RestaurantAddressInput = inputObjectType({
  name: 'RestaurantAddressInput',
  definition(t) {
    t.nonNull.string('street');
    t.nonNull.string('city');
    t.nonNull.string('state');
    t.nonNull.string('zipCode');
    t.field('coordinates', { type: 'LocationInput' });
  },
});

export const LocationInput = inputObjectType({
  name: 'LocationInput',
  definition(t) {
    t.nonNull.float('latitude');
    t.nonNull.float('longitude');
  },
});

export const CreateMenuCategoryInput = inputObjectType({
  name: 'CreateMenuCategoryInput',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
    t.int('sortOrder', { default: 0 });
  },
});

export const UpdateMenuCategoryInput = inputObjectType({
  name: 'UpdateMenuCategoryInput',
  definition(t) {
    t.string('name');
    t.string('description');
    t.int('sortOrder');
    t.boolean('isActive');
  },
});

export const CreateMenuItemInput = inputObjectType({
  name: 'CreateMenuItemInput',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
    t.string('image');
    t.nonNull.string('price');
    t.boolean('isAvailable', { default: true });
    t.boolean('isPopular', { default: false });
    t.int('sortOrder', { default: 0 });
  },
});

export const UpdateMenuItemInput = inputObjectType({
  name: 'UpdateMenuItemInput',
  definition(t) {
    t.string('name');
    t.string('description');
    t.string('image');
    t.string('price');
    t.boolean('isAvailable');
    t.boolean('isPopular');
    t.int('sortOrder');
  },
});

// Queries
export const RestaurantQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('restaurants', {
      type: 'Restaurant',
      args: {
        cuisine: stringArg(),
        isOpen: booleanArg(),
        limit: intArg({ default: 20 }),
        offset: intArg({ default: 0 }),
        search: stringArg(),
        sortBy: stringArg({ default: 'rating' }),
        sortOrder: stringArg({ default: 'desc' }),
      },
      resolve: async (parent, args) => {
        let conditions = [eq(restaurants.isActive, true)];
        
        if (args.cuisine) {
          conditions.push(eq(restaurants.cuisine, args.cuisine));
        }
        
        if (args.isOpen !== undefined) {
          conditions.push(eq(restaurants.isOpen, args.isOpen));
        }
        
        if (args.search) {
          conditions.push(like(restaurants.name, `%${args.search}%`));
        }
        
        // Apply sorting
        let orderByClause;
        if (args.sortBy === 'rating') {
          orderByClause = args.sortOrder === 'desc' ? desc(restaurants.rating) : asc(restaurants.rating);
        } else if (args.sortBy === 'deliveryTime') {
          orderByClause = args.sortOrder === 'desc' ? desc(restaurants.deliveryTime) : asc(restaurants.deliveryTime);
        } else if (args.sortBy === 'name') {
          orderByClause = args.sortOrder === 'desc' ? desc(restaurants.name) : asc(restaurants.name);
        } else {
          orderByClause = desc(restaurants.createdAt);
        }
        
        const results = await db.select()
          .from(restaurants)
          .where(and(...conditions))
          .orderBy(orderByClause)
          .limit(args.limit || 20)
          .offset(args.offset || 0);
        
        // Convert Date objects to ISO strings
        return results.map(restaurant => 
          convertDateFields(restaurant, ['createdAt', 'updatedAt'])
        );
      },
    });

    t.field('restaurant', {
      type: 'Restaurant',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (parent, args) => {
        const restaurant = await db.select()
          .from(restaurants)
          .where(and(
            eq(restaurants.slug, args.slug),
            eq(restaurants.isActive, true)
          ))
          .limit(1);
        
        if (!restaurant[0]) {
          const error = new Error('Restaurant not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        // Convert Date objects to ISO strings
        return convertDateFields(restaurant[0], ['createdAt', 'updatedAt']);
      },
    });

    t.list.field('myRestaurants', {
      type: 'Restaurant',
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        if (context.user.role !== 'merchant') {
          const error = new Error('Merchant access required');
          error.name = 'AuthorizationError';
          throw error;
        }
        
        return await db.select()
          .from(restaurants)
          .where(eq(restaurants.ownerId, context.user.userId))
          .orderBy(desc(restaurants.createdAt));
      },
    });

    t.list.field('favoriteRestaurants', {
      type: 'Restaurant',
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        return await db.select()
          .from(restaurants)
          .innerJoin(favorites, eq(favorites.restaurantId, restaurants.id))
          .where(and(
            eq(favorites.userId, context.user.userId),
            eq(restaurants.isActive, true)
          ))
          .orderBy(desc(favorites.createdAt));
      },
    });
  },
});

// Mutations
export const RestaurantMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createRestaurant', {
      type: 'Restaurant',
      args: {
        input: nonNull('CreateRestaurantInput'),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        if (context.user.role !== 'merchant') {
          const error = new Error('Merchant access required');
          error.name = 'AuthorizationError';
          throw error;
        }
        
        // Generate slug from name
        const slug = args.input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        // Check if slug already exists
        const existingRestaurant = await db.select()
          .from(restaurants)
          .where(eq(restaurants.slug, slug))
          .limit(1);
        
        if (existingRestaurant[0]) {
          throw new Error('Restaurant with this name already exists');
        }
        
        const [newRestaurant] = await db.insert(restaurants).values({
          ownerId: context.user.userId,
          name: args.input.name,
          slug,
          description: args.input.description,
          image: args.input.image,
          cuisine: args.input.cuisine,
          deliveryTime: args.input.deliveryTime,
          deliveryFee: args.input.deliveryFee,
          minimumOrder: args.input.minimumOrder,
          address: args.input.address,
          phone: args.input.phone,
        }).returning();
        
        return newRestaurant;
      },
    });

    t.field('updateRestaurant', {
      type: 'Restaurant',
      args: {
        id: nonNull(stringArg()),
        input: nonNull('UpdateRestaurantInput'),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        // Verify restaurant ownership
        const existingRestaurant = await db.select()
          .from(restaurants)
          .where(and(
            eq(restaurants.id, args.id),
            eq(restaurants.ownerId, context.user.userId)
          ))
          .limit(1);
        
        if (!existingRestaurant[0]) {
          const error = new Error('Restaurant not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        const updateData: any = {
          updatedAt: new Date(),
        };
        
        if (args.input.name) updateData.name = args.input.name;
        if (args.input.description) updateData.description = args.input.description;
        if (args.input.image) updateData.image = args.input.image;
        if (args.input.cuisine) updateData.cuisine = args.input.cuisine;
        if (args.input.deliveryTime) updateData.deliveryTime = args.input.deliveryTime;
        if (args.input.deliveryFee) updateData.deliveryFee = args.input.deliveryFee;
        if (args.input.minimumOrder) updateData.minimumOrder = args.input.minimumOrder;
        if (args.input.address) updateData.address = args.input.address;
        if (args.input.phone) updateData.phone = args.input.phone;
        if (args.input.isOpen !== undefined) updateData.isOpen = args.input.isOpen;
        if (args.input.isActive !== undefined) updateData.isActive = args.input.isActive;
        
        const [updatedRestaurant] = await db.update(restaurants)
          .set(updateData)
          .where(eq(restaurants.id, args.id))
          .returning();
        
        return updatedRestaurant;
      },
    });

    t.field('setRestaurantOpen', {
      type: 'Restaurant',
      args: {
        id: nonNull(stringArg()),
        isOpen: nonNull(booleanArg()),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        // Verify restaurant ownership
        const existingRestaurant = await db.select()
          .from(restaurants)
          .where(and(
            eq(restaurants.id, args.id),
            eq(restaurants.ownerId, context.user.userId)
          ))
          .limit(1);
        
        if (!existingRestaurant[0]) {
          const error = new Error('Restaurant not found');
          error.name = 'NotFoundError';
          throw error;
        }
        
        const [updatedRestaurant] = await db.update(restaurants)
          .set({
            isOpen: args.isOpen,
            updatedAt: new Date(),
          })
          .where(eq(restaurants.id, args.id))
          .returning();
        
        return updatedRestaurant;
      },
    });

    t.field('toggleFavorite', {
      type: 'Boolean',
      args: {
        restaurantId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context) => {
        if (!context.user) {
          const error = new Error('Authentication required');
          error.name = 'AuthenticationError';
          throw error;
        }
        
        // Check if already favorited
        const existingFavorite = await db.select()
          .from(favorites)
          .where(and(
            eq(favorites.userId, context.user.userId),
            eq(favorites.restaurantId, args.restaurantId)
          ))
          .limit(1);
        
        if (existingFavorite[0]) {
          // Remove from favorites
          await db.delete(favorites)
            .where(and(
              eq(favorites.userId, context.user.userId),
              eq(favorites.restaurantId, args.restaurantId)
            ));
          return false;
        } else {
          // Add to favorites
          await db.insert(favorites).values({
            userId: context.user.userId,
            restaurantId: args.restaurantId,
          });
          return true;
        }
      },
    });
  },
});
