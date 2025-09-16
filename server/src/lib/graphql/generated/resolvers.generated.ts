/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { cart as Query_cart } from './../resolvers/Query/cart';
import    { courierAssignments as Query_courierAssignments } from './../resolvers/Query/courierAssignments';
import    { favoriteRestaurants as Query_favoriteRestaurants } from './../resolvers/Query/favoriteRestaurants';
import    { invoice as Query_invoice } from './../resolvers/Query/invoice';
import    { invoices as Query_invoices } from './../resolvers/Query/invoices';
import    { me as Query_me } from './../resolvers/Query/me';
import    { merchantOrders as Query_merchantOrders } from './../resolvers/Query/merchantOrders';
import    { order as Query_order } from './../resolvers/Query/order';
import    { orders as Query_orders } from './../resolvers/Query/orders';
import    { paymentIntent as Query_paymentIntent } from './../resolvers/Query/paymentIntent';
import    { payoutSummary as Query_payoutSummary } from './../resolvers/Query/payoutSummary';
import    { restaurant as Query_restaurant } from './../resolvers/Query/restaurant';
import    { restaurants as Query_restaurants } from './../resolvers/Query/restaurants';
import    { reviews as Query_reviews } from './../resolvers/Query/reviews';
import    { acceptDelivery as Mutation_acceptDelivery } from './../resolvers/Mutation/acceptDelivery';
import    { addToCart as Mutation_addToCart } from './../resolvers/Mutation/addToCart';
import    { cancelPaymentIntent as Mutation_cancelPaymentIntent } from './../resolvers/Mutation/cancelPaymentIntent';
import    { clearCart as Mutation_clearCart } from './../resolvers/Mutation/clearCart';
import    { confirmOrder as Mutation_confirmOrder } from './../resolvers/Mutation/confirmOrder';
import    { confirmPaymentIntent as Mutation_confirmPaymentIntent } from './../resolvers/Mutation/confirmPaymentIntent';
import    { createBillingPortalSession as Mutation_createBillingPortalSession } from './../resolvers/Mutation/createBillingPortalSession';
import    { createCheckoutSession as Mutation_createCheckoutSession } from './../resolvers/Mutation/createCheckoutSession';
import    { createInvoice as Mutation_createInvoice } from './../resolvers/Mutation/createInvoice';
import    { createPaymentIntent as Mutation_createPaymentIntent } from './../resolvers/Mutation/createPaymentIntent';
import    { createRefund as Mutation_createRefund } from './../resolvers/Mutation/createRefund';
import    { createReview as Mutation_createReview } from './../resolvers/Mutation/createReview';
import    { deliverOrder as Mutation_deliverOrder } from './../resolvers/Mutation/deliverOrder';
import    { login as Mutation_login } from './../resolvers/Mutation/login';
import    { loginWithGoogle as Mutation_loginWithGoogle } from './../resolvers/Mutation/loginWithGoogle';
import    { logout as Mutation_logout } from './../resolvers/Mutation/logout';
import    { markPayoutFailed as Mutation_markPayoutFailed } from './../resolvers/Mutation/markPayoutFailed';
import    { pickupOrder as Mutation_pickupOrder } from './../resolvers/Mutation/pickupOrder';
import    { placeOrder as Mutation_placeOrder } from './../resolvers/Mutation/placeOrder';
import    { processPayout as Mutation_processPayout } from './../resolvers/Mutation/processPayout';
import    { refreshToken as Mutation_refreshToken } from './../resolvers/Mutation/refreshToken';
import    { removeFromCart as Mutation_removeFromCart } from './../resolvers/Mutation/removeFromCart';
import    { setRestaurantOpen as Mutation_setRestaurantOpen } from './../resolvers/Mutation/setRestaurantOpen';
import    { signup as Mutation_signup } from './../resolvers/Mutation/signup';
import    { toggleFavorite as Mutation_toggleFavorite } from './../resolvers/Mutation/toggleFavorite';
import    { updateCartItem as Mutation_updateCartItem } from './../resolvers/Mutation/updateCartItem';
import    { updateCourierLocation as Mutation_updateCourierLocation } from './../resolvers/Mutation/updateCourierLocation';
import    { updateInvoiceStatus as Mutation_updateInvoiceStatus } from './../resolvers/Mutation/updateInvoiceStatus';
import    { courierLocation as Subscription_courierLocation } from './../resolvers/Subscription/courierLocation';
import    { courierStatusChanged as Subscription_courierStatusChanged } from './../resolvers/Subscription/courierStatusChanged';
import    { customerOrderTracking as Subscription_customerOrderTracking } from './../resolvers/Subscription/customerOrderTracking';
import    { deliveryAssigned as Subscription_deliveryAssigned } from './../resolvers/Subscription/deliveryAssigned';
import    { deliveryStatusChanged as Subscription_deliveryStatusChanged } from './../resolvers/Subscription/deliveryStatusChanged';
import    { liveCourierTracking as Subscription_liveCourierTracking } from './../resolvers/Subscription/liveCourierTracking';
import    { merchantIncomingOrders as Subscription_merchantIncomingOrders } from './../resolvers/Subscription/merchantIncomingOrders';
import    { orderStatusChanged as Subscription_orderStatusChanged } from './../resolvers/Subscription/orderStatusChanged';
import    { realTimeOrderUpdates as Subscription_realTimeOrderUpdates } from './../resolvers/Subscription/realTimeOrderUpdates';
import    { restaurantOrderQueue as Subscription_restaurantOrderQueue } from './../resolvers/Subscription/restaurantOrderQueue';
import    { DateTime } from './../resolvers/DateTime';
import    { Location } from './../resolvers/Location';
import    { LocationInput } from './../resolvers/LocationInput';
    export const resolvers: Resolvers = {
      Query: { cart: Query_cart,courierAssignments: Query_courierAssignments,favoriteRestaurants: Query_favoriteRestaurants,invoice: Query_invoice,invoices: Query_invoices,me: Query_me,merchantOrders: Query_merchantOrders,order: Query_order,orders: Query_orders,paymentIntent: Query_paymentIntent,payoutSummary: Query_payoutSummary,restaurant: Query_restaurant,restaurants: Query_restaurants,reviews: Query_reviews },
      Mutation: { acceptDelivery: Mutation_acceptDelivery,addToCart: Mutation_addToCart,cancelPaymentIntent: Mutation_cancelPaymentIntent,clearCart: Mutation_clearCart,confirmOrder: Mutation_confirmOrder,confirmPaymentIntent: Mutation_confirmPaymentIntent,createBillingPortalSession: Mutation_createBillingPortalSession,createCheckoutSession: Mutation_createCheckoutSession,createInvoice: Mutation_createInvoice,createPaymentIntent: Mutation_createPaymentIntent,createRefund: Mutation_createRefund,createReview: Mutation_createReview,deliverOrder: Mutation_deliverOrder,login: Mutation_login,loginWithGoogle: Mutation_loginWithGoogle,logout: Mutation_logout,markPayoutFailed: Mutation_markPayoutFailed,pickupOrder: Mutation_pickupOrder,placeOrder: Mutation_placeOrder,processPayout: Mutation_processPayout,refreshToken: Mutation_refreshToken,removeFromCart: Mutation_removeFromCart,setRestaurantOpen: Mutation_setRestaurantOpen,signup: Mutation_signup,toggleFavorite: Mutation_toggleFavorite,updateCartItem: Mutation_updateCartItem,updateCourierLocation: Mutation_updateCourierLocation,updateInvoiceStatus: Mutation_updateInvoiceStatus },
      Subscription: { courierLocation: Subscription_courierLocation,courierStatusChanged: Subscription_courierStatusChanged,customerOrderTracking: Subscription_customerOrderTracking,deliveryAssigned: Subscription_deliveryAssigned,deliveryStatusChanged: Subscription_deliveryStatusChanged,liveCourierTracking: Subscription_liveCourierTracking,merchantIncomingOrders: Subscription_merchantIncomingOrders,orderStatusChanged: Subscription_orderStatusChanged,realTimeOrderUpdates: Subscription_realTimeOrderUpdates,restaurantOrderQueue: Subscription_restaurantOrderQueue },
      DateTime: DateTime,
Location: Location,
LocationInput: LocationInput
    }