// ===== AUTHENTICATION TYPES =====
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'courier' | 'merchant' | 'admin';
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
  courierProfile?: CourierProfile;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: string;
  longitude?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourierProfile {
  id: string;
  vehicleType: string;
  licensePlate?: string;
  isAvailable: boolean;
  currentLocation?: Location;
  rating?: string;
  reviewCount: number;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ===== RESTAURANT TYPES =====
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  cuisine: string;
  rating?: string;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: string;
  minimumOrder: string;
  isOpen: boolean;
  isActive: boolean;
  address: RestaurantAddress;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  menuCategories?: MenuCategory[];
}

export interface RestaurantAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: Location;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: string;
  isAvailable: boolean;
  isPopular: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  options?: MenuItemOption[];
}

export interface MenuItemOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  isRequired: boolean;
  sortOrder: number;
  createdAt: string;
  values?: MenuItemOptionValue[];
}

export interface MenuItemOptionValue {
  id: string;
  name: string;
  price: string;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

// ===== CART TYPES =====
export interface Cart {
  id: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
  items?: CartItem[];
  restaurant?: Restaurant;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  quantity: number;
  selectedOptions: any[];
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  menuItem?: MenuItem;
}

// ===== ORDER TYPES =====
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: string;
  tax: string;
  deliveryFee: string;
  tip: string;
  total: string;
  deliveryAddress: any;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  restaurant?: Restaurant;
  courier?: User;
  customer?: User;
  items?: OrderItem[];
  events?: OrderEvent[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  selectedOptions: any[];
  specialInstructions?: string;
  createdAt: string;
  menuItem?: MenuItem;
}

export interface OrderEvent {
  id: string;
  status: OrderStatus;
  message?: string;
  metadata?: any;
  createdAt: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'picked_up' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

// ===== DELIVERY TYPES =====
export interface Delivery {
  id: string;
  orderId: string;
  courierId: string;
  status: DeliveryStatus;
  assignedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  currentLocation?: Location;
  estimatedArrival?: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
  courier?: User;
}

export type DeliveryStatus = 
  | 'assigned' 
  | 'accepted' 
  | 'picked_up' 
  | 'delivered';

// ===== REVIEW TYPES =====
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  type: 'restaurant' | 'courier';
  createdAt: string;
  updatedAt: string;
  customer?: User;
  restaurant?: Restaurant;
  courier?: User;
}

// ===== INPUT TYPES =====
export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'customer' | 'courier' | 'merchant';
}

export interface AddressInput {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  isDefault?: boolean;
}

export interface AddToCartInput {
  menuItemId: string;
  quantity: number;
  selectedOptions?: any[];
  specialInstructions?: string;
}

export interface UpdateCartItemInput {
  cartItemId: string;
  quantity?: number;
  selectedOptions?: any[];
  specialInstructions?: string;
}

export interface RemoveFromCartInput {
  cartItemId: string;
}

export interface CreateOrderInput {
  restaurantId?: string
  deliveryAddress: any;
  specialInstructions?: string;
  tip?: string;
}

export interface CreateReviewInput {
  orderId: string;
  rating: number;
  comment?: string;
  type: 'restaurant' | 'courier';
}

export interface UpdateCourierLocationInput {
  latitude: number;
  longitude: number;
}

// ===== QUERY VARIABLES =====
export interface RestaurantsQueryVariables {
  cuisine?: string;
  isOpen?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface OrdersQueryVariables {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

export interface ReviewsQueryVariables {
  restaurantId?: string;
  courierId?: string;
  limit?: number;
  offset?: number;
}

export interface MerchantOrdersQueryVariables {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

// ===== SUBSCRIPTION TYPES =====
export interface OrderStatusChangedSubscription {
  orderStatusChanged: OrderEvent;
}

export interface CourierLocationSubscription {
  courierLocation: {
    id: string;
    currentLocation?: Location;
    estimatedArrival?: string;
    updatedAt: string;
  };
}

export interface MerchantIncomingOrdersSubscription {
  merchantIncomingOrders: Order;
}

// ===== PAYMENT TYPES =====
export interface CheckoutSession {
  id: string;
  url: string;
  customerId?: string;
  customerEmail?: string;
  status: string;
  paymentIntentId?: string;
  createdAt: string;
  expiresAt: string;
}

export interface BillingPortalSession {
  id: string;
  url: string;
  returnUrl: string;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  status: string;
  amount: string;
  currency: string;
  clientSecret?: string;
  description?: string;
  createdAt: string;
  metadata?: string;
}

export interface Refund {
  id: string;
  status: string;
  amount: string;
  currency: string;
  reason?: string;
  createdAt: string;
}

// ===== PAYMENT INPUT TYPES =====
export interface CreateCheckoutSessionInput {
  amount: number;
  currency: string
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface CreateBillingPortalSessionInput {
  customerId: string;
  returnUrl: string;
}

export interface CreatePaymentIntentInput {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: any;
}

export interface CreateRefundInput {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}
