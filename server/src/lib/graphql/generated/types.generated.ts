import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date | string; output: Date | string; }
  /** A location object with latitude and longitude */
  Location: { input: any; output: any; }
  /** A location input object with latitude and longitude */
  LocationInput: { input: any; output: any; }
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
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  zipCode: Scalars['String']['output'];
};

export type AddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type AssignCourierInput = {
  courierId: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
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
  customerEmail: Scalars['String']['output'];
  customerId: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  status: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CourierLocationUpdate = {
  __typename?: 'CourierLocationUpdate';
  deliveryId: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type CourierProfile = {
  __typename?: 'CourierProfile';
  createdAt: Scalars['String']['output'];
  currentLocation?: Maybe<Scalars['Location']['output']>;
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

export type CourierProfileInput = {
  currentLocation?: InputMaybe<Scalars['LocationInput']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  licensePlate?: InputMaybe<Scalars['String']['input']>;
  vehicleType: VehicleType;
};

export type CourierStatusUpdate = {
  __typename?: 'CourierStatusUpdate';
  courierId: Scalars['String']['output'];
  isAvailable: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CourierTrackingUpdate = {
  __typename?: 'CourierTrackingUpdate';
  courierId: Scalars['String']['output'];
  deliveryId: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

export type CreateBillingPortalSessionInput = {
  customerId: Scalars['String']['input'];
  returnUrl: Scalars['String']['input'];
};

export type CreateCheckoutSessionInput = {
  cancelUrl: Scalars['String']['input'];
  priceId: Scalars['String']['input'];
  successUrl: Scalars['String']['input'];
};

export type CreateCourierProfileInput = {
  currentLocation?: InputMaybe<Scalars['LocationInput']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  licensePlate?: InputMaybe<Scalars['String']['input']>;
  vehicleType: VehicleType;
};

export type CreateInvoiceInput = {
  courierAmount: Scalars['String']['input'];
  courierId?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['String']['input'];
  platformFee: Scalars['String']['input'];
  restaurantAmount: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};

export type CreateMenuCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMenuItemInput = {
  categoryId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMenuItemOptionInput = {
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  menuItemId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  type: MenuItemOptionType;
};

export type CreateMenuItemOptionValueInput = {
  name: Scalars['String']['input'];
  optionId: Scalars['String']['input'];
  price: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateOrderInput = {
  deliveryAddress: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
  stripePaymentIntentId?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePaymentIntentInput = {
  amount: Scalars['String']['input'];
  currency: Scalars['String']['input'];
};

export type CreateRefundInput = {
  amount?: InputMaybe<Scalars['String']['input']>;
  paymentIntentId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRestaurantInput = {
  address: AddressInput;
  cuisine: Scalars['String']['input'];
  deliveryFee: Scalars['String']['input'];
  deliveryTime: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  minimumOrder: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};

export type CreateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
  type: ReviewType;
};

export type Delivery = {
  __typename?: 'Delivery';
  assignedAt: Scalars['DateTime']['output'];
  courier?: Maybe<User>;
  courierId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentLocation?: Maybe<Scalars['Location']['output']>;
  estimatedArrival?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  order?: Maybe<Order>;
  orderId: Scalars['String']['output'];
  status: DeliveryStatus;
  updatedAt: Scalars['String']['output'];
};

export type DeliveryAssignment = {
  __typename?: 'DeliveryAssignment';
  assignedAt: Scalars['String']['output'];
  courierId: Scalars['String']['output'];
  deliveryId: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
};

export type DeliveryStatus =
  | 'accepted'
  | 'assigned'
  | 'delivered'
  | 'picked_up';

export type DeliveryStatusUpdate = {
  __typename?: 'DeliveryStatusUpdate';
  deliveryId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Invoice = {
  __typename?: 'Invoice';
  courier?: Maybe<User>;
  courierAmount: Scalars['String']['output'];
  courierId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  order?: Maybe<Order>;
  orderId: Scalars['String']['output'];
  platformFee: Scalars['String']['output'];
  restaurant?: Maybe<Restaurant>;
  restaurantAmount: Scalars['String']['output'];
  restaurantId: Scalars['String']['output'];
  status: InvoiceStatus;
  stripeTransferId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type InvoiceStatus =
  | 'failed'
  | 'paid'
  | 'pending';

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
  name: Scalars['String']['output'];
  options?: Maybe<Array<Maybe<MenuItemOption>>>;
  price: Scalars['String']['output'];
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
  type: MenuItemOptionType;
  updatedAt: Scalars['String']['output'];
  values?: Maybe<Array<Maybe<MenuItemOptionValue>>>;
};

export type MenuItemOptionType =
  | 'multiple'
  | 'single';

export type MenuItemOptionValue = {
  __typename?: 'MenuItemOptionValue';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  optionId: Scalars['String']['output'];
  price: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
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
  createInvoice?: Maybe<Invoice>;
  createPaymentIntent?: Maybe<PaymentIntent>;
  createRefund?: Maybe<Refund>;
  createReview?: Maybe<Review>;
  deliverOrder?: Maybe<Delivery>;
  login?: Maybe<AuthResponse>;
  loginWithGoogle?: Maybe<AuthResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  markPayoutFailed?: Maybe<Invoice>;
  pickupOrder?: Maybe<Delivery>;
  placeOrder?: Maybe<Order>;
  processPayout?: Maybe<Invoice>;
  refreshToken?: Maybe<RefreshTokenResponse>;
  removeFromCart?: Maybe<Scalars['Boolean']['output']>;
  setRestaurantOpen?: Maybe<Restaurant>;
  signup?: Maybe<AuthResponse>;
  toggleFavorite?: Maybe<Scalars['Boolean']['output']>;
  updateCartItem?: Maybe<CartItem>;
  updateCourierLocation?: Maybe<CourierProfile>;
  updateInvoiceStatus?: Maybe<Invoice>;
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


export type MutationcreateInvoiceArgs = {
  input: CreateInvoiceInput;
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


export type MutationmarkPayoutFailedArgs = {
  invoiceId: Scalars['String']['input'];
};


export type MutationpickupOrderArgs = {
  deliveryId: Scalars['String']['input'];
};


export type MutationplaceOrderArgs = {
  input: CreateOrderInput;
};


export type MutationprocessPayoutArgs = {
  input: ProcessPayoutInput;
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


export type MutationupdateInvoiceStatusArgs = {
  input: UpdateInvoiceStatusInput;
};

export type Order = {
  __typename?: 'Order';
  courier?: Maybe<User>;
  courierId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customer?: Maybe<User>;
  customerId: Scalars['String']['output'];
  deliveryAddress: Scalars['String']['output'];
  deliveryFee: Scalars['String']['output'];
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
  stripePaymentIntentId?: Maybe<Scalars['String']['output']>;
  stripeSessionId?: Maybe<Scalars['String']['output']>;
  subtotal: Scalars['String']['output'];
  tax: Scalars['String']['output'];
  tip: Scalars['String']['output'];
  total: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type OrderEvent = {
  __typename?: 'OrderEvent';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  eventType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  order?: Maybe<Order>;
  orderId: Scalars['String']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  menuItem?: Maybe<MenuItem>;
  menuItemId: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
  price: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selectedOptions: Scalars['String']['output'];
  specialInstructions?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type OrderQueueUpdate = {
  __typename?: 'OrderQueueUpdate';
  queueLength: Scalars['Int']['output'];
  restaurantId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type OrderStatus =
  | 'cancelled'
  | 'confirmed'
  | 'delivered'
  | 'pending'
  | 'picked_up'
  | 'preparing'
  | 'ready';

export type OrderTrackingUpdate = {
  __typename?: 'OrderTrackingUpdate';
  courierId?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type OrderUpdate = {
  __typename?: 'OrderUpdate';
  message?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
  amount: Scalars['String']['output'];
  clientSecret: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type PaymentStatus =
  | 'failed'
  | 'paid'
  | 'pending'
  | 'refunded';

export type Payout = {
  __typename?: 'Payout';
  amount: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  failureReason?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  processedAt?: Maybe<Scalars['String']['output']>;
  recipient?: Maybe<User>;
  recipientId: Scalars['String']['output'];
  recipientType: Scalars['String']['output'];
  restaurant?: Maybe<Restaurant>;
  status: PayoutStatus;
  stripePayoutId?: Maybe<Scalars['String']['output']>;
  stripeTransferId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type PayoutStatus =
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'pending'
  | 'processing';

export type ProcessPayoutInput = {
  invoiceId: Scalars['String']['input'];
  stripeTransferId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  cart?: Maybe<Cart>;
  courierAssignments: Array<Maybe<Delivery>>;
  favoriteRestaurants: Array<Maybe<Restaurant>>;
  invoice?: Maybe<Invoice>;
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  me?: Maybe<User>;
  merchantOrders: Array<Maybe<Order>>;
  order?: Maybe<Order>;
  orders: Array<Maybe<Order>>;
  paymentIntent?: Maybe<PaymentIntent>;
  payoutSummary?: Maybe<Scalars['String']['output']>;
  restaurant?: Maybe<Restaurant>;
  restaurants: Array<Maybe<Restaurant>>;
  reviews: Array<Maybe<Review>>;
};


export type QueryinvoiceArgs = {
  id: Scalars['String']['input'];
};


export type QueryinvoicesArgs = {
  courierId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  restaurantId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<InvoiceStatus>;
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


export type QuerypayoutSummaryArgs = {
  role: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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
  amount: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type RemoveFromCartInput = {
  cartItemId: Scalars['String']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  address?: Maybe<Address>;
  addressId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  cuisine: Scalars['String']['output'];
  deliveryFee: Scalars['String']['output'];
  deliveryTime: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isOpen: Scalars['Boolean']['output'];
  menuCategories?: Maybe<Array<Maybe<MenuCategory>>>;
  menuItems?: Maybe<Array<Maybe<MenuItem>>>;
  minimumOrder: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<User>;
  ownerId: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  reviewCount: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};


export type RestaurantmenuItemsArgs = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  courier?: Maybe<User>;
  createdAt: Scalars['String']['output'];
  customer?: Maybe<User>;
  customerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  restaurant?: Maybe<Restaurant>;
  type: ReviewType;
  updatedAt: Scalars['String']['output'];
};

export type ReviewType =
  | 'courier'
  | 'restaurant';

export type SignupInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
};

export type Subscription = {
  __typename?: 'Subscription';
  courierLocation?: Maybe<CourierLocationUpdate>;
  courierStatusChanged?: Maybe<CourierStatusUpdate>;
  customerOrderTracking?: Maybe<OrderTrackingUpdate>;
  deliveryAssigned?: Maybe<DeliveryAssignment>;
  deliveryStatusChanged?: Maybe<DeliveryStatusUpdate>;
  liveCourierTracking?: Maybe<CourierTrackingUpdate>;
  merchantIncomingOrders?: Maybe<Order>;
  orderStatusChanged?: Maybe<OrderEvent>;
  realTimeOrderUpdates?: Maybe<OrderUpdate>;
  restaurantOrderQueue?: Maybe<OrderQueueUpdate>;
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
  quantity?: InputMaybe<Scalars['Int']['input']>;
  selectedOptions?: InputMaybe<Scalars['String']['input']>;
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCourierLocationInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type UpdateCourierProfileInput = {
  currentLocation?: InputMaybe<Scalars['LocationInput']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  licensePlate?: InputMaybe<Scalars['String']['input']>;
  vehicleType?: InputMaybe<VehicleType>;
};

export type UpdateInvoiceStatusInput = {
  id: Scalars['String']['input'];
  status: InvoiceStatus;
  stripeTransferId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMenuCategoryInput = {
  categoryId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateMenuItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  menuItemId: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateOrderStatusInput = {
  orderId: Scalars['String']['input'];
  status: OrderStatus;
};

export type UpdateProfileInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRestaurantInput = {
  address?: InputMaybe<AddressInput>;
  cuisine?: InputMaybe<Scalars['String']['input']>;
  deliveryFee?: InputMaybe<Scalars['String']['input']>;
  deliveryTime?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isOpen?: InputMaybe<Scalars['Boolean']['input']>;
  minimumOrder?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  reviewId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  courierProfile?: Maybe<CourierProfile>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['String']['output'];
};

export type UserRole =
  | 'admin'
  | 'courier'
  | 'customer'
  | 'restaurant';

export type VehicleType =
  | 'bike'
  | 'car'
  | 'motorcycle';



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
  Address: ResolverTypeWrapper<Omit<Address, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  AddressInput: AddressInput;
  AssignCourierInput: AssignCourierInput;
  AuthResponse: ResolverTypeWrapper<Omit<AuthResponse, 'user'> & { user: ResolversTypes['User'] }>;
  BillingPortalSession: ResolverTypeWrapper<BillingPortalSession>;
  Cart: ResolverTypeWrapper<Omit<Cart, 'items'> & { items?: Maybe<Array<Maybe<ResolversTypes['CartItem']>>> }>;
  CartItem: ResolverTypeWrapper<Omit<CartItem, 'menuItem'> & { menuItem?: Maybe<ResolversTypes['MenuItem']> }>;
  CheckoutSession: ResolverTypeWrapper<CheckoutSession>;
  CourierLocationUpdate: ResolverTypeWrapper<CourierLocationUpdate>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  CourierProfile: ResolverTypeWrapper<Omit<CourierProfile, 'user' | 'vehicleType'> & { user?: Maybe<ResolversTypes['User']>, vehicleType: ResolversTypes['VehicleType'] }>;
  CourierProfileInput: CourierProfileInput;
  CourierStatusUpdate: ResolverTypeWrapper<CourierStatusUpdate>;
  CourierTrackingUpdate: ResolverTypeWrapper<CourierTrackingUpdate>;
  CreateBillingPortalSessionInput: CreateBillingPortalSessionInput;
  CreateCheckoutSessionInput: CreateCheckoutSessionInput;
  CreateCourierProfileInput: CreateCourierProfileInput;
  CreateInvoiceInput: CreateInvoiceInput;
  CreateMenuCategoryInput: CreateMenuCategoryInput;
  CreateMenuItemInput: CreateMenuItemInput;
  CreateMenuItemOptionInput: CreateMenuItemOptionInput;
  CreateMenuItemOptionValueInput: CreateMenuItemOptionValueInput;
  CreateOrderInput: CreateOrderInput;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreateRefundInput: CreateRefundInput;
  CreateRestaurantInput: CreateRestaurantInput;
  CreateReviewInput: CreateReviewInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Delivery: ResolverTypeWrapper<Omit<Delivery, 'courier' | 'order' | 'status'> & { courier?: Maybe<ResolversTypes['User']>, order?: Maybe<ResolversTypes['Order']>, status: ResolversTypes['DeliveryStatus'] }>;
  DeliveryAssignment: ResolverTypeWrapper<DeliveryAssignment>;
  DeliveryStatus: ResolverTypeWrapper<'accepted' | 'assigned' | 'delivered' | 'picked_up'>;
  DeliveryStatusUpdate: ResolverTypeWrapper<DeliveryStatusUpdate>;
  Invoice: ResolverTypeWrapper<Omit<Invoice, 'courier' | 'order' | 'restaurant' | 'status'> & { courier?: Maybe<ResolversTypes['User']>, order?: Maybe<ResolversTypes['Order']>, restaurant?: Maybe<ResolversTypes['Restaurant']>, status: ResolversTypes['InvoiceStatus'] }>;
  InvoiceStatus: ResolverTypeWrapper<'failed' | 'paid' | 'pending'>;
  Location: ResolverTypeWrapper<Scalars['Location']['output']>;
  LocationInput: ResolverTypeWrapper<Scalars['LocationInput']['output']>;
  LoginInput: LoginInput;
  MenuCategory: ResolverTypeWrapper<Omit<MenuCategory, 'menuItems'> & { menuItems?: Maybe<Array<Maybe<ResolversTypes['MenuItem']>>> }>;
  MenuItem: ResolverTypeWrapper<Omit<MenuItem, 'options'> & { options?: Maybe<Array<Maybe<ResolversTypes['MenuItemOption']>>> }>;
  MenuItemOption: ResolverTypeWrapper<Omit<MenuItemOption, 'type'> & { type: ResolversTypes['MenuItemOptionType'] }>;
  MenuItemOptionType: ResolverTypeWrapper<'multiple' | 'single'>;
  MenuItemOptionValue: ResolverTypeWrapper<MenuItemOptionValue>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Omit<Order, 'courier' | 'customer' | 'events' | 'items' | 'paymentStatus' | 'restaurant' | 'status'> & { courier?: Maybe<ResolversTypes['User']>, customer?: Maybe<ResolversTypes['User']>, events?: Maybe<Array<Maybe<ResolversTypes['OrderEvent']>>>, items?: Maybe<Array<Maybe<ResolversTypes['OrderItem']>>>, paymentStatus: ResolversTypes['PaymentStatus'], restaurant?: Maybe<ResolversTypes['Restaurant']>, status: ResolversTypes['OrderStatus'] }>;
  OrderEvent: ResolverTypeWrapper<Omit<OrderEvent, 'order'> & { order?: Maybe<ResolversTypes['Order']> }>;
  OrderItem: ResolverTypeWrapper<Omit<OrderItem, 'menuItem'> & { menuItem?: Maybe<ResolversTypes['MenuItem']> }>;
  OrderQueueUpdate: ResolverTypeWrapper<OrderQueueUpdate>;
  OrderStatus: ResolverTypeWrapper<'cancelled' | 'confirmed' | 'delivered' | 'pending' | 'picked_up' | 'preparing' | 'ready'>;
  OrderTrackingUpdate: ResolverTypeWrapper<OrderTrackingUpdate>;
  OrderUpdate: ResolverTypeWrapper<OrderUpdate>;
  PaymentIntent: ResolverTypeWrapper<PaymentIntent>;
  PaymentStatus: ResolverTypeWrapper<'failed' | 'paid' | 'pending' | 'refunded'>;
  Payout: ResolverTypeWrapper<Omit<Payout, 'recipient' | 'restaurant' | 'status'> & { recipient?: Maybe<ResolversTypes['User']>, restaurant?: Maybe<ResolversTypes['Restaurant']>, status: ResolversTypes['PayoutStatus'] }>;
  PayoutStatus: ResolverTypeWrapper<'cancelled' | 'completed' | 'failed' | 'pending' | 'processing'>;
  ProcessPayoutInput: ProcessPayoutInput;
  Query: ResolverTypeWrapper<{}>;
  RefreshTokenResponse: ResolverTypeWrapper<RefreshTokenResponse>;
  Refund: ResolverTypeWrapper<Refund>;
  RemoveFromCartInput: RemoveFromCartInput;
  Restaurant: ResolverTypeWrapper<Omit<Restaurant, 'address' | 'menuCategories' | 'menuItems' | 'owner'> & { address?: Maybe<ResolversTypes['Address']>, menuCategories?: Maybe<Array<Maybe<ResolversTypes['MenuCategory']>>>, menuItems?: Maybe<Array<Maybe<ResolversTypes['MenuItem']>>>, owner?: Maybe<ResolversTypes['User']> }>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Review: ResolverTypeWrapper<Omit<Review, 'courier' | 'customer' | 'restaurant' | 'type'> & { courier?: Maybe<ResolversTypes['User']>, customer?: Maybe<ResolversTypes['User']>, restaurant?: Maybe<ResolversTypes['Restaurant']>, type: ResolversTypes['ReviewType'] }>;
  ReviewType: ResolverTypeWrapper<'courier' | 'restaurant'>;
  SignupInput: SignupInput;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateCartItemInput: UpdateCartItemInput;
  UpdateCourierLocationInput: UpdateCourierLocationInput;
  UpdateCourierProfileInput: UpdateCourierProfileInput;
  UpdateInvoiceStatusInput: UpdateInvoiceStatusInput;
  UpdateMenuCategoryInput: UpdateMenuCategoryInput;
  UpdateMenuItemInput: UpdateMenuItemInput;
  UpdateOrderStatusInput: UpdateOrderStatusInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateRestaurantInput: UpdateRestaurantInput;
  UpdateReviewInput: UpdateReviewInput;
  User: ResolverTypeWrapper<Omit<User, 'courierProfile' | 'role'> & { courierProfile?: Maybe<ResolversTypes['CourierProfile']>, role: ResolversTypes['UserRole'] }>;
  UserRole: ResolverTypeWrapper<'admin' | 'courier' | 'customer' | 'restaurant'>;
  VehicleType: ResolverTypeWrapper<'bike' | 'car' | 'motorcycle'>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddToCartInput: AddToCartInput;
  String: Scalars['String']['output'];
  Int: Scalars['Int']['output'];
  Address: Omit<Address, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  Boolean: Scalars['Boolean']['output'];
  AddressInput: AddressInput;
  AssignCourierInput: AssignCourierInput;
  AuthResponse: Omit<AuthResponse, 'user'> & { user: ResolversParentTypes['User'] };
  BillingPortalSession: BillingPortalSession;
  Cart: Omit<Cart, 'items'> & { items?: Maybe<Array<Maybe<ResolversParentTypes['CartItem']>>> };
  CartItem: Omit<CartItem, 'menuItem'> & { menuItem?: Maybe<ResolversParentTypes['MenuItem']> };
  CheckoutSession: CheckoutSession;
  CourierLocationUpdate: CourierLocationUpdate;
  Float: Scalars['Float']['output'];
  CourierProfile: Omit<CourierProfile, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  CourierProfileInput: CourierProfileInput;
  CourierStatusUpdate: CourierStatusUpdate;
  CourierTrackingUpdate: CourierTrackingUpdate;
  CreateBillingPortalSessionInput: CreateBillingPortalSessionInput;
  CreateCheckoutSessionInput: CreateCheckoutSessionInput;
  CreateCourierProfileInput: CreateCourierProfileInput;
  CreateInvoiceInput: CreateInvoiceInput;
  CreateMenuCategoryInput: CreateMenuCategoryInput;
  CreateMenuItemInput: CreateMenuItemInput;
  CreateMenuItemOptionInput: CreateMenuItemOptionInput;
  CreateMenuItemOptionValueInput: CreateMenuItemOptionValueInput;
  CreateOrderInput: CreateOrderInput;
  CreatePaymentIntentInput: CreatePaymentIntentInput;
  CreateRefundInput: CreateRefundInput;
  CreateRestaurantInput: CreateRestaurantInput;
  CreateReviewInput: CreateReviewInput;
  DateTime: Scalars['DateTime']['output'];
  Delivery: Omit<Delivery, 'courier' | 'order'> & { courier?: Maybe<ResolversParentTypes['User']>, order?: Maybe<ResolversParentTypes['Order']> };
  DeliveryAssignment: DeliveryAssignment;
  DeliveryStatusUpdate: DeliveryStatusUpdate;
  Invoice: Omit<Invoice, 'courier' | 'order' | 'restaurant'> & { courier?: Maybe<ResolversParentTypes['User']>, order?: Maybe<ResolversParentTypes['Order']>, restaurant?: Maybe<ResolversParentTypes['Restaurant']> };
  Location: Scalars['Location']['output'];
  LocationInput: Scalars['LocationInput']['output'];
  LoginInput: LoginInput;
  MenuCategory: Omit<MenuCategory, 'menuItems'> & { menuItems?: Maybe<Array<Maybe<ResolversParentTypes['MenuItem']>>> };
  MenuItem: Omit<MenuItem, 'options'> & { options?: Maybe<Array<Maybe<ResolversParentTypes['MenuItemOption']>>> };
  MenuItemOption: MenuItemOption;
  MenuItemOptionValue: MenuItemOptionValue;
  Mutation: {};
  Order: Omit<Order, 'courier' | 'customer' | 'events' | 'items' | 'restaurant'> & { courier?: Maybe<ResolversParentTypes['User']>, customer?: Maybe<ResolversParentTypes['User']>, events?: Maybe<Array<Maybe<ResolversParentTypes['OrderEvent']>>>, items?: Maybe<Array<Maybe<ResolversParentTypes['OrderItem']>>>, restaurant?: Maybe<ResolversParentTypes['Restaurant']> };
  OrderEvent: Omit<OrderEvent, 'order'> & { order?: Maybe<ResolversParentTypes['Order']> };
  OrderItem: Omit<OrderItem, 'menuItem'> & { menuItem?: Maybe<ResolversParentTypes['MenuItem']> };
  OrderQueueUpdate: OrderQueueUpdate;
  OrderTrackingUpdate: OrderTrackingUpdate;
  OrderUpdate: OrderUpdate;
  PaymentIntent: PaymentIntent;
  Payout: Omit<Payout, 'recipient' | 'restaurant'> & { recipient?: Maybe<ResolversParentTypes['User']>, restaurant?: Maybe<ResolversParentTypes['Restaurant']> };
  ProcessPayoutInput: ProcessPayoutInput;
  Query: {};
  RefreshTokenResponse: RefreshTokenResponse;
  Refund: Refund;
  RemoveFromCartInput: RemoveFromCartInput;
  Restaurant: Omit<Restaurant, 'address' | 'menuCategories' | 'menuItems' | 'owner'> & { address?: Maybe<ResolversParentTypes['Address']>, menuCategories?: Maybe<Array<Maybe<ResolversParentTypes['MenuCategory']>>>, menuItems?: Maybe<Array<Maybe<ResolversParentTypes['MenuItem']>>>, owner?: Maybe<ResolversParentTypes['User']> };
  ID: Scalars['ID']['output'];
  Review: Omit<Review, 'courier' | 'customer' | 'restaurant'> & { courier?: Maybe<ResolversParentTypes['User']>, customer?: Maybe<ResolversParentTypes['User']>, restaurant?: Maybe<ResolversParentTypes['Restaurant']> };
  SignupInput: SignupInput;
  Subscription: {};
  UpdateCartItemInput: UpdateCartItemInput;
  UpdateCourierLocationInput: UpdateCourierLocationInput;
  UpdateCourierProfileInput: UpdateCourierProfileInput;
  UpdateInvoiceStatusInput: UpdateInvoiceStatusInput;
  UpdateMenuCategoryInput: UpdateMenuCategoryInput;
  UpdateMenuItemInput: UpdateMenuItemInput;
  UpdateOrderStatusInput: UpdateOrderStatusInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateRestaurantInput: UpdateRestaurantInput;
  UpdateReviewInput: UpdateReviewInput;
  User: Omit<User, 'courierProfile'> & { courierProfile?: Maybe<ResolversParentTypes['CourierProfile']> };
};

export type AddressResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isDefault?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  returnUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Cart'] = ResolversParentTypes['Cart']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['CartItem']>>>, ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CartItem'] = ResolversParentTypes['CartItem']> = {
  cartId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  menuItem?: Resolver<Maybe<ResolversTypes['MenuItem']>, ParentType, ContextType>;
  menuItemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  selectedOptions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CheckoutSession'] = ResolversParentTypes['CheckoutSession']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourierLocationUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CourierLocationUpdate'] = ResolversParentTypes['CourierLocationUpdate']> = {
  deliveryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourierProfileResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CourierProfile'] = ResolversParentTypes['CourierProfile']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  licensePlate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalDeliveries?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vehicleType?: Resolver<ResolversTypes['VehicleType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourierStatusUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CourierStatusUpdate'] = ResolversParentTypes['CourierStatusUpdate']> = {
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourierTrackingUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CourierTrackingUpdate'] = ResolversParentTypes['CourierTrackingUpdate']> = {
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeliveryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Delivery'] = ResolversParentTypes['Delivery']> = {
  assignedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  courier?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  estimatedArrival?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DeliveryStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryAssignmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeliveryAssignment'] = ResolversParentTypes['DeliveryAssignment']> = {
  assignedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  courierId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryStatusResolvers = EnumResolverSignature<{ accepted?: any, assigned?: any, delivered?: any, picked_up?: any }, ResolversTypes['DeliveryStatus']>;

export type DeliveryStatusUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeliveryStatusUpdate'] = ResolversParentTypes['DeliveryStatusUpdate']> = {
  deliveryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvoiceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = {
  courier?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  courierAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  courierId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  platformFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  restaurantAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['InvoiceStatus'], ParentType, ContextType>;
  stripeTransferId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvoiceStatusResolvers = EnumResolverSignature<{ failed?: any, paid?: any, pending?: any }, ResolversTypes['InvoiceStatus']>;

export interface LocationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Location'], any> {
  name: 'Location';
}

export interface LocationInputScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocationInput'], any> {
  name: 'LocationInput';
}

export type MenuCategoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MenuCategory'] = ResolversParentTypes['MenuCategory']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  menuItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['MenuItem']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MenuItem'] = ResolversParentTypes['MenuItem']> = {
  categoryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['MenuItemOption']>>>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuItemOptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MenuItemOption'] = ResolversParentTypes['MenuItemOption']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  menuItemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['MenuItemOptionType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  values?: Resolver<Maybe<Array<Maybe<ResolversTypes['MenuItemOptionValue']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuItemOptionTypeResolvers = EnumResolverSignature<{ multiple?: any, single?: any }, ResolversTypes['MenuItemOptionType']>;

export type MenuItemOptionValueResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MenuItemOptionValue'] = ResolversParentTypes['MenuItemOptionValue']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptDelivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationacceptDeliveryArgs, 'deliveryId'>>;
  addToCart?: Resolver<Maybe<ResolversTypes['CartItem']>, ParentType, ContextType, RequireFields<MutationaddToCartArgs, 'input'>>;
  cancelPaymentIntent?: Resolver<Maybe<ResolversTypes['PaymentIntent']>, ParentType, ContextType, RequireFields<MutationcancelPaymentIntentArgs, 'paymentIntentId'>>;
  clearCart?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  confirmOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationconfirmOrderArgs, 'orderId'>>;
  confirmPaymentIntent?: Resolver<Maybe<ResolversTypes['PaymentIntent']>, ParentType, ContextType, RequireFields<MutationconfirmPaymentIntentArgs, 'paymentIntentId'>>;
  createBillingPortalSession?: Resolver<Maybe<ResolversTypes['BillingPortalSession']>, ParentType, ContextType, RequireFields<MutationcreateBillingPortalSessionArgs, 'input'>>;
  createCheckoutSession?: Resolver<Maybe<ResolversTypes['CheckoutSession']>, ParentType, ContextType, RequireFields<MutationcreateCheckoutSessionArgs, 'input'>>;
  createInvoice?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<MutationcreateInvoiceArgs, 'input'>>;
  createPaymentIntent?: Resolver<Maybe<ResolversTypes['PaymentIntent']>, ParentType, ContextType, RequireFields<MutationcreatePaymentIntentArgs, 'input'>>;
  createRefund?: Resolver<Maybe<ResolversTypes['Refund']>, ParentType, ContextType, RequireFields<MutationcreateRefundArgs, 'input'>>;
  createReview?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<MutationcreateReviewArgs, 'input'>>;
  deliverOrder?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationdeliverOrderArgs, 'deliveryId'>>;
  login?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType, RequireFields<MutationloginArgs, 'input'>>;
  loginWithGoogle?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType, RequireFields<MutationloginWithGoogleArgs, 'idToken'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  markPayoutFailed?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<MutationmarkPayoutFailedArgs, 'invoiceId'>>;
  pickupOrder?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationpickupOrderArgs, 'deliveryId'>>;
  placeOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationplaceOrderArgs, 'input'>>;
  processPayout?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<MutationprocessPayoutArgs, 'input'>>;
  refreshToken?: Resolver<Maybe<ResolversTypes['RefreshTokenResponse']>, ParentType, ContextType, RequireFields<MutationrefreshTokenArgs, 'refreshToken'>>;
  removeFromCart?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationremoveFromCartArgs, 'input'>>;
  setRestaurantOpen?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType, RequireFields<MutationsetRestaurantOpenArgs, 'id' | 'isOpen'>>;
  signup?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType, RequireFields<MutationsignupArgs, 'input'>>;
  toggleFavorite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationtoggleFavoriteArgs, 'restaurantId'>>;
  updateCartItem?: Resolver<Maybe<ResolversTypes['CartItem']>, ParentType, ContextType, RequireFields<MutationupdateCartItemArgs, 'input'>>;
  updateCourierLocation?: Resolver<Maybe<ResolversTypes['CourierProfile']>, ParentType, ContextType, RequireFields<MutationupdateCourierLocationArgs, 'input'>>;
  updateInvoiceStatus?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<MutationupdateInvoiceStatusArgs, 'input'>>;
};

export type OrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  courier?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  courierId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  estimatedDeliveryTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderEvent']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderItem']>>>, ParentType, ContextType>;
  orderNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentStatus?: Resolver<ResolversTypes['PaymentStatus'], ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  stripePaymentIntentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripeSessionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tax?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tip?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderEvent'] = ResolversParentTypes['OrderEvent']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  eventType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  menuItem?: Resolver<Maybe<ResolversTypes['MenuItem']>, ParentType, ContextType>;
  menuItemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  selectedOptions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderQueueUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderQueueUpdate'] = ResolversParentTypes['OrderQueueUpdate']> = {
  queueLength?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderStatusResolvers = EnumResolverSignature<{ cancelled?: any, confirmed?: any, delivered?: any, pending?: any, picked_up?: any, preparing?: any, ready?: any }, ResolversTypes['OrderStatus']>;

export type OrderTrackingUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderTrackingUpdate'] = ResolversParentTypes['OrderTrackingUpdate']> = {
  courierId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderUpdateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderUpdate'] = ResolversParentTypes['OrderUpdate']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentIntentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PaymentIntent'] = ResolversParentTypes['PaymentIntent']> = {
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  clientSecret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentStatusResolvers = EnumResolverSignature<{ failed?: any, paid?: any, pending?: any, refunded?: any }, ResolversTypes['PaymentStatus']>;

export type PayoutResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Payout'] = ResolversParentTypes['Payout']> = {
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  failureReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  processedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recipient?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  recipientId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipientType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PayoutStatus'], ParentType, ContextType>;
  stripePayoutId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripeTransferId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PayoutStatusResolvers = EnumResolverSignature<{ cancelled?: any, completed?: any, failed?: any, pending?: any, processing?: any }, ResolversTypes['PayoutStatus']>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  cart?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType>;
  courierAssignments?: Resolver<Array<Maybe<ResolversTypes['Delivery']>>, ParentType, ContextType>;
  favoriteRestaurants?: Resolver<Array<Maybe<ResolversTypes['Restaurant']>>, ParentType, ContextType>;
  invoice?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<QueryinvoiceArgs, 'id'>>;
  invoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invoice']>>>, ParentType, ContextType, Partial<QueryinvoicesArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  merchantOrders?: Resolver<Array<Maybe<ResolversTypes['Order']>>, ParentType, ContextType, Partial<QuerymerchantOrdersArgs>>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryorderArgs, 'id'>>;
  orders?: Resolver<Array<Maybe<ResolversTypes['Order']>>, ParentType, ContextType, Partial<QueryordersArgs>>;
  paymentIntent?: Resolver<Maybe<ResolversTypes['PaymentIntent']>, ParentType, ContextType, RequireFields<QuerypaymentIntentArgs, 'paymentIntentId'>>;
  payoutSummary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QuerypayoutSummaryArgs, 'role' | 'userId'>>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType, RequireFields<QueryrestaurantArgs, 'slug'>>;
  restaurants?: Resolver<Array<Maybe<ResolversTypes['Restaurant']>>, ParentType, ContextType, Partial<QueryrestaurantsArgs>>;
  reviews?: Resolver<Array<Maybe<ResolversTypes['Review']>>, ParentType, ContextType, Partial<QueryreviewsArgs>>;
};

export type RefreshTokenResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RefreshTokenResponse'] = ResolversParentTypes['RefreshTokenResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefundResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Refund'] = ResolversParentTypes['Refund']> = {
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Restaurant'] = ResolversParentTypes['Restaurant']> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  addressId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cuisine?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryFee?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryTime?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isOpen?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  menuCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['MenuCategory']>>>, ParentType, ContextType>;
  menuItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['MenuItem']>>>, ParentType, ContextType, RequireFields<RestaurantmenuItemsArgs, 'limit'>>;
  minimumOrder?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courier?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ReviewType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewTypeResolvers = EnumResolverSignature<{ courier?: any, restaurant?: any }, ResolversTypes['ReviewType']>;

export type SubscriptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  courierLocation?: SubscriptionResolver<Maybe<ResolversTypes['CourierLocationUpdate']>, "courierLocation", ParentType, ContextType, RequireFields<SubscriptioncourierLocationArgs, 'deliveryId'>>;
  courierStatusChanged?: SubscriptionResolver<Maybe<ResolversTypes['CourierStatusUpdate']>, "courierStatusChanged", ParentType, ContextType>;
  customerOrderTracking?: SubscriptionResolver<Maybe<ResolversTypes['OrderTrackingUpdate']>, "customerOrderTracking", ParentType, ContextType, RequireFields<SubscriptioncustomerOrderTrackingArgs, 'orderId'>>;
  deliveryAssigned?: SubscriptionResolver<Maybe<ResolversTypes['DeliveryAssignment']>, "deliveryAssigned", ParentType, ContextType, RequireFields<SubscriptiondeliveryAssignedArgs, 'courierId'>>;
  deliveryStatusChanged?: SubscriptionResolver<Maybe<ResolversTypes['DeliveryStatusUpdate']>, "deliveryStatusChanged", ParentType, ContextType, RequireFields<SubscriptiondeliveryStatusChangedArgs, 'deliveryId'>>;
  liveCourierTracking?: SubscriptionResolver<Maybe<ResolversTypes['CourierTrackingUpdate']>, "liveCourierTracking", ParentType, ContextType, RequireFields<SubscriptionliveCourierTrackingArgs, 'courierId'>>;
  merchantIncomingOrders?: SubscriptionResolver<Maybe<ResolversTypes['Order']>, "merchantIncomingOrders", ParentType, ContextType, RequireFields<SubscriptionmerchantIncomingOrdersArgs, 'restaurantId'>>;
  orderStatusChanged?: SubscriptionResolver<Maybe<ResolversTypes['OrderEvent']>, "orderStatusChanged", ParentType, ContextType, RequireFields<SubscriptionorderStatusChangedArgs, 'orderId'>>;
  realTimeOrderUpdates?: SubscriptionResolver<Maybe<ResolversTypes['OrderUpdate']>, "realTimeOrderUpdates", ParentType, ContextType, RequireFields<SubscriptionrealTimeOrderUpdatesArgs, 'orderId'>>;
  restaurantOrderQueue?: SubscriptionResolver<Maybe<ResolversTypes['OrderQueueUpdate']>, "restaurantOrderQueue", ParentType, ContextType, RequireFields<SubscriptionrestaurantOrderQueueArgs, 'restaurantId'>>;
};

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  courierProfile?: Resolver<Maybe<ResolversTypes['CourierProfile']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRoleResolvers = EnumResolverSignature<{ admin?: any, courier?: any, customer?: any, restaurant?: any }, ResolversTypes['UserRole']>;

export type VehicleTypeResolvers = EnumResolverSignature<{ bike?: any, car?: any, motorcycle?: any }, ResolversTypes['VehicleType']>;

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
  CourierTrackingUpdate?: CourierTrackingUpdateResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Delivery?: DeliveryResolvers<ContextType>;
  DeliveryAssignment?: DeliveryAssignmentResolvers<ContextType>;
  DeliveryStatus?: DeliveryStatusResolvers;
  DeliveryStatusUpdate?: DeliveryStatusUpdateResolvers<ContextType>;
  Invoice?: InvoiceResolvers<ContextType>;
  InvoiceStatus?: InvoiceStatusResolvers;
  Location?: GraphQLScalarType;
  LocationInput?: GraphQLScalarType;
  MenuCategory?: MenuCategoryResolvers<ContextType>;
  MenuItem?: MenuItemResolvers<ContextType>;
  MenuItemOption?: MenuItemOptionResolvers<ContextType>;
  MenuItemOptionType?: MenuItemOptionTypeResolvers;
  MenuItemOptionValue?: MenuItemOptionValueResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderEvent?: OrderEventResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  OrderQueueUpdate?: OrderQueueUpdateResolvers<ContextType>;
  OrderStatus?: OrderStatusResolvers;
  OrderTrackingUpdate?: OrderTrackingUpdateResolvers<ContextType>;
  OrderUpdate?: OrderUpdateResolvers<ContextType>;
  PaymentIntent?: PaymentIntentResolvers<ContextType>;
  PaymentStatus?: PaymentStatusResolvers;
  Payout?: PayoutResolvers<ContextType>;
  PayoutStatus?: PayoutStatusResolvers;
  Query?: QueryResolvers<ContextType>;
  RefreshTokenResponse?: RefreshTokenResponseResolvers<ContextType>;
  Refund?: RefundResolvers<ContextType>;
  Restaurant?: RestaurantResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  ReviewType?: ReviewTypeResolvers;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserRole?: UserRoleResolvers;
  VehicleType?: VehicleTypeResolvers;
};

