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
  DateTime: { input: Date; output: Date; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
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

export enum DeliveryStatus {
  Accepted = 'ACCEPTED',
  Assigned = 'ASSIGNED',
  Cancelled = 'CANCELLED',
  Delivered = 'DELIVERED',
  PickedUp = 'PICKED_UP'
}

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
  Multiple = 'MULTIPLE',
  Single = 'SINGLE'
}

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

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Delivered = 'DELIVERED',
  Pending = 'PENDING',
  PickedUp = 'PICKED_UP',
  Preparing = 'PREPARING',
  Ready = 'READY'
}

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

export enum PaymentStatus {
  Failed = 'FAILED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

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

export enum PayoutStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processed = 'PROCESSED'
}

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

export enum ReviewType {
  Courier = 'COURIER',
  Restaurant = 'RESTAURANT'
}

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


export type SubscriptionCourierLocationArgs = {
  deliveryId: Scalars['String']['input'];
};


export type SubscriptionCustomerOrderTrackingArgs = {
  orderId: Scalars['String']['input'];
};


export type SubscriptionDeliveryAssignedArgs = {
  courierId: Scalars['String']['input'];
};


export type SubscriptionDeliveryStatusChangedArgs = {
  deliveryId: Scalars['String']['input'];
};


export type SubscriptionLiveCourierTrackingArgs = {
  courierId: Scalars['String']['input'];
};


export type SubscriptionMerchantIncomingOrdersArgs = {
  restaurantId: Scalars['String']['input'];
};


export type SubscriptionOrderStatusChangedArgs = {
  orderId: Scalars['String']['input'];
};


export type SubscriptionRealTimeOrderUpdatesArgs = {
  orderId: Scalars['String']['input'];
};


export type SubscriptionRestaurantOrderQueueArgs = {
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

export enum UserRole {
  Admin = 'ADMIN',
  Courier = 'COURIER',
  Customer = 'CUSTOMER',
  Merchant = 'MERCHANT'
}

export enum VehicleType {
  Bicycle = 'BICYCLE',
  Car = 'CAR',
  Motorcycle = 'MOTORCYCLE',
  Walking = 'WALKING'
}
