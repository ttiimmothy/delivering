import { subscriptionField, objectType, nonNull, stringArg, list } from 'nexus';
import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../index';
import { getSocketService } from '../services/socket';

// Subscription Types
export const CourierLocationUpdate = objectType({
  name: 'CourierLocationUpdate',
  definition(t) {
    t.nonNull.string("courierId")
    t.nonNull.string('deliveryId');
    t.nonNull.field('location', {type: "CourierLocation"});
    t.nonNull.string("estimatedArrival")
    t.nonNull.string('updatedAt');
  },
});

export const CourierLocation = objectType({
  name: "CourierLocation",
  definition(t) {
    t.nonNull.string("latitude")
    t.nonNull.string("longitude")
    t.nonNull.string("timestamp")
  }
})

export const DeliveryAssignment = objectType({
  name: 'DeliveryAssignment',
  definition(t) {
    t.nonNull.string('deliveryId');
    t.nonNull.string('courierId');
    t.nonNull.string('orderId');
    t.nonNull.string('assignedAt');
  },
});

export const DeliveryStatusUpdate = objectType({
  name: 'DeliveryStatusUpdate',
  definition(t) {
    t.nonNull.string('deliveryId');
    t.nonNull.string('status');
    t.nonNull.string('updatedAt');
    t.string('message');
  },
});

export const CourierStatusUpdate = objectType({
  name: 'CourierStatusUpdate',
  definition(t) {
    t.nonNull.string('courierId');
    t.nonNull.boolean('isAvailable');
    t.nonNull.string('updatedAt');
  },
});

export const OrderUpdate = objectType({
  name: 'OrderUpdate',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('status');
    t.nonNull.string('updatedAt');
    t.string("metadata")
    t.string('message');
  },
});

export const CourierTrackingUpdate = objectType({
  name: 'CourierTrackingUpdate',
  definition(t) {
    t.nonNull.string('deliveryId');
    t.nonNull.string('courierId');
    t.nonNull.field('location', {type: "CourierLocation"});
    t.nonNull.string("estimatedArrival")
    t.nonNull.string('updatedAt');
    t.nonNull.string('status');
  },
});

export const OrderQueueUpdate = objectType({
  name: 'OrderQueueUpdate',
  definition(t) {
    t.nonNull.string('restaurantId');
    t.nonNull.int('queueLength');
    t.field("pendingOrders", {type: list("Order")})
    t.field("preparingOrders", {type: list("Order")})
    t.field("readyOrders", {type: list("Order")})
    t.nonNull.string('updatedAt');
  },
});

export const OrderTrackingUpdate = objectType({
  name: 'OrderTrackingUpdate',
  definition(t) {
    t.nonNull.string('orderId');
    t.nonNull.string('status');
    t.nonNull.string("estimatedDelivery")
    t.string('message');
    t.string('courierId');
    t.field('currentLocation', { 
      type: 'Location',
      resolve: (parent: any) => {
        if (!parent.currentLocation) return null;
        try {
          return typeof parent.currentLocation === 'string' 
          ? JSON.parse(parent.currentLocation)
          : parent.currentLocation;
        } catch {
          return null;
        }
      }
    });
    t.nonNull.string('updatedAt');
  },
});

// Order Status Subscription
export const orderStatusChanged = subscriptionField('orderStatusChanged', {
  type: 'OrderEvent',
  args: {
    orderId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('ORDER_STATUS_CHANGED'),
    (payload, variables) => {
      return payload.orderStatusChanged.orderId === variables.orderId;
    }
  ),
  resolve: (payload) => payload.orderStatusChanged,
});

// Courier Location Subscription
export const courierLocation = subscriptionField('courierLocation', {
  type: 'CourierLocationUpdate',
  args: {
    deliveryId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('COURIER_LOCATION_UPDATE'),
    (payload, variables) => {
      return payload.courierLocation.deliveryId === variables.deliveryId;
    }
  ),
  resolve: (payload) => payload.courierLocation,
});

// Merchant Incoming Orders Subscription
export const merchantIncomingOrders = subscriptionField('merchantIncomingOrders', {
  type: 'Order',
  args: {
    restaurantId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('MERCHANT_INCOMING_ORDERS'),
    (payload, variables) => {
      return payload.merchantIncomingOrders.restaurantId === variables.restaurantId;
    }
  ),
  resolve: (payload) => payload.merchantIncomingOrders,
});

// Delivery Assignment Subscription
export const deliveryAssigned = subscriptionField('deliveryAssigned', {
  type: 'DeliveryAssignment',
  args: {
    courierId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('DELIVERY_ASSIGNED'),
    (payload, variables) => {
      return payload.deliveryAssigned.courierId === variables.courierId;
    }
  ),
  resolve: (payload) => payload.deliveryAssigned,
});

// Delivery Status Subscription
export const deliveryStatusChanged = subscriptionField('deliveryStatusChanged', {
  type: 'DeliveryStatusUpdate',
  args: {
    deliveryId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('DELIVERY_STATUS_CHANGED'),
    (payload, variables) => {
      return payload.deliveryStatusChanged.deliveryId === variables.deliveryId;
    }
  ),
  resolve: (payload) => payload.deliveryStatusChanged,
});

// Courier Status Subscription
export const courierStatusChanged = subscriptionField('courierStatusChanged', {
  type: 'CourierStatusUpdate',
  subscribe: () => pubsub.asyncIterator('COURIER_STATUS_CHANGED'),
  resolve: (payload: any) => payload.courierStatusChanged,
});

// Real-time Order Updates Subscription
export const realTimeOrderUpdates = subscriptionField('realTimeOrderUpdates', {
  type: 'OrderUpdate',
  args: {
    orderId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('REAL_TIME_ORDER_UPDATES'),
    (payload, variables) => {
      return payload.realTimeOrderUpdates.orderId === variables.orderId;
    }
  ),
  resolve: (payload) => payload.realTimeOrderUpdates,
});

// Live Courier Tracking Subscription
export const liveCourierTracking = subscriptionField('liveCourierTracking', {
  type: 'CourierTrackingUpdate',
  args: {
    courierId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('LIVE_COURIER_TRACKING'),
    (payload, variables) => {
      return payload.liveCourierTracking.courierId === variables.courierId;
    }
  ),
  resolve: (payload) => payload.liveCourierTracking,
});

// Restaurant Order Queue Subscription
export const restaurantOrderQueue = subscriptionField('restaurantOrderQueue', {
  type: 'OrderQueueUpdate',
  args: {
    restaurantId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('RESTAURANT_ORDER_QUEUE'),
    (payload, variables) => {
      return payload.restaurantOrderQueue.restaurantId === variables.restaurantId;
    }
  ),
  resolve: (payload) => payload.restaurantOrderQueue,
});

// Customer Order Tracking Subscription
export const customerOrderTracking = subscriptionField('customerOrderTracking', {
  type: 'OrderTrackingUpdate',
  args: {
    orderId: nonNull(stringArg()),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator('CUSTOMER_ORDER_TRACKING'),
    (payload, variables) => {
      return payload.customerOrderTracking.orderId === variables.orderId;
    }
  ),
  resolve: (payload) => payload.customerOrderTracking,
});
