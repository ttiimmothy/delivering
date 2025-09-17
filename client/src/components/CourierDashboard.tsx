'use client';

import { useState, useEffect } from 'react';
import { useSocket } from './SocketProvider';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Switch } from './ui/Switch';
import { MapPin, Clock, Package, CheckCircle, XCircle, Navigation } from 'lucide-react';
import { Order } from '../types/graphql';

interface DeliveryAssignment {
  deliveryId: string;
  courierId: string;
  assignedBy: string;
  timestamp: string;
}

interface DeliveryStatusUpdate {
  deliveryId: string;
  status: string;
  message?: string;
  timestamp: string;
}

export function CourierDashboard() {
  const { user } = useAuth();
  const { socketService } = useSocket();
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<Order | null>(null);
  const [deliveryAssignments, setDeliveryAssignments] = useState<DeliveryAssignment[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!socketService.isConnected() || !user) return;

    // Listen for delivery assignments
    const handleDeliveryAssigned = (data: DeliveryAssignment) => {
      if (data.courierId === user.id) {
        setDeliveryAssignments(prev => [...prev, data]);
      }
    };

    // Listen for delivery status updates
    const handleDeliveryStatusChanged = (data: DeliveryStatusUpdate) => {
      console.log('Delivery status changed:', data);
    };

    socketService.onDeliveryAssigned(handleDeliveryAssigned);
    socketService.onDeliveryStatusChanged(handleDeliveryStatusChanged);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    return () => {
      socketService.offDeliveryAssigned(handleDeliveryAssigned);
      socketService.offDeliveryStatusChanged(handleDeliveryStatusChanged);
    };
  }, [socketService, user]);

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked);
    socketService.emitCourierStatusUpdate({ isAvailable: checked });
  };

  const handleAcceptDelivery = (deliveryId: string) => {
    socketService.emitDeliveryAccept({ deliveryId });
    // Remove from assignments
    setDeliveryAssignments(prev => prev.filter(a => a.deliveryId !== deliveryId));
  };

  const handleRejectDelivery = (deliveryId: string) => {
    // Remove from assignments
    setDeliveryAssignments(prev => prev.filter(a => a.deliveryId !== deliveryId));
  };

  const handlePickupOrder = (deliveryId: string) => {
    socketService.emitDeliveryPickup({ deliveryId });
  };

  const handleCompleteDelivery = (deliveryId: string) => {
    socketService.emitDeliveryComplete({ deliveryId });
    setCurrentDelivery(null);
  };

  const updateLocation = () => {
    if (navigator.geolocation && currentDelivery) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          
          // Emit location update
          socketService.emitCourierLocationUpdate({
            courierId: user!.id,
            deliveryId: currentDelivery.id,
            location: {
              ...newLocation,
              timestamp: new Date().toISOString(),
            },
          });
        },
        (error) => {
          console.error('Error updating location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Courier Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Availability Status</p>
              <p className="text-sm text-muted-foreground">
                {isAvailable ? 'Available for deliveries' : 'Currently unavailable'}
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleAvailabilityToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Delivery */}
      {currentDelivery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Current Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Order #{currentDelivery.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {currentDelivery.restaurant?.name}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{currentDelivery.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Total: ${currentDelivery.total}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handlePickupOrder(currentDelivery.id)}
                  size="sm"
                >
                  Mark as Picked Up
                </Button>
                <Button
                  onClick={() => handleCompleteDelivery(currentDelivery.id)}
                  variant="outline"
                  size="sm"
                >
                  Mark as Delivered
                </Button>
              </div>

              <Button
                onClick={updateLocation}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Update Location
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Assignments */}
      {deliveryAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              New Delivery Assignments
            </CardTitle>
            <CardDescription>
              You have {deliveryAssignments.length} new delivery assignment(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryAssignments.map((assignment) => (
                <div key={assignment.deliveryId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delivery #{assignment.deliveryId}</p>
                      <p className="text-sm text-muted-foreground">
                        Assigned at {new Date(assignment.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptDelivery(assignment.deliveryId)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectDelivery(assignment.deliveryId)}
                        variant="outline"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {location ? (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Latitude:</strong> {location.latitude.toFixed(6)}
              </p>
              <p className="text-sm">
                <strong>Longitude:</strong> {location.longitude.toFixed(6)}
              </p>
              <Button
                onClick={updateLocation}
                variant="outline"
                size="sm"
              >
                Refresh Location
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Location not available. Please enable location services.
              </p>
              <Button
                onClick={updateLocation}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Get Location
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Deliveries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$0.00</p>
              <p className="text-sm text-muted-foreground">Earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
