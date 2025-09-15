import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User, Restaurant, MenuItem, Order, OrderItem, Cart, CartItem, Address, CourierProfile, Review, Payout, Delivery } from '../db/schema';
import { GraphQLContext } from '../context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AddToCartInput = {
  menuItemId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  selectedOptions?: InputMaybe<Scalars['JSON']['input']>;
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zipCode: Scalars['String']['output'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type BillingPortalSession = {
  __typename?: 'BillingPortalSession';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  returnUrl: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  items: Array<CartItem>;
  restaurant?: Maybe<Restaurant>;
  restaurantId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  menuItem?: Maybe<MenuItem>;
  menuItemId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selectedOptions?: Maybe<Scalars['JSON']['output']>;
  specialInstructions?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CheckoutSession = {
  __typename?: 'CheckoutSession';
  createdAt: Scalars['DateTime']['output'];
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  paymentIntentId?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CourierLocationUpdate = {
  __typename?: 'CourierLocationUpdate';
  courierId: Scalars['String']['output'];
  deliveryId: Scalars['String']['output'];
  estimatedArrival?: Maybe<Scalars['DateTime']['output']>;
  location: Location;
  timestamp: Scalars['DateTime']['output'];
};

export type CourierProfile = {
  __typename?: 'CourierProfile';
  createdAt: Scalars['DateTime']['output'];
  currentLocation?: Maybe<Location>;
  id: Scalars['ID']['output'];
  isAvailable: Scalars['Boolean']['output'];
  licensePlate?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  reviewCount: Scalars['Int']['output'];
  totalDeliveries: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vehicleType: VehicleType;
};

export type CourierStatusUpdate = {
  __typename?: 'CourierStatusUpdate';
  courierId: Scalars['String']['output'];
  isAvailable: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type CreateBillingPortalSessionInput = {
  customerId: Scalars['String']['input'];
  returnUrl: Scalars['String']['input'];
};

export type CreateCheckoutSessionInput = {
  cancelUrl: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
  successUrl: Scalars['String']['input'];
};

export type CreateOrderInput = {
  deliveryAddress: Scalars['String']['input'];
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
  tip?: InputMaybe<Scalars['Float']['input']>;
};

export type CreatePaymentIntentInput = {
  amount: Scalars['Int']['input'];
  currency: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  orderId: Scalars['String']['input'];
};

export type CreateRefundInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
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

export type CustomerOrderTracking = {
  __typename?: 'CustomerOrderTracking';
  courier?: Maybe<User>;
  currentLocation?: Maybe<Location>;
  estimatedDelivery?: Maybe<Scalars['DateTime']['output']>;
  orderId: Scalars['String']['output'];
  status: OrderStatus;
  timestamp: Scalars['DateTime']['output'];
};

export type Delivery = {
  __typename?: 'Delivery';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  assignedAt: Scalars['DateTime']['output'];
  courier: User;
  courierId: Scalars['String']['output'];
  currentLocation?: Maybe<Location>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  estimatedArrival?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  order: Order;
  orderId: Scalars['String']['output'];
  pickedUpAt?: Maybe<Scalars['DateTime']['output']>;
  status: DeliveryStatus;
};

export type DeliveryAssignment = {
  __typename?: 'DeliveryAssignment';
  assignedBy: Scalars['String']['output'];
  courierId: Scalars['String']['output'];
  deliveryId: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type DeliveryStatus =
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'CANCELLED'
  | 'DELIVERED'
  | 'PICKED_UP';

export type DeliveryStatusUpdate = {
  __typename?: 'DeliveryStatusUpdate';
  deliveryId: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: DeliveryStatus;
  timestamp: Scalars['DateTime']['output'];
};

export type Location = {
  __typename?: 'Location';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  timestamp?: Maybe<Scalars['DateTime']['output']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MenuCategory = {
  __typename?: 'MenuCategory';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  menuItems: Array<MenuItem>;
  name: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MenuItem = {
  __typename?: 'MenuItem';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isAvailable: Scalars['Boolean']['output'];
  isPopular: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  options: Array<MenuItemOption>;
  price: Scalars['Float']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MenuItemOption = {
  __typename?: 'MenuItemOption';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isRequired: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  type: OptionType;
  values: Array<OptionValue>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptDelivery: Delivery;
  addToCart: CartItem;
  cancelPaymentIntent: PaymentIntent;
  clearCart: Scalars['Boolean']['output'];
  confirmOrder: Order;
  confirmPaymentIntent: PaymentIntent;
  createBillingPortalSession: BillingPortalSession;
  createCheckoutSession: CheckoutSession;
  createPaymentIntent: PaymentIntent;
  createRefund: Refund;
  createReview: Review;
  deliverOrder: Delivery;
  login: AuthResponse;
  loginWithGoogle: AuthResponse;
  logout: Scalars['Boolean']['output'];
  pickupOrder: Delivery;
  placeOrder: Order;
  refreshToken: RefreshTokenResponse;
  removeFromCart: Scalars['Boolean']['output'];
  setRestaurantOpen: Restaurant;
  signup: AuthResponse;
  toggleFavorite: Scalars['Boolean']['output'];
  updateCartItem: CartItem;
  updateCourierLocation: CourierProfile;
};


export type MutationacceptDeliveryArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationaddToCartArgs = {
  input: AddToCartInput;
};


export type MutationcancelPaymentIntentArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type MutationconfirmOrderArgs = {
  orderId: Scalars['String']['input'];
};


export type MutationconfirmPaymentIntentArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type MutationcreateBillingPortalSessionArgs = {
  input: CreateBillingPortalSessionInput;
};


export type MutationcreateCheckoutSessionArgs = {
  input: CreateCheckoutSessionInput;
};


export type MutationcreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
};


export type MutationcreateRefundArgs = {
  input: CreateRefundInput;
};


export type MutationcreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationdeliverOrderArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationloginArgs = {
  input: LoginInput;
};


export type MutationloginWithGoogleArgs = {
  idToken: Scalars['String']['input'];
};


export type MutationpickupOrderArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationplaceOrderArgs = {
  input: CreateOrderInput;
};


export type MutationrefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationremoveFromCartArgs = {
  input: RemoveFromCartInput;
};


export type MutationsetRestaurantOpenArgs = {
  id: Scalars['String']['input'];
  isOpen: Scalars['Boolean']['input'];
};


export type MutationsignupArgs = {
  input: SignupInput;
};


export type MutationtoggleFavoriteArgs = {
  restaurantId: Scalars['String']['input'];
};


export type MutationupdateCartItemArgs = {
  input: UpdateCartItemInput;
};


export type MutationupdateCourierLocationArgs = {
  input: UpdateCourierLocationInput;
};

export type OptionType =
  | 'MULTIPLE'
  | 'SINGLE';

export type OptionValue = {
  __typename?: 'OptionValue';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type Order = {
  __typename?: 'Order';
  courier?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  customer: User;
  deliveryAddress: Scalars['String']['output'];
  deliveryFee: Scalars['Float']['output'];
  estimatedDeliveryTime?: Maybe<Scalars['DateTime']['output']>;
  events: Array<OrderEvent>;
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  orderNumber: Scalars['String']['output'];
  paymentStatus: PaymentStatus;
  restaurant: Restaurant;
  specialInstructions?: Maybe<Scalars['String']['output']>;
  status: OrderStatus;
  subtotal: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
  tip: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderEvent = {
  __typename?: 'OrderEvent';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  status: OrderStatus;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  id: Scalars['ID']['output'];
  menuItem?: Maybe<MenuItem>;
  menuItemId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selectedOptions?: Maybe<Scalars['JSON']['output']>;
  specialInstructions?: Maybe<Scalars['String']['output']>;
  totalPrice: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type OrderStatus =
  | 'CANCELLED'
  | 'CONFIRMED'
  | 'DELIVERED'
  | 'PENDING'
  | 'PICKED_UP'
  | 'PREPARING'
  | 'READY';

export type OrderUpdate = {
  __typename?: 'OrderUpdate';
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  orderId: Scalars['String']['output'];
  status: OrderStatus;
  timestamp: Scalars['DateTime']['output'];
};

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
  amount: Scalars['Int']['output'];
  clientSecret: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  status: Scalars['String']['output'];
};

export type PaymentStatus =
  | 'FAILED'
  | 'PAID'
  | 'PENDING'
  | 'REFUNDED';

export type Payout = {
  __typename?: 'Payout';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  processedAt?: Maybe<Scalars['DateTime']['output']>;
  restaurant: Restaurant;
  restaurantId: Scalars['String']['output'];
  status: PayoutStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type PayoutStatus =
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSED';

export type Query = {
  __typename?: 'Query';
  cart?: Maybe<Cart>;
  courierAssignments: Array<Delivery>;
  favoriteRestaurants: Array<Restaurant>;
  me?: Maybe<User>;
  merchantOrders: Array<Order>;
  order?: Maybe<Order>;
  orders: Array<Order>;
  paymentIntent?: Maybe<PaymentIntent>;
  restaurant?: Maybe<Restaurant>;
  restaurants: Array<Restaurant>;
  reviews: Array<Review>;
};


export type QuerymerchantOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};


export type QueryorderArgs = {
  id: Scalars['String']['input'];
};


export type QueryordersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};


export type QuerypaymentIntentArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type QueryrestaurantArgs = {
  slug: Scalars['String']['input'];
};


export type QueryrestaurantsArgs = {
  cuisine?: InputMaybe<Scalars['String']['input']>;
  isOpen?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryreviewsArgs = {
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
  createdAt: Scalars['DateTime']['output'];
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
  address: Address;
  createdAt: Scalars['DateTime']['output'];
  cuisine: Scalars['String']['output'];
  deliveryFee: Scalars['Float']['output'];
  deliveryTime: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isFavorite?: Maybe<Scalars['Boolean']['output']>;
  isOpen: Scalars['Boolean']['output'];
  menuCategories: Array<MenuCategory>;
  minimumOrder: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['Float']['output']>;
  reviewCount: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RestaurantOrderQueue = {
  __typename?: 'RestaurantOrderQueue';
  pendingOrders: Array<Order>;
  preparingOrders: Array<Order>;
  readyOrders: Array<Order>;
  restaurantId: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  courier?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  customer: User;
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  restaurant?: Maybe<Restaurant>;
  type: ReviewType;
  updatedAt: Scalars['DateTime']['output'];
};

export type ReviewType =
  | 'COURIER'
  | 'RESTAURANT';

export type SignupInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  courierLocation: CourierLocationUpdate;
  courierStatusChanged: CourierStatusUpdate;
  customerOrderTracking: CustomerOrderTracking;
  deliveryAssigned: DeliveryAssignment;
  deliveryStatusChanged: DeliveryStatusUpdate;
  liveCourierTracking: CourierLocationUpdate;
  merchantIncomingOrders: Order;
  orderStatusChanged: OrderEvent;
  realTimeOrderUpdates: OrderUpdate;
  restaurantOrderQueue: RestaurantOrderQueue;
};


export type SubscriptioncourierLocationArgs = {
  deliveryId: Scalars['String']['input'];
};


export type SubscriptioncustomerOrderTrackingArgs = {
  orderId: Scalars['String']['input'];
};


export type SubscriptiondeliveryAssignedArgs = {
  courierId: Scalars['String']['input'];
};


export type SubscriptiondeliveryStatusChangedArgs = {
  deliveryId: Scalars['String']['input'];
};


export type SubscriptionliveCourierTrackingArgs = {
  courierId: Scalars['String']['input'];
};


export type SubscriptionmerchantIncomingOrdersArgs = {
  restaurantId: Scalars['String']['input'];
};


export type SubscriptionorderStatusChangedArgs = {
  orderId: Scalars['String']['input'];
};


export type SubscriptionrealTimeOrderUpdatesArgs = {
  orderId: Scalars['String']['input'];
};


export type SubscriptionrestaurantOrderQueueArgs = {
  restaurantId: Scalars['String']['input'];
};

export type UpdateCartItemInput = {
  cartItemId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  selectedOptions?: InputMaybe<Scalars['JSON']['input']>;
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCourierLocationInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  addresses: Array<Address>;
  avatar?: Maybe<Scalars['String']['output']>;
  courierProfile?: Maybe<CourierProfile>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserRole =
  | 'ADMIN'
  | 'COURIER'
  | 'CUSTOMER'
  | 'MERCHANT';

export type VehicleType =
  | 'BICYCLE'
  | 'CAR'
  | 'MOTORCYCLE'
  | 'WALKING';



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddToCartInput: AddToCartInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Address: ResolverTypeWrapper<Address>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  AuthResponse: ResolverTypeWrapper<Omit<AuthResponse, 'user'> & { user: ResolversTypes['User'] }>;
  BillingPortalSession: ResolverTypeWrapper<BillingPortalSession>;
  Cart: ResolverTypeWrapper<Cart>;
  CartItem: ResolverTypeWrapper<CartItem>;
  CheckoutSession: ResolverTypeWrapper<CheckoutSession>;
  CourierLocationUpdate: ResolverTypeWrapper<CourierLocationUpdate>;
  CourierProfile: ResolverTypeWrapper<CourierProfile>;
  CourierStatusUpdate: ResolverTypeWrapper<CourierStatusUpdate>;
  CreateBillingPortalSessionInput: CreateBillingPortalSessionInput;
  CreateCheckoutSessionInput: CreateCheckoutSessionInput;
  CreateOrderInput: CreateOrderInput;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreateRefundInput: CreateRefundInput;
  CreateReviewInput: CreateReviewInput;
  CustomerOrderTracking: ResolverTypeWrapper<Omit<CustomerOrderTracking, 'courier' | 'status'> & { courier?: Maybe<ResolversTypes['User']>, status: ResolversTypes['OrderStatus'] }>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Delivery: ResolverTypeWrapper<Delivery>;
  DeliveryAssignment: ResolverTypeWrapper<DeliveryAssignment>;
  DeliveryStatus: ResolverTypeWrapper<'ACCEPTED' | 'ASSIGNED' | 'CANCELLED' | 'DELIVERED' | 'PICKED_UP'>;
  DeliveryStatusUpdate: ResolverTypeWrapper<Omit<DeliveryStatusUpdate, 'status'> & { status: ResolversTypes['DeliveryStatus'] }>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Location: ResolverTypeWrapper<Location>;
  LoginInput: LoginInput;
  MenuCategory: ResolverTypeWrapper<Omit<MenuCategory, 'menuItems'> & { menuItems: Array<ResolversTypes['MenuItem']> }>;
  MenuItem: ResolverTypeWrapper<MenuItem>;
  MenuItemOption: ResolverTypeWrapper<Omit<MenuItemOption, 'type'> & { type: ResolversTypes['OptionType'] }>;
  Mutation: ResolverTypeWrapper<{}>;
  OptionType: ResolverTypeWrapper<'MULTIPLE' | 'SINGLE'>;
  OptionValue: ResolverTypeWrapper<OptionValue>;
  Order: ResolverTypeWrapper<Order>;
  OrderEvent: ResolverTypeWrapper<Omit<OrderEvent, 'status'> & { status: ResolversTypes['OrderStatus'] }>;
  OrderItem: ResolverTypeWrapper<OrderItem>;
  OrderStatus: ResolverTypeWrapper<'CANCELLED' | 'CONFIRMED' | 'DELIVERED' | 'PENDING' | 'PICKED_UP' | 'PREPARING' | 'READY'>;
  OrderUpdate: ResolverTypeWrapper<Omit<OrderUpdate, 'status'> & { status: ResolversTypes['OrderStatus'] }>;
  PaymentIntent: ResolverTypeWrapper<PaymentIntent>;
  PaymentStatus: ResolverTypeWrapper<'FAILED' | 'PAID' | 'PENDING' | 'REFUNDED'>;
  Payout: ResolverTypeWrapper<Payout>;
  PayoutStatus: ResolverTypeWrapper<'FAILED' | 'PENDING' | 'PROCESSED'>;
  Query: ResolverTypeWrapper<{}>;
  RefreshTokenResponse: ResolverTypeWrapper<RefreshTokenResponse>;
  Refund: ResolverTypeWrapper<Refund>;
  RemoveFromCartInput: RemoveFromCartInput;
  Restaurant: ResolverTypeWrapper<Restaurant>;
  RestaurantOrderQueue: ResolverTypeWrapper<Omit<RestaurantOrderQueue, 'pendingOrders' | 'preparingOrders' | 'readyOrders'> & { pendingOrders: Array<ResolversTypes['Order']>, preparingOrders: Array<ResolversTypes['Order']>, readyOrders: Array<ResolversTypes['Order']> }>;
  Review: ResolverTypeWrapper<Review>;
  ReviewType: ResolverTypeWrapper<'COURIER' | 'RESTAURANT'>;
  SignupInput: SignupInput;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateCartItemInput: UpdateCartItemInput;
  UpdateCourierLocationInput: UpdateCourierLocationInput;
  User: ResolverTypeWrapper<User>;
  UserRole: ResolverTypeWrapper<'ADMIN' | 'COURIER' | 'CUSTOMER' | 'MERCHANT'>;
  VehicleType: ResolverTypeWrapper<'BICYCLE' | 'CAR' | 'MOTORCYCLE' | 'WALKING'>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddToCartInput: AddToCartInput;
  String: Scalars['String']['output'];
  Int: Scalars['Int']['output'];
  Address: Address;
  ID: Scalars['ID']['output'];
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  AuthResponse: Omit<AuthResponse, 'user'> & { user: ResolversParentTypes['User'] };
  BillingPortalSession: BillingPortalSession;
  Cart: Cart;
  CartItem: CartItem;
  CheckoutSession: CheckoutSession;
  CourierLocationUpdate: CourierLocationUpdate;
  CourierProfile: CourierProfile;
  CourierStatusUpdate: CourierStatusUpdate;
  CreateBillingPortalSessionInput: CreateBillingPortalSessionInput;
  CreateCheckoutSessionInput: CreateCheckoutSessionInput;
  CreateOrderInput: CreateOrderInput;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreateRefundInput: CreateRefundInput;
  CreateReviewInput: CreateReviewInput;
  CustomerOrderTracking: Omit<CustomerOrderTracking, 'courier'> & { courier?: Maybe<ResolversParentTypes['User']> };
  DateTime: Scalars['DateTime']['output'];
  Delivery: Delivery;
  DeliveryAssignment: DeliveryAssignment;
  DeliveryStatusUpdate: DeliveryStatusUpdate;
  JSON: Scalars['JSON']['output'];
  Location: Location;
  LoginInput: LoginInput;
  MenuCategory: Omit<MenuCategory, 'menuItems'> & { menuItems: Array<ResolversParentTypes['MenuItem']> };
  MenuItem: MenuItem;
  MenuItemOption: MenuItemOption;
  Mutation: {};
  OptionValue: OptionValue;
  Order: Order;
  OrderEvent: OrderEvent;
  OrderItem: OrderItem;
  OrderUpdate: OrderUpdate;
  PaymentIntent: PaymentIntent;
  Payout: Payout;
  Query: {};
  RefreshTokenResponse: RefreshTokenResponse;
  Refund: Refund;
  RemoveFromCartInput: RemoveFromCartInput;
  Restaurant: Restaurant;
  RestaurantOrderQueue: Omit<RestaurantOrderQueue, 'pendingOrders' | 'preparingOrders' | 'readyOrders'> & { pendingOrders: Array<ResolversParentTypes['Order']>, preparingOrders: Array<ResolversParentTypes['Order']>, readyOrders: Array<ResolversParentTypes['Order']> };
  Review: Review;
  SignupInput: SignupInput;
  Subscription: {};
  UpdateCartItemInput: UpdateCartItemInput;
  UpdateCourierLocationInput: UpdateCourierLocationInput;
  User: User;
};

export type AddressResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDefault?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  zipCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BillingPortalSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BillingPortalSession'] = ResolversParentTypes['BillingPortalSession']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  returnUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Cart'] = ResolversParentTypes['Cart']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CartItem']>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CartItem'] = ResolversParentTypes['CartItem']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  menuItem?: Resolver<Maybe<ResolversTypes['MenuItem']>, ParentType, ContextType>;
  menuItemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  selectedOptions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  specialInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CheckoutSession'] = ResolversParentTypes['CheckoutSession']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customerEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentIntentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourierLocationUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CourierLocationUpdate'] = ResolversParentTypes['CourierLocationUpdate']> = {
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  estimatedArrival?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourierProfileResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CourierProfile'] = ResolversParentTypes['CourierProfile']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  licensePlate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  reviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalDeliveries?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vehicleType?: Resolver<ResolversTypes['VehicleType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourierStatusUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CourierStatusUpdate'] = ResolversParentTypes['CourierStatusUpdate']> = {
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomerOrderTrackingResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerOrderTracking'] = ResolversParentTypes['CustomerOrderTracking']> = {
  courier?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  currentLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  estimatedDelivery?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeliveryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Delivery'] = ResolversParentTypes['Delivery']> = {
  acceptedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  assignedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  courier?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  deliveredAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  estimatedArrival?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pickedUpAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DeliveryStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryAssignmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeliveryAssignment'] = ResolversParentTypes['DeliveryAssignment']> = {
  assignedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryStatusResolvers = EnumResolverSignature<{ ACCEPTED?: any, ASSIGNED?: any, CANCELLED?: any, DELIVERED?: any, PICKED_UP?: any }, ResolversTypes['DeliveryStatus']>;

export type DeliveryStatusUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeliveryStatusUpdate'] = ResolversParentTypes['DeliveryStatusUpdate']> = {
  deliveryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DeliveryStatus'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LocationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuCategoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MenuCategory'] = ResolversParentTypes['MenuCategory']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  menuItems?: Resolver<Array<ResolversTypes['MenuItem']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MenuItem'] = ResolversParentTypes['MenuItem']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPopular?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['MenuItemOption']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuItemOptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MenuItemOption'] = ResolversParentTypes['MenuItemOption']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OptionType'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['OptionValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptDelivery?: Resolver<ResolversTypes['Delivery'], ParentType, ContextType, RequireFields<MutationacceptDeliveryArgs, 'deliveryId'>>;
  addToCart?: Resolver<ResolversTypes['CartItem'], ParentType, ContextType, RequireFields<MutationaddToCartArgs, 'input'>>;
  cancelPaymentIntent?: Resolver<ResolversTypes['PaymentIntent'], ParentType, ContextType, RequireFields<MutationcancelPaymentIntentArgs, 'paymentIntentId'>>;
  clearCart?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  confirmOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationconfirmOrderArgs, 'orderId'>>;
  confirmPaymentIntent?: Resolver<ResolversTypes['PaymentIntent'], ParentType, ContextType, RequireFields<MutationconfirmPaymentIntentArgs, 'paymentIntentId'>>;
  createBillingPortalSession?: Resolver<ResolversTypes['BillingPortalSession'], ParentType, ContextType, RequireFields<MutationcreateBillingPortalSessionArgs, 'input'>>;
  createCheckoutSession?: Resolver<ResolversTypes['CheckoutSession'], ParentType, ContextType, RequireFields<MutationcreateCheckoutSessionArgs, 'input'>>;
  createPaymentIntent?: Resolver<ResolversTypes['PaymentIntent'], ParentType, ContextType, RequireFields<MutationcreatePaymentIntentArgs, 'input'>>;
  createRefund?: Resolver<ResolversTypes['Refund'], ParentType, ContextType, RequireFields<MutationcreateRefundArgs, 'input'>>;
  createReview?: Resolver<ResolversTypes['Review'], ParentType, ContextType, RequireFields<MutationcreateReviewArgs, 'input'>>;
  deliverOrder?: Resolver<ResolversTypes['Delivery'], ParentType, ContextType, RequireFields<MutationdeliverOrderArgs, 'deliveryId'>>;
  login?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationloginArgs, 'input'>>;
  loginWithGoogle?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationloginWithGoogleArgs, 'idToken'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  pickupOrder?: Resolver<ResolversTypes['Delivery'], ParentType, ContextType, RequireFields<MutationpickupOrderArgs, 'deliveryId'>>;
  placeOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationplaceOrderArgs, 'input'>>;
  refreshToken?: Resolver<ResolversTypes['RefreshTokenResponse'], ParentType, ContextType, RequireFields<MutationrefreshTokenArgs, 'refreshToken'>>;
  removeFromCart?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationremoveFromCartArgs, 'input'>>;
  setRestaurantOpen?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationsetRestaurantOpenArgs, 'id' | 'isOpen'>>;
  signup?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationsignupArgs, 'input'>>;
  toggleFavorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationtoggleFavoriteArgs, 'restaurantId'>>;
  updateCartItem?: Resolver<ResolversTypes['CartItem'], ParentType, ContextType, RequireFields<MutationupdateCartItemArgs, 'input'>>;
  updateCourierLocation?: Resolver<ResolversTypes['CourierProfile'], ParentType, ContextType, RequireFields<MutationupdateCourierLocationArgs, 'input'>>;
};

export type OptionTypeResolvers = EnumResolverSignature<{ MULTIPLE?: any, SINGLE?: any }, ResolversTypes['OptionType']>;

export type OptionValueResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OptionValue'] = ResolversParentTypes['OptionValue']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDefault?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  courier?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customer?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  deliveryAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryFee?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  estimatedDeliveryTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['OrderEvent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>;
  orderNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentStatus?: Resolver<ResolversTypes['PaymentStatus'], ParentType, ContextType>;
  restaurant?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType>;
  specialInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tip?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderEvent'] = ResolversParentTypes['OrderEvent']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  menuItem?: Resolver<Maybe<ResolversTypes['MenuItem']>, ParentType, ContextType>;
  menuItemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  selectedOptions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  specialInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderStatusResolvers = EnumResolverSignature<{ CANCELLED?: any, CONFIRMED?: any, DELIVERED?: any, PENDING?: any, PICKED_UP?: any, PREPARING?: any, READY?: any }, ResolversTypes['OrderStatus']>;

export type OrderUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderUpdate'] = ResolversParentTypes['OrderUpdate']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentIntentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PaymentIntent'] = ResolversParentTypes['PaymentIntent']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  clientSecret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentStatusResolvers = EnumResolverSignature<{ FAILED?: any, PAID?: any, PENDING?: any, REFUNDED?: any }, ResolversTypes['PaymentStatus']>;

export type PayoutResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Payout'] = ResolversParentTypes['Payout']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  processedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  restaurant?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PayoutStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PayoutStatusResolvers = EnumResolverSignature<{ FAILED?: any, PENDING?: any, PROCESSED?: any }, ResolversTypes['PayoutStatus']>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  cart?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType>;
  courierAssignments?: Resolver<Array<ResolversTypes['Delivery']>, ParentType, ContextType>;
  favoriteRestaurants?: Resolver<Array<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  merchantOrders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType, Partial<QuerymerchantOrdersArgs>>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryorderArgs, 'id'>>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType, Partial<QueryordersArgs>>;
  paymentIntent?: Resolver<Maybe<ResolversTypes['PaymentIntent']>, ParentType, ContextType, RequireFields<QuerypaymentIntentArgs, 'paymentIntentId'>>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType, RequireFields<QueryrestaurantArgs, 'slug'>>;
  restaurants?: Resolver<Array<ResolversTypes['Restaurant']>, ParentType, ContextType, Partial<QueryrestaurantsArgs>>;
  reviews?: Resolver<Array<ResolversTypes['Review']>, ParentType, ContextType, Partial<QueryreviewsArgs>>;
};

export type RefreshTokenResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RefreshTokenResponse'] = ResolversParentTypes['RefreshTokenResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefundResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Refund'] = ResolversParentTypes['Refund']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Restaurant'] = ResolversParentTypes['Restaurant']> = {
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  cuisine?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryFee?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  deliveryTime?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isFavorite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isOpen?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  menuCategories?: Resolver<Array<ResolversTypes['MenuCategory']>, ParentType, ContextType>;
  minimumOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  reviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantOrderQueueResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RestaurantOrderQueue'] = ResolversParentTypes['RestaurantOrderQueue']> = {
  pendingOrders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  preparingOrders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  readyOrders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courier?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customer?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ReviewType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewTypeResolvers = EnumResolverSignature<{ COURIER?: any, RESTAURANT?: any }, ResolversTypes['ReviewType']>;

export type SubscriptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  courierLocation?: SubscriptionResolver<ResolversTypes['CourierLocationUpdate'], "courierLocation", ParentType, ContextType, RequireFields<SubscriptioncourierLocationArgs, 'deliveryId'>>;
  courierStatusChanged?: SubscriptionResolver<ResolversTypes['CourierStatusUpdate'], "courierStatusChanged", ParentType, ContextType>;
  customerOrderTracking?: SubscriptionResolver<ResolversTypes['CustomerOrderTracking'], "customerOrderTracking", ParentType, ContextType, RequireFields<SubscriptioncustomerOrderTrackingArgs, 'orderId'>>;
  deliveryAssigned?: SubscriptionResolver<ResolversTypes['DeliveryAssignment'], "deliveryAssigned", ParentType, ContextType, RequireFields<SubscriptiondeliveryAssignedArgs, 'courierId'>>;
  deliveryStatusChanged?: SubscriptionResolver<ResolversTypes['DeliveryStatusUpdate'], "deliveryStatusChanged", ParentType, ContextType, RequireFields<SubscriptiondeliveryStatusChangedArgs, 'deliveryId'>>;
  liveCourierTracking?: SubscriptionResolver<ResolversTypes['CourierLocationUpdate'], "liveCourierTracking", ParentType, ContextType, RequireFields<SubscriptionliveCourierTrackingArgs, 'courierId'>>;
  merchantIncomingOrders?: SubscriptionResolver<ResolversTypes['Order'], "merchantIncomingOrders", ParentType, ContextType, RequireFields<SubscriptionmerchantIncomingOrdersArgs, 'restaurantId'>>;
  orderStatusChanged?: SubscriptionResolver<ResolversTypes['OrderEvent'], "orderStatusChanged", ParentType, ContextType, RequireFields<SubscriptionorderStatusChangedArgs, 'orderId'>>;
  realTimeOrderUpdates?: SubscriptionResolver<ResolversTypes['OrderUpdate'], "realTimeOrderUpdates", ParentType, ContextType, RequireFields<SubscriptionrealTimeOrderUpdatesArgs, 'orderId'>>;
  restaurantOrderQueue?: SubscriptionResolver<ResolversTypes['RestaurantOrderQueue'], "restaurantOrderQueue", ParentType, ContextType, RequireFields<SubscriptionrestaurantOrderQueueArgs, 'restaurantId'>>;
};

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  addresses?: Resolver<Array<ResolversTypes['Address']>, ParentType, ContextType>;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courierProfile?: Resolver<Maybe<ResolversTypes['CourierProfile']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRoleResolvers = EnumResolverSignature<{ ADMIN?: any, COURIER?: any, CUSTOMER?: any, MERCHANT?: any }, ResolversTypes['UserRole']>;

export type VehicleTypeResolvers = EnumResolverSignature<{ BICYCLE?: any, CAR?: any, MOTORCYCLE?: any, WALKING?: any }, ResolversTypes['VehicleType']>;

export type Resolvers<ContextType = GraphQLContext> = {
  Address?: AddressResolvers<ContextType>;
  AuthResponse?: AuthResponseResolvers<ContextType>;
  BillingPortalSession?: BillingPortalSessionResolvers<ContextType>;
  Cart?: CartResolvers<ContextType>;
  CartItem?: CartItemResolvers<ContextType>;
  CheckoutSession?: CheckoutSessionResolvers<ContextType>;
  CourierLocationUpdate?: CourierLocationUpdateResolvers<ContextType>;
  CourierProfile?: CourierProfileResolvers<ContextType>;
  CourierStatusUpdate?: CourierStatusUpdateResolvers<ContextType>;
  CustomerOrderTracking?: CustomerOrderTrackingResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Delivery?: DeliveryResolvers<ContextType>;
  DeliveryAssignment?: DeliveryAssignmentResolvers<ContextType>;
  DeliveryStatus?: DeliveryStatusResolvers;
  DeliveryStatusUpdate?: DeliveryStatusUpdateResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Location?: LocationResolvers<ContextType>;
  MenuCategory?: MenuCategoryResolvers<ContextType>;
  MenuItem?: MenuItemResolvers<ContextType>;
  MenuItemOption?: MenuItemOptionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OptionType?: OptionTypeResolvers;
  OptionValue?: OptionValueResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderEvent?: OrderEventResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  OrderStatus?: OrderStatusResolvers;
  OrderUpdate?: OrderUpdateResolvers<ContextType>;
  PaymentIntent?: PaymentIntentResolvers<ContextType>;
  PaymentStatus?: PaymentStatusResolvers;
  Payout?: PayoutResolvers<ContextType>;
  PayoutStatus?: PayoutStatusResolvers;
  Query?: QueryResolvers<ContextType>;
  RefreshTokenResponse?: RefreshTokenResponseResolvers<ContextType>;
  Refund?: RefundResolvers<ContextType>;
  Restaurant?: RestaurantResolvers<ContextType>;
  RestaurantOrderQueue?: RestaurantOrderQueueResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  ReviewType?: ReviewTypeResolvers;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserRole?: UserRoleResolvers;
  VehicleType?: VehicleTypeResolvers;
};

