/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddToCartInput = {
  menuItemId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  selectedOptions?: InputMaybe<Scalars['String']['input']>;
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  zipCode: Scalars['String']['output'];
};

export type AddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  label: Scalars['String']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type BillingPortalSession = {
  __typename?: 'BillingPortalSession';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  returnUrl: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  items?: Maybe<Array<Maybe<CartItem>>>;
  restaurant?: Maybe<Restaurant>;
  restaurantId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  cartId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  menuItem?: Maybe<MenuItem>;
  menuItemId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selectedOptions: Scalars['String']['output'];
  specialInstructions?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type CheckoutSession = {
  __typename?: 'CheckoutSession';
  createdAt: Scalars['String']['output'];
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  paymentIntentId?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CourierProfile = {
  __typename?: 'CourierProfile';
  createdAt: Scalars['String']['output'];
  currentLocation?: Maybe<Location>;
  id: Scalars['String']['output'];
  isAvailable: Scalars['Boolean']['output'];
  licensePlate?: Maybe<Scalars['String']['output']>;
  rating: Scalars['Float']['output'];
  reviewCount: Scalars['Int']['output'];
  totalDeliveries: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  vehicleType: VehicleType;
};

export type CreateBillingPortalSessionInput = {
  customerId: Scalars['String']['input'];
  returnUrl: Scalars['String']['input'];
};

export type CreateCheckoutSessionInput = {
  cancelUrl: Scalars['String']['input'];
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['String']['input'];
  successUrl: Scalars['String']['input'];
};

export type CreateOrderInput = {
  deliveryAddress: Scalars['String']['input'];
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
  tip?: InputMaybe<Scalars['Float']['input']>;
};

export type CreatePaymentIntentInput = {
  amount: Scalars['Float']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRefundInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  paymentIntentId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  courierId?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Int']['input'];
  restaurantId?: InputMaybe<Scalars['String']['input']>;
  type: ReviewType;
};

export type Delivery = {
  __typename?: 'Delivery';
  acceptedAt?: Maybe<Scalars['String']['output']>;
  assignedAt: Scalars['String']['output'];
  courier?: Maybe<User>;
  courierId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentLocation?: Maybe<Location>;
  deliveredAt?: Maybe<Scalars['String']['output']>;
  estimatedArrival?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  order?: Maybe<Order>;
  orderId: Scalars['String']['output'];
  pickedUpAt?: Maybe<Scalars['String']['output']>;
  status: DeliveryStatus;
  updatedAt: Scalars['String']['output'];
};

export enum DeliveryStatus {
  Accepted = 'accepted',
  Assigned = 'assigned',
  Delivered = 'delivered',
  PickedUp = 'picked_up'
}

export type Location = {
  __typename?: 'Location';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  timestamp?: Maybe<Scalars['String']['output']>;
};

export type LocationInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MenuCategory = {
  __typename?: 'MenuCategory';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  menuItems?: Maybe<Array<Maybe<MenuItem>>>;
  name: Scalars['String']['output'];
  restaurantId: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type MenuItem = {
  __typename?: 'MenuItem';
  categoryId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isAvailable: Scalars['Boolean']['output'];
  isPopular: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<Array<Maybe<MenuItemOption>>>;
  price: Scalars['Float']['output'];
  restaurantId: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type MenuItemOption = {
  __typename?: 'MenuItemOption';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isRequired: Scalars['Boolean']['output'];
  menuItemId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  type: OptionType;
  values?: Maybe<Array<Maybe<OptionValue>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptDelivery?: Maybe<Delivery>;
  addToCart?: Maybe<CartItem>;
  cancelPaymentIntent?: Maybe<PaymentIntent>;
  clearCart?: Maybe<Scalars['Boolean']['output']>;
  confirmOrder?: Maybe<Order>;
  confirmPaymentIntent?: Maybe<PaymentIntent>;
  createBillingPortalSession?: Maybe<BillingPortalSession>;
  createCheckoutSession?: Maybe<CheckoutSession>;
  createPaymentIntent?: Maybe<PaymentIntent>;
  createRefund?: Maybe<Refund>;
  createReview?: Maybe<Review>;
  deliverOrder?: Maybe<Delivery>;
  login?: Maybe<AuthResponse>;
  loginWithGoogle?: Maybe<AuthResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  pickupOrder?: Maybe<Delivery>;
  placeOrder?: Maybe<Order>;
  refreshToken?: Maybe<RefreshTokenResponse>;
  removeFromCart?: Maybe<Scalars['Boolean']['output']>;
  setRestaurantOpen?: Maybe<Restaurant>;
  signup?: Maybe<AuthResponse>;
  toggleFavorite?: Maybe<Scalars['Boolean']['output']>;
  updateCartItem?: Maybe<CartItem>;
  updateCourierLocation?: Maybe<CourierProfile>;
};


export type MutationAcceptDeliveryArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationAddToCartArgs = {
  input: AddToCartInput;
};


export type MutationCancelPaymentIntentArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type MutationConfirmOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationConfirmPaymentIntentArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type MutationCreateBillingPortalSessionArgs = {
  input: CreateBillingPortalSessionInput;
};


export type MutationCreateCheckoutSessionArgs = {
  input: CreateCheckoutSessionInput;
};


export type MutationCreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
};


export type MutationCreateRefundArgs = {
  input: CreateRefundInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationDeliverOrderArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLoginWithGoogleArgs = {
  idToken: Scalars['String']['input'];
};


export type MutationPickupOrderArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationPlaceOrderArgs = {
  input: CreateOrderInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRemoveFromCartArgs = {
  input: RemoveFromCartInput;
};


export type MutationSetRestaurantOpenArgs = {
  id: Scalars['String']['input'];
  isOpen: Scalars['Boolean']['input'];
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationToggleFavoriteArgs = {
  restaurantId: Scalars['String']['input'];
};


export type MutationUpdateCartItemArgs = {
  input: UpdateCartItemInput;
};


export type MutationUpdateCourierLocationArgs = {
  input: UpdateCourierLocationInput;
};

export enum OptionType {
  Multiple = 'multiple',
  Single = 'single'
}

export type OptionValue = {
  __typename?: 'OptionValue';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  optionId: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type Order = {
  __typename?: 'Order';
  courier?: Maybe<User>;
  courierId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customer?: Maybe<User>;
  customerId: Scalars['String']['output'];
  deliveryAddress: Scalars['String']['output'];
  deliveryFee: Scalars['Float']['output'];
  estimatedDeliveryTime?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Array<Maybe<OrderEvent>>>;
  id: Scalars['String']['output'];
  items?: Maybe<Array<Maybe<OrderItem>>>;
  orderNumber: Scalars['String']['output'];
  paymentStatus: PaymentStatus;
  restaurant?: Maybe<Restaurant>;
  restaurantId: Scalars['String']['output'];
  specialInstructions?: Maybe<Scalars['String']['output']>;
  status: OrderStatus;
  subtotal: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
  tip: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type OrderEvent = {
  __typename?: 'OrderEvent';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['String']['output'];
  status: OrderStatus;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  menuItem?: Maybe<MenuItem>;
  menuItemId: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selectedOptions: Scalars['String']['output'];
  specialInstructions?: Maybe<Scalars['String']['output']>;
  totalPrice: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export enum OrderStatus {
  Cancelled = 'cancelled',
  Confirmed = 'confirmed',
  Delivered = 'delivered',
  Pending = 'pending',
  PickedUp = 'picked_up',
  Preparing = 'preparing',
  Ready = 'ready'
}

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
  amount: Scalars['Int']['output'];
  clientSecret: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export enum PaymentStatus {
  Failed = 'failed',
  Paid = 'paid',
  Pending = 'pending',
  Refunded = 'refunded'
}

export type Query = {
  __typename?: 'Query';
  cart?: Maybe<Cart>;
  courierAssignments: Array<Maybe<Delivery>>;
  favoriteRestaurants: Array<Maybe<Restaurant>>;
  me?: Maybe<User>;
  merchantOrders: Array<Maybe<Order>>;
  order?: Maybe<Order>;
  orders: Array<Maybe<Order>>;
  paymentIntent?: Maybe<PaymentIntent>;
  restaurant?: Maybe<Restaurant>;
  restaurants: Array<Maybe<Restaurant>>;
  reviews: Array<Maybe<Review>>;
};


export type QueryMerchantOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};


export type QueryPaymentIntentArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type QueryRestaurantArgs = {
  slug: Scalars['String']['input'];
};


export type QueryRestaurantsArgs = {
  cuisine?: InputMaybe<Scalars['String']['input']>;
  isOpen?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReviewsArgs = {
  courierId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  restaurantId?: InputMaybe<Scalars['String']['input']>;
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Refund = {
  __typename?: 'Refund';
  amount: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type RemoveFromCartInput = {
  cartItemId: Scalars['String']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  address?: Maybe<Address>;
  createdAt: Scalars['String']['output'];
  cuisine: Scalars['String']['output'];
  deliveryFee: Scalars['Float']['output'];
  deliveryTime: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isFavorite?: Maybe<Scalars['Boolean']['output']>;
  isOpen: Scalars['Boolean']['output'];
  menuCategories?: Maybe<Array<Maybe<MenuCategory>>>;
  minimumOrder: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  reviewCount: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  courier?: Maybe<User>;
  courierId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customer?: Maybe<User>;
  customerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  restaurant?: Maybe<Restaurant>;
  restaurantId?: Maybe<Scalars['String']['output']>;
  type: ReviewType;
  updatedAt: Scalars['String']['output'];
};

export enum ReviewType {
  Courier = 'courier',
  Restaurant = 'restaurant'
}

export type SignupInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCartItemInput = {
  cartItemId: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  selectedOptions?: InputMaybe<Scalars['String']['input']>;
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCourierLocationInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  addresses?: Maybe<Array<Maybe<Address>>>;
  avatar?: Maybe<Scalars['String']['output']>;
  courierProfile?: Maybe<CourierProfile>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['String']['output'];
};

export enum UserRole {
  Admin = 'admin',
  Courier = 'courier',
  Customer = 'customer',
  Merchant = 'merchant'
}

export enum VehicleType {
  Bike = 'bike',
  Car = 'car',
  Motorcycle = 'motorcycle'
}

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, role: UserRole, avatar?: string | null, isActive: boolean, emailVerified: boolean, createdAt: string, updatedAt: string } } | null };

export type SignupMutationVariables = Exact<{
  input: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup?: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, role: UserRole, avatar?: string | null, isActive: boolean, emailVerified: boolean, createdAt: string, updatedAt: string } } | null };

export type LoginWithGoogleMutationVariables = Exact<{
  idToken: Scalars['String']['input'];
}>;


export type LoginWithGoogleMutation = { __typename?: 'Mutation', loginWithGoogle?: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, role: UserRole, avatar?: string | null, isActive: boolean, emailVerified: boolean, createdAt: string, updatedAt: string } } | null };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken?: { __typename?: 'RefreshTokenResponse', accessToken: string, refreshToken: string } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, phone?: string | null, role: UserRole, avatar?: string | null, isActive: boolean, emailVerified: boolean, createdAt: string, updatedAt: string, addresses?: Array<{ __typename?: 'Address', id: string, label: string, street: string, city: string, state: string, zipCode: string, country: string, latitude: number, longitude: number, isDefault: boolean, createdAt: string, updatedAt: string } | null> | null, courierProfile?: { __typename?: 'CourierProfile', id: string, vehicleType: VehicleType, licensePlate?: string | null, isAvailable: boolean, rating: number, reviewCount: number, totalDeliveries: number, createdAt: string, updatedAt: string, currentLocation?: { __typename?: 'Location', latitude: number, longitude: number, timestamp?: string | null } | null } | null } | null };

export type RestaurantsQueryVariables = Exact<{
  cuisine?: InputMaybe<Scalars['String']['input']>;
  isOpen?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
}>;


export type RestaurantsQuery = { __typename?: 'Query', restaurants: Array<{ __typename?: 'Restaurant', id: string, name: string, slug: string, description?: string | null, image?: string | null, cuisine: string, rating?: number | null, reviewCount: number, deliveryTime: number, deliveryFee: number, minimumOrder: number, isOpen: boolean, isActive: boolean, phone?: string | null, createdAt: string, updatedAt: string, isFavorite?: boolean | null, address?: { __typename?: 'Address', street: string, city: string, state: string, zipCode: string, latitude: number, longitude: number } | null } | null> };

export type RestaurantQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type RestaurantQuery = { __typename?: 'Query', restaurant?: { __typename?: 'Restaurant', id: string, name: string, slug: string, description?: string | null, image?: string | null, cuisine: string, rating?: number | null, reviewCount: number, deliveryTime: number, deliveryFee: number, minimumOrder: number, isOpen: boolean, isActive: boolean, phone?: string | null, createdAt: string, updatedAt: string, isFavorite?: boolean | null, address?: { __typename?: 'Address', street: string, city: string, state: string, zipCode: string, latitude: number, longitude: number } | null, menuCategories?: Array<{ __typename?: 'MenuCategory', id: string, name: string, description?: string | null, sortOrder: number, isActive: boolean, createdAt: string, updatedAt: string, menuItems?: Array<{ __typename?: 'MenuItem', id: string, name: string, description?: string | null, image?: string | null, price: number, isAvailable: boolean, isPopular: boolean, sortOrder: number, createdAt: string, updatedAt: string, options?: Array<{ __typename?: 'MenuItemOption', id: string, name: string, type: OptionType, isRequired: boolean, sortOrder: number, createdAt: string, values?: Array<{ __typename?: 'OptionValue', id: string, name: string, price: number, isDefault: boolean, sortOrder: number, createdAt: string } | null> | null } | null> | null } | null> | null } | null> | null } | null };

export type FavoriteRestaurantsQueryVariables = Exact<{ [key: string]: never; }>;


export type FavoriteRestaurantsQuery = { __typename?: 'Query', favoriteRestaurants: Array<{ __typename?: 'Restaurant', id: string, name: string, slug: string, description?: string | null, image?: string | null, cuisine: string, rating?: number | null, reviewCount: number, deliveryTime: number, deliveryFee: number, minimumOrder: number, isOpen: boolean, isActive: boolean, phone?: string | null, createdAt: string, updatedAt: string, address?: { __typename?: 'Address', street: string, city: string, state: string, zipCode: string, latitude: number, longitude: number } | null } | null> };

export type ToggleFavoriteMutationVariables = Exact<{
  restaurantId: Scalars['String']['input'];
}>;


export type ToggleFavoriteMutation = { __typename?: 'Mutation', toggleFavorite?: boolean | null };

export type CartQueryVariables = Exact<{ [key: string]: never; }>;


export type CartQuery = { __typename?: 'Query', cart?: { __typename?: 'Cart', id: string, restaurantId: string, createdAt: string, updatedAt: string, items?: Array<{ __typename?: 'CartItem', id: string, menuItemId: string, quantity: number, selectedOptions: string, specialInstructions?: string | null, createdAt: string, updatedAt: string, menuItem?: { __typename?: 'MenuItem', id: string, name: string, description?: string | null, image?: string | null, price: number, isAvailable: boolean, isPopular: boolean, options?: Array<{ __typename?: 'MenuItemOption', id: string, name: string, type: OptionType, isRequired: boolean, values?: Array<{ __typename?: 'OptionValue', id: string, name: string, price: number, isDefault: boolean } | null> | null } | null> | null } | null } | null> | null } | null };

export type AddToCartMutationVariables = Exact<{
  input: AddToCartInput;
}>;


export type AddToCartMutation = { __typename?: 'Mutation', addToCart?: { __typename?: 'CartItem', id: string, menuItemId: string, quantity: number, selectedOptions: string, specialInstructions?: string | null, createdAt: string, updatedAt: string } | null };

export type UpdateCartItemMutationVariables = Exact<{
  input: UpdateCartItemInput;
}>;


export type UpdateCartItemMutation = { __typename?: 'Mutation', updateCartItem?: { __typename?: 'CartItem', id: string, quantity: number, selectedOptions: string, specialInstructions?: string | null, updatedAt: string } | null };

export type RemoveFromCartMutationVariables = Exact<{
  input: RemoveFromCartInput;
}>;


export type RemoveFromCartMutation = { __typename?: 'Mutation', removeFromCart?: boolean | null };

export type ClearCartMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearCartMutation = { __typename?: 'Mutation', clearCart?: boolean | null };

export type OrdersQueryVariables = Exact<{
  status?: InputMaybe<OrderStatus>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type OrdersQuery = { __typename?: 'Query', orders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, paymentStatus: PaymentStatus, subtotal: number, tax: number, deliveryFee: number, tip: number, total: number, deliveryAddress: string, specialInstructions?: string | null, estimatedDeliveryTime?: string | null, createdAt: string, updatedAt: string, restaurant?: { __typename?: 'Restaurant', id: string, name: string, slug: string, image?: string | null, phone?: string | null } | null, courier?: { __typename?: 'User', id: string, firstName: string, lastName: string, phone?: string | null, courierProfile?: { __typename?: 'CourierProfile', vehicleType: VehicleType, rating: number } | null } | null, items?: Array<{ __typename?: 'OrderItem', id: string, menuItemId: string, quantity: number, unitPrice: number, totalPrice: number, selectedOptions: string, specialInstructions?: string | null, menuItem?: { __typename?: 'MenuItem', id: string, name: string, description?: string | null, image?: string | null } | null } | null> | null, events?: Array<{ __typename?: 'OrderEvent', id: string, status: OrderStatus, message?: string | null, metadata?: string | null, createdAt: string } | null> | null } | null> };

export type OrderQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type OrderQuery = { __typename?: 'Query', order?: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, paymentStatus: PaymentStatus, subtotal: number, tax: number, deliveryFee: number, tip: number, total: number, deliveryAddress: string, specialInstructions?: string | null, estimatedDeliveryTime?: string | null, createdAt: string, updatedAt: string, restaurant?: { __typename?: 'Restaurant', id: string, name: string, slug: string, image?: string | null, phone?: string | null, address?: { __typename?: 'Address', street: string, city: string, state: string, zipCode: string } | null } | null, courier?: { __typename?: 'User', id: string, firstName: string, lastName: string, phone?: string | null, courierProfile?: { __typename?: 'CourierProfile', vehicleType: VehicleType, rating: number, currentLocation?: { __typename?: 'Location', latitude: number, longitude: number, timestamp?: string | null } | null } | null } | null, items?: Array<{ __typename?: 'OrderItem', id: string, menuItemId: string, quantity: number, unitPrice: number, totalPrice: number, selectedOptions: string, specialInstructions?: string | null, menuItem?: { __typename?: 'MenuItem', id: string, name: string, description?: string | null, image?: string | null } | null } | null> | null, events?: Array<{ __typename?: 'OrderEvent', id: string, status: OrderStatus, message?: string | null, metadata?: string | null, createdAt: string } | null> | null } | null };

export type PlaceOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type PlaceOrderMutation = { __typename?: 'Mutation', placeOrder?: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, paymentStatus: PaymentStatus, total: number, estimatedDeliveryTime?: string | null, createdAt: string } | null };

