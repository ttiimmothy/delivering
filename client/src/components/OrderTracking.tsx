'use client';

import { useState, useEffect } from 'react';
import { useSocket } from './SocketProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { MapPin, Clock, User, Phone, Car } from 'lucide-react';
import { Order } from '../types/graphql';

interface OrderTrackingProps {
  order: Order;
}

interface TrackingUpdate {
  orderId: string;
  status: string;
  message?: string;
  timestamp: string;
}

interface CourierLocationUpdate {
  courierId: string;
  location: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  estimatedArrival?: string;
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const { socketService } = useSocket();
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [courierLocation, setCourierLocation] = useState<CourierLocationUpdate | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!socketService.isConnected()) return;

    // Listen for order status changes
    const handleOrderStatusChanged = (data: TrackingUpdate) => {
      if (data.orderId === order.id) {
        setTrackingUpdates(prev => [...prev, data]);
      }
    };

    // Listen for courier location updates
    const handleCourierLocationChanged = (data: CourierLocationUpdate) => {
      if (order.courier?.id === data.courierId) {
        setCourierLocation(data);
      }
    };

    socketService.onOrderStatusChanged(handleOrderStatusChanged);
    socketService.onCourierLocationChanged(handleCourierLocationChanged);

    // Start tracking if order is in progress
    if (['confirmed', 'preparing', 'ready', 'picked_up'].includes(order.status)) {
      setIsTracking(true);
    }

    return () => {
      socketService.offOrderStatusChanged(handleOrderStatusChanged);
      socketService.offCourierLocationChanged(handleCourierLocationChanged);
    };
  }, [order.id, order.status, order.courier?.id, socketService]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-purple-500';
      case 'picked_up': return 'bg-green-500';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Preparing Food';
      case 'ready': return 'Ready for Pickup';
      case 'picked_up': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Order Status
          </CardTitle>
          <CardDescription>
            Track your order in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Badge className={`${getStatusColor(order.status)} text-white`}>
              {getStatusText(order.status)}
            </Badge>
            {isTracking && (
              <Badge variant="outline" className="animate-pulse">
                Live Tracking
              </Badge>
            )}
          </div>

          {/* Status Timeline */}
          <div className="space-y-3">
            {trackingUpdates.map((update, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(update.status)} mt-1`} />
                <div className="flex-1">
                  <p className="font-medium">{getStatusText(update.status)}</p>
                  {update.message && (
                    <p className="text-sm text-muted-foreground">{update.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(update.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Courier Information */}
      {order.courier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Courier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {order.courier.firstName} {order.courier.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.courier.courierProfile?.vehicleType || 'Delivery Vehicle'}
                  </p>
                </div>
              </div>

              {courierLocation && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>Current Location</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(courierLocation.location.timestamp).toLocaleString()}
                  </div>
                  {courierLocation.estimatedArrival && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>ETA: {courierLocation.estimatedArrival}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{order.courier.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Restaurant Information */}
      {order.restaurant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Restaurant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{order.restaurant.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.restaurant.address?.street}, {order.restaurant.address?.city}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.restaurant.phone}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{order.deliveryAddress}</p>
          {order.specialInstructions && (
            <div className="mt-2">
              <p className="text-sm font-medium">Special Instructions:</p>
              <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
