import { pgTable, text, timestamp, uuid, boolean, integer, decimal, json, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'courier', 'merchant', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled']);
export const deliveryStatusEnum = pgEnum('delivery_status', ['assigned', 'accepted', 'picked_up', 'delivered']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password'), // null for OAuth users
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').notNull().default('customer'),
  avatar: text('avatar'),
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  googleId: text('google_id').unique(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('users_email_idx').on(table.email),
  index('users_google_id_idx').on(table.googleId),
]);

// Addresses table
export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  label: text('label').notNull(), // "Home", "Work", etc.
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  country: text('country').notNull().default('US'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Restaurants table
export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  cuisine: text('cuisine').notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  reviewCount: integer('review_count').notNull().default(0),
  deliveryTime: integer('delivery_time').notNull().default(30), // minutes
  deliveryFee: decimal('delivery_fee', { precision: 8, scale: 2 }).notNull().default('2.99'),
  minimumOrder: decimal('minimum_order', { precision: 8, scale: 2 }).notNull().default('10.00'),
  isOpen: boolean('is_open').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  addressId: uuid('address_id').notNull().references(() => addresses.id, { onDelete: 'cascade' }),
  phone: text('phone'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('restaurants_slug_idx').on(table.slug),
  index('restaurants_owner_idx').on(table.ownerId),
  index('restaurants_address_idx').on(table.addressId),
]);

// Menu Categories table
export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Menu Items table
export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => menuCategories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  price: decimal('price', { precision: 8, scale: 2 }).notNull(),
  isAvailable: boolean('is_available').notNull().default(true),
  isPopular: boolean('is_popular').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Menu Item Options table
export const menuItemOptions = pgTable('menu_item_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuItemId: uuid('menu_item_id').notNull().references(() => menuItems.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // "single", "multiple"
  isRequired: boolean('is_required').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Menu Item Option Values table
export const menuItemOptionValues = pgTable('menu_item_option_values', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionId: uuid('option_id').notNull().references(() => menuItemOptions.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: decimal('price', { precision: 8, scale: 2 }).notNull().default('0.00'),
  isDefault: boolean('is_default').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Cart table
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('carts_user_idx').on(table.userId),
]);

// Cart Items table
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id').notNull().references(() => menuItems.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  selectedOptions: json('selected_options').notNull().default('[]'), // [{ optionId, valueId }]
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(),
  customerId: uuid('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  courierId: uuid('courier_id').references(() => users.id, { onDelete: 'set null' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull(),
  tip: decimal('tip', { precision: 10, scale: 2 }).notNull().default('0.00'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: json('delivery_address').notNull(),
  specialInstructions: text('special_instructions'),
  estimatedDeliveryTime: timestamp('estimated_delivery_time'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeSessionId: text('stripe_session_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('orders_order_number_idx').on(table.orderNumber),
  index('orders_customer_idx').on(table.customerId),
  index('orders_restaurant_idx').on(table.restaurantId),
  index('orders_courier_idx').on(table.courierId),
  index('orders_status_idx').on(table.status),
]);

// Order Items table
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id').notNull().references(() => menuItems.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 8, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 8, scale: 2 }).notNull(),
  selectedOptions: json('selected_options').notNull().default('[]'),
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Order Events table (for tracking order status changes)
export const orderEvents = pgTable('order_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').notNull(),
  message: text('message'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('order_events_order_idx').on(table.orderId),
]);

// Deliveries table
export const deliveries = pgTable('deliveries', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  courierId: uuid('courier_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: deliveryStatusEnum('status').notNull().default('assigned'),
  assignedAt: timestamp('assigned_at').notNull().defaultNow(),
  acceptedAt: timestamp('accepted_at'),
  pickedUpAt: timestamp('picked_up_at'),
  deliveredAt: timestamp('delivered_at'),
  currentLocation: json('current_location'), // { latitude, longitude }
  estimatedArrival: timestamp('estimated_arrival'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('deliveries_order_idx').on(table.orderId),
  index('deliveries_courier_idx').on(table.courierId),
]);

// Courier Profiles table
export const courierProfiles = pgTable('courier_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  vehicleType: text('vehicle_type').notNull(), // "bike", "car", "motorcycle"
  licensePlate: text('license_plate'),
  isAvailable: boolean('is_available').notNull().default(true),
  currentLocation: json('current_location'), // { latitude, longitude }
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  reviewCount: integer('review_count').notNull().default(0),
  totalDeliveries: integer('total_deliveries').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('courier_profiles_user_idx').on(table.userId),
]);

// Invoices table
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  courierId: uuid('courier_id').references(() => users.id, { onDelete: 'set null' }),
  restaurantAmount: decimal('restaurant_amount', { precision: 10, scale: 2 }).notNull(),
  courierAmount: decimal('courier_amount', { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // "pending", "paid", "failed"
  stripeTransferId: text('stripe_transfer_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
  courierId: uuid('courier_id').references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  type: text('type').notNull(), // "restaurant", "courier"
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('reviews_order_idx').on(table.orderId),
  index('reviews_restaurant_idx').on(table.restaurantId),
  index('reviews_courier_idx').on(table.courierId),
]);

// Coupons table
export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // "percentage", "fixed"
  value: decimal('value', { precision: 8, scale: 2 }).notNull(),
  minimumOrder: decimal('minimum_order', { precision: 8, scale: 2 }),
  maxUses: integer('max_uses'),
  usedCount: integer('used_count').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('coupons_code_idx').on(table.code),
]);

// Favorites table
export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('favorites_user_restaurant_idx').on(table.userId, table.restaurantId),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  ownedRestaurants: many(restaurants),
  carts: many(carts),
  orders: many(orders),
  courierProfile: many(courierProfiles),
  reviews: many(reviews),
  favorites: many(favorites),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  owner: one(users, {
    fields: [restaurants.ownerId],
    references: [users.id],
  }),
  menuCategories: many(menuCategories),
  menuItems: many(menuItems),
  carts: many(carts),
  orders: many(orders),
  reviews: many(reviews),
  favorites: many(favorites),
}));