export type CourierAssignmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type CourierAssignmentsQuery = { __typename?: 'Query', courierAssignments: Array<{ __typename?: 'Delivery', id: string, orderId: string, status: DeliveryStatus, assignedAt: string, acceptedAt?: string | null, pickedUpAt?: string | null, deliveredAt?: string | null, estimatedArrival?: string | null, currentLocation?: { __typename?: 'Location', latitude: number, longitude: number, timestamp?: string | null } | null, order?: { __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, total: number, deliveryAddress: string, specialInstructions?: string | null, restaurant?: { __typename?: 'Restaurant', id: string, name: string, address?: { __typename?: 'Address', street: string, city: string, state: string, zipCode: string, latitude: number, longitude: number } | null } | null, customer?: { __typename?: 'User', id: string, firstName: string, lastName: string, phone?: string | null } | null } | null } | null> };

export type AcceptDeliveryMutationVariables = Exact<{
  deliveryId: Scalars['String']['input'];
}>;


export type AcceptDeliveryMutation = { __typename?: 'Mutation', acceptDelivery?: { __typename?: 'Delivery', id: string, status: DeliveryStatus, acceptedAt?: string | null } | null };

export type PickupOrderMutationVariables = Exact<{
  deliveryId: Scalars['String']['input'];
}>;


