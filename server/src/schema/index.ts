import { makeSchema } from 'nexus';
import { join } from 'path';

// Import all schema modules
import * as UserSchema from './user';
import * as RestaurantSchema from './restaurant';
// import * as MenuSchema from './menu';
// import * as CartSchema from './cart';
// import * as OrderSchema from './order';
// import * as DeliverySchema from './delivery';
// import * as ReviewSchema from './review';
// import * as PayoutSchema from './payout';

// Create the GraphQL schema
export const schema = makeSchema({
  types: [
    // User schema
    UserSchema.User,
    UserSchema.Address,
    UserSchema.CourierProfile,
    UserSchema.Location,
    UserSchema.UserRole,
    UserSchema.SignupInput,
    UserSchema.LoginInput,
    UserSchema.AddressInput,
    UserSchema.UpdateProfileInput,
    UserSchema.CourierProfileInput,
    UserSchema.LocationInput,
    UserSchema.AuthResponse,
    UserSchema.RefreshTokenResponse,
    UserSchema.UserQueries,
    UserSchema.UserMutations,
    
    // Restaurant schema
    RestaurantSchema.Restaurant,
    RestaurantSchema.RestaurantAddress,
    RestaurantSchema.MenuCategory,
    RestaurantSchema.MenuItem,
    RestaurantSchema.MenuItemOption,
    RestaurantSchema.MenuItemOptionValue,
    RestaurantSchema.CreateRestaurantInput,
    RestaurantSchema.UpdateRestaurantInput,
    RestaurantSchema.RestaurantAddressInput,
    RestaurantSchema.CreateMenuCategoryInput,
    RestaurantSchema.UpdateMenuCategoryInput,
    RestaurantSchema.CreateMenuItemInput,
    RestaurantSchema.UpdateMenuItemInput,
    RestaurantSchema.RestaurantQueries,
    RestaurantSchema.RestaurantMutations,
  ],
  
  outputs: {
    schema: join(process.cwd(), 'generated', 'schema.graphql'),
    typegen: join(process.cwd(), 'generated', 'nexus-typegen.ts'),
  },
  
  contextType: {
    module: join(process.cwd(), 'src', 'context.ts'),
    export: 'Context',
  },
  
  sourceTypes: {
    modules: [
      {
        module: join(process.cwd(), 'src', 'db', 'client.ts'),
        alias: 'db',
      },
    ],
  },
  
  features: {
    abstractTypeStrategies: {
      resolveType: true,
    },
  },
});

export default schema;