export const menuCategoriesRelations = relations(menuCategories, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuCategories.restaurantId],
    references: [restaurants.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
  options: many(menuItemOptions),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const menuItemOptionsRelations = relations(menuItemOptions, ({ one, many }) => ({
  menuItem: one(menuItems, {
    fields: [menuItemOptions.menuItemId],
    references: [menuItems.id],
  }),
  values: many(menuItemOptionValues),
}));

export const menuItemOptionValuesRelations = relations(menuItemOptionValues, ({ one }) => ({
  option: one(menuItemOptions, {
    fields: [menuItemOptionValues.optionId],
    references: [menuItemOptions.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [carts.restaurantId],
    references: [restaurants.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  menuItem: one(menuItems, {
    fields: [cartItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
  courier: one(users, {
    fields: [orders.courierId],
    references: [users.id],
  }),
  items: many(orderItems),
  events: many(orderEvents),
  delivery: many(deliveries),
  reviews: many(reviews),
  invoices: many(invoices),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, {
    fields: [orderEvents.orderId],
    references: [orders.id],
  }),
}));

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  order: one(orders, {
    fields: [deliveries.orderId],
    references: [orders.id],
  }),
  courier: one(users, {
    fields: [deliveries.courierId],
    references: [users.id],
  }),
}));

export const courierProfilesRelations = relations(courierProfiles, ({ one }) => ({
  user: one(users, {
    fields: [courierProfiles.userId],
    references: [users.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
  restaurant: one(restaurants, {
    fields: [invoices.restaurantId],
    references: [restaurants.id],
  }),
  courier: one(users, {
    fields: [invoices.courierId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  customer: one(users, {
    fields: [reviews.customerId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  courier: one(users, {
    fields: [reviews.courierId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [favorites.restaurantId],
    references: [restaurants.id],
  }),
}));
