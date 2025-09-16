import { makeSchema, queryType, mutationType } from 'nexus';
import { join } from 'path';

// Import consolidated types
import * as Types from './consolidated';
import * as Queries from './queries';
import * as Mutations from './mutations';
import * as Subscriptions from './subscriptions';
import * as Scalars from './scalars';

// Create the GraphQL schema
export const schema = makeSchema({
  types: [
    
    // Scalars
    Scalars.DateTime,
    Scalars.Location,
    Scalars.LocationInput,
    
    // Types
    Types.User,
    Types.Address,
    Types.CourierProfile,
    Types.Location,
    Types.Restaurant,
    Types.MenuCategory,
    Types.MenuItem,
    Types.MenuItemOption,
    Types.OptionValue,
    Types.Cart,
    Types.CartItem,
    Types.Order,
    Types.OrderItem,
    Types.OrderEvent,
    Types.Delivery,
    Types.Review,
    
    // Enums
    Types.UserRole,
    Types.VehicleType,
    Types.OptionType,
    Types.OrderStatus,
    Types.PaymentStatus,
    Types.DeliveryStatus,
    Types.ReviewType,
    
    // Input Types
    Types.SignupInput,
    Types.LoginInput,
    Types.AddressInput,
    Types.LocationInput,
    Types.AddToCartInput,
    Types.UpdateCartItemInput,
    Types.RemoveFromCartInput,
    Types.CreateOrderInput,
    Types.CreateReviewInput,
    Types.UpdateCourierLocationInput,
    
    // Response Types
    Types.AuthResponse,
    Types.RefreshTokenResponse,
    Types.PaymentIntent,
    Types.CheckoutSession,
    Types.BillingPortalSession,
    Types.Refund,
    
    // Payment Input Types
    Types.CreateCheckoutSessionInput,
    Types.CreateBillingPortalSessionInput,
    Types.CreatePaymentIntentInput,
    Types.CreateRefundInput,
    
    // Subscription Types
    Types.CourierLocationUpdate,
    Types.DeliveryAssignment,
    Types.DeliveryStatusUpdate,
    Types.CourierStatusUpdate,
    Types.OrderUpdate,
    Types.CourierTrackingUpdate,
    Types.OrderQueueUpdate,
    Types.OrderTrackingUpdate,
    
    // Queries
    Queries.me,
    Queries.restaurants,
    Queries.restaurant,
    Queries.favoriteRestaurants,
    Queries.cart,
    Queries.order,
    Queries.orders,
    Queries.merchantOrders,
    Queries.courierAssignments,
    Queries.reviews,
    Queries.paymentIntent,
    
    // Mutations
    Mutations.signup,
    Mutations.login,
    Mutations.loginWithGoogle,
    Mutations.refreshToken,
    Mutations.logout,
    Mutations.addToCart,
    Mutations.updateCartItem,
    Mutations.removeFromCart,
    Mutations.clearCart,
    Mutations.placeOrder,
    Mutations.confirmOrder,
    Mutations.acceptDelivery,
    Mutations.pickupOrder,
    Mutations.deliverOrder,
    Mutations.updateCourierLocation,
    Mutations.toggleFavorite,
    Mutations.setRestaurantOpen,
    Mutations.createReview,
    
    // Payment Mutations
    Mutations.createCheckoutSession,
    Mutations.createBillingPortalSession,
    Mutations.createPaymentIntent,
    Mutations.confirmPaymentIntent,
    Mutations.cancelPaymentIntent,
    Mutations.createRefund,
    
    // Subscriptions
    Subscriptions.orderStatusChanged,
    Subscriptions.courierLocation,
    Subscriptions.merchantIncomingOrders,
    Subscriptions.deliveryAssigned,
    Subscriptions.deliveryStatusChanged,
    Subscriptions.courierStatusChanged,
    Subscriptions.realTimeOrderUpdates,
    Subscriptions.liveCourierTracking,
    Subscriptions.restaurantOrderQueue,
    Subscriptions.customerOrderTracking,
  ],
  
  outputs: {
    schema: join(process.cwd(), 'src', 'lib', 'graphql', 'schema.graphql'),
    typegen: join(process.cwd(), 'src', 'lib', 'graphql', 'nexus-typegen.ts'),
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