export type PickupOrderMutation = { __typename?: 'Mutation', pickupOrder?: { __typename?: 'Delivery', id: string, status: DeliveryStatus, pickedUpAt?: string | null } | null };

export type DeliverOrderMutationVariables = Exact<{
  deliveryId: Scalars['String']['input'];
}>;


export type DeliverOrderMutation = { __typename?: 'Mutation', deliverOrder?: { __typename?: 'Delivery', id: string, status: DeliveryStatus, deliveredAt?: string | null } | null };

export type UpdateCourierLocationMutationVariables = Exact<{
  input: UpdateCourierLocationInput;
}>;


export type UpdateCourierLocationMutation = { __typename?: 'Mutation', updateCourierLocation?: { __typename?: 'CourierProfile', id: string, updatedAt: string, currentLocation?: { __typename?: 'Location', latitude: number, longitude: number, timestamp?: string | null } | null } | null };

export type MerchantOrdersQueryVariables = Exact<{
  status?: InputMaybe<OrderStatus>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MerchantOrdersQuery = { __typename?: 'Query', merchantOrders: Array<{ __typename?: 'Order', id: string, orderNumber: string, status: OrderStatus, paymentStatus: PaymentStatus, subtotal: number, tax: number, deliveryFee: number, tip: number, total: number, deliveryAddress: string, specialInstructions?: string | null, estimatedDeliveryTime?: string | null, createdAt: string, updatedAt: string, customer?: { __typename?: 'User', id: string, firstName: string, lastName: string, phone?: string | null } | null, courier?: { __typename?: 'User', id: string, firstName: string, lastName: string, phone?: string | null } | null, items?: Array<{ __typename?: 'OrderItem', id: string, menuItemId: string, quantity: number, unitPrice: number, totalPrice: number, selectedOptions: string, specialInstructions?: string | null, menuItem?: { __typename?: 'MenuItem', id: string, name: string, description?: string | null, image?: string | null } | null } | null> | null } | null> };

export type ConfirmOrderMutationVariables = Exact<{
  orderId: Scalars['String']['input'];
}>;


export type ConfirmOrderMutation = { __typename?: 'Mutation', confirmOrder?: { __typename?: 'Order', id: string, status: OrderStatus, updatedAt: string } | null };

export type SetRestaurantOpenMutationVariables = Exact<{
  id: Scalars['String']['input'];
  isOpen: Scalars['Boolean']['input'];
}>;


export type SetRestaurantOpenMutation = { __typename?: 'Mutation', setRestaurantOpen?: { __typename?: 'Restaurant', id: string, isOpen: boolean, updatedAt: string } | null };

export type ReviewsQueryVariables = Exact<{
  restaurantId?: InputMaybe<Scalars['String']['input']>;
  courierId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ReviewsQuery = { __typename?: 'Query', reviews: Array<{ __typename?: 'Review', id: string, rating: number, comment?: string | null, type: ReviewType, createdAt: string, updatedAt: string, customer?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null, restaurant?: { __typename?: 'Restaurant', id: string, name: string, slug: string } | null, courier?: { __typename?: 'User', id: string, firstName: string, lastName: string } | null } | null> };

export type CreateReviewMutationVariables = Exact<{
  input: CreateReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview?: { __typename?: 'Review', id: string, rating: number, comment?: string | null, type: ReviewType, createdAt: string } | null };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const LoginWithGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginWithGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courierProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"vehicleType"}},{"kind":"Field","name":{"kind":"Name","value":"licensePlate"}},{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"currentLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDeliveries"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const RestaurantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Restaurants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cuisine"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isOpen"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restaurants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cuisine"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cuisine"}}},{"kind":"Argument","name":{"kind":"Name","value":"isOpen"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isOpen"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"cuisine"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isFavorite"}}]}}]}}]} as unknown as DocumentNode<RestaurantsQuery, RestaurantsQueryVariables>;
