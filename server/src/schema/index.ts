import { makeSchema, queryType, mutationType } from 'nexus';
import { join } from 'path';

// Import individual schema modules
import * as UserTypes from './user';
import * as RestaurantTypes from './restaurant';
import * as OrderTypes from './order';
import * as CartTypes from './cart';
import * as ReviewTypes from './review';
import * as DeliveryTypes from './delivery';
import * as MenuTypes from './menu';
import * as PayoutTypes from './payout';
import * as PaymentTypes from './payment';
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
    
    // User Types
    UserTypes.User,
    UserTypes.Address,
    UserTypes.CourierProfile,
    UserTypes.UserRole,
    UserTypes.VehicleType,
    UserTypes.AuthResponse,
    UserTypes.RefreshTokenResponse,
    
    // Restaurant Types  
    RestaurantTypes.Restaurant,
    
    // Menu Types (from dedicated menu.ts file)
    MenuTypes.MenuCategory,
    MenuTypes.MenuItem,
    MenuTypes.MenuItemOption,
    MenuTypes.MenuItemOptionValue,
    MenuTypes.MenuItemOptionType,
    
    // Order Types
    OrderTypes.Order,
    OrderTypes.OrderItem,
    OrderTypes.OrderEvent,
    OrderTypes.OrderStatus,
    OrderTypes.PaymentStatus,
    
    // Cart Types
    CartTypes.Cart,
    CartTypes.CartItem,
    
    // Review Types
    ReviewTypes.Review,
    ReviewTypes.ReviewType,
    
    // Delivery Types
    DeliveryTypes.Delivery,
    DeliveryTypes.DeliveryStatus,
    
    // Payment Types
    PaymentTypes.CheckoutSession,
    PaymentTypes.BillingPortalSession,
    PaymentTypes.PaymentIntent,
    PaymentTypes.Refund,
    
    // Payout Types
    PayoutTypes.InvoiceStatus,
    PayoutTypes.PayoutStatus,
    PayoutTypes.Invoice,
    PayoutTypes.Payout,
    
    // Input Types
    UserTypes.SignupInput,
    UserTypes.LoginInput,
    UserTypes.AddressInput,
    UserTypes.UpdateProfileInput,
    UserTypes.CourierProfileInput,
    UserTypes.CreateCourierProfileInput,
    UserTypes.UpdateCourierProfileInput,
    CartTypes.AddToCartInput,
    CartTypes.UpdateCartItemInput,
    CartTypes.RemoveFromCartInput,
    OrderTypes.CreateOrderInput,
    OrderTypes.UpdateOrderStatusInput,
    OrderTypes.AssignCourierInput,
    OrderTypes.UpdateCourierLocationInput,
    ReviewTypes.CreateReviewInput,
    ReviewTypes.UpdateReviewInput,
    RestaurantTypes.CreateRestaurantInput,
    RestaurantTypes.UpdateRestaurantInput,
    
    // Menu Input Types
    MenuTypes.CreateMenuCategoryInput,
    MenuTypes.UpdateMenuCategoryInput,
    MenuTypes.CreateMenuItemInput,
    MenuTypes.UpdateMenuItemInput,
    MenuTypes.CreateMenuItemOptionInput,
    MenuTypes.CreateMenuItemOptionValueInput,
    
    // Payment Input Types
    PaymentTypes.CreateCheckoutSessionInput,
    PaymentTypes.CreateBillingPortalSessionInput,
    PaymentTypes.CreatePaymentIntentInput,
    PaymentTypes.CreateRefundInput,
    
    // Payout Input Types
    PayoutTypes.CreateInvoiceInput,
    PayoutTypes.UpdateInvoiceStatusInput,
    PayoutTypes.ProcessPayoutInput,
    
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
    
    // Payout Queries
    PayoutTypes.invoicesQuery,
    PayoutTypes.invoice,
    PayoutTypes.payoutSummary,
    
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
    
    // Payout Mutations
    PayoutTypes.createInvoice,
    PayoutTypes.updateInvoiceStatus,
    PayoutTypes.processPayout,
    PayoutTypes.markPayoutFailed,
    
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
    
    // Subscription Types
    Subscriptions.CourierLocationUpdate,
    Subscriptions.DeliveryAssignment,
    Subscriptions.DeliveryStatusUpdate,
    Subscriptions.CourierStatusUpdate,
    Subscriptions.OrderUpdate,
    Subscriptions.CourierTrackingUpdate,
    Subscriptions.OrderQueueUpdate,
    Subscriptions.OrderTrackingUpdate,
  ],
  
  outputs: {
    schema: join(process.cwd(), 'src', 'lib', 'graphql', 'schema.graphql'),
    typegen: join(process.cwd(), 'src', 'lib', 'graphql', 'nexus-typegen.d.ts'),
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