export const RestaurantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Restaurant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restaurant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"cuisine"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isFavorite"}},{"kind":"Field","name":{"kind":"Name","value":"menuCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"menuItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isPopular"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RestaurantQuery, RestaurantQueryVariables>;
export const FavoriteRestaurantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FavoriteRestaurants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"favoriteRestaurants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"cuisine"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FavoriteRestaurantsQuery, FavoriteRestaurantsQueryVariables>;
export const ToggleFavoriteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleFavorite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleFavorite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}}]}]}}]} as unknown as DocumentNode<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>;
export const CartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Cart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restaurantId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuItemId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOptions"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"menuItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isPopular"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CartQuery, CartQueryVariables>;
export const AddToCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddToCart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddToCartInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToCart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuItemId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOptions"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AddToCartMutation, AddToCartMutationVariables>;
export const UpdateCartItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCartItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCartItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCartItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOptions"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateCartItemMutation, UpdateCartItemMutationVariables>;
export const RemoveFromCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromCart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveFromCartInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromCart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RemoveFromCartMutation, RemoveFromCartMutationVariables>;
export const ClearCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClearCart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearCart"}}]}}]} as unknown as DocumentNode<ClearCartMutation, ClearCartMutationVariables>;
export const OrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Orders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDeliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"restaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"courierProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleType"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuItemId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOptions"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"menuItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<OrdersQuery, OrdersQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDeliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"restaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"courier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"courierProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleType"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"currentLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuItemId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOptions"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"menuItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const PlaceOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlaceOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDeliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PlaceOrderMutation, PlaceOrderMutationVariables>;
export const CourierAssignmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourierAssignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courierAssignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pickedUpAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"currentLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"estimatedArrival"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"restaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CourierAssignmentsQuery, CourierAssignmentsQueryVariables>;
export const AcceptDeliveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptDelivery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deliveryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptDelivery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deliveryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deliveryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedAt"}}]}}]}}]} as unknown as DocumentNode<AcceptDeliveryMutation, AcceptDeliveryMutationVariables>;
export const PickupOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PickupOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deliveryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pickupOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deliveryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deliveryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"pickedUpAt"}}]}}]}}]} as unknown as DocumentNode<PickupOrderMutation, PickupOrderMutationVariables>;
export const DeliverOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeliverOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deliveryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliverOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deliveryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deliveryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}}]}}]}}]} as unknown as DocumentNode<DeliverOrderMutation, DeliverOrderMutationVariables>;
export const UpdateCourierLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCourierLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCourierLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCourierLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateCourierLocationMutation, UpdateCourierLocationMutationVariables>;
export const MerchantOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MerchantOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchantOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryFee"}},{"kind":"Field","name":{"kind":"Name","value":"tip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDeliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"menuItemId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOptions"}},{"kind":"Field","name":{"kind":"Name","value":"specialInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"menuItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MerchantOrdersQuery, MerchantOrdersQueryVariables>;
export const ConfirmOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ConfirmOrderMutation, ConfirmOrderMutationVariables>;
export const SetRestaurantOpenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetRestaurantOpen"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isOpen"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setRestaurantOpen"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"isOpen"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isOpen"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SetRestaurantOpenMutation, SetRestaurantOpenMutationVariables>;
export const ReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Reviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courierId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"restaurantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"restaurantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courierId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"restaurant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<ReviewsQuery, ReviewsQueryVariables>;
export const CreateReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateReviewMutation, CreateReviewMutationVariables>;