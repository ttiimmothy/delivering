'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Phone, Clock, DollarSign, Star } from 'lucide-react';
import { Restaurant } from '@/types/graphql';

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

export function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  return (
    <div className="space-y-6">
      {/* Restaurant Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Restaurant Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Currently
            </span>
            {restaurant.isOpen ? (
              <Badge className="bg-green-500 text-white">
                Open
              </Badge>
            ) : (
              <Badge variant="destructive">
                Closed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Delivery Time</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {restaurant.deliveryTime} minutes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Delivery Fee</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ${restaurant.deliveryFee}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Minimum Order</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ${restaurant.minimumOrder}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold ml-1">
                {restaurant.rating || 'N/A'}
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({restaurant.reviewCount || 0} reviews)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {restaurant.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {restaurant.address.street}<br />
                  {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
                </p>
              </div>
            </div>
          )}
          
          {restaurant.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {restaurant.phone}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cuisine Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cuisine</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="text-sm">
            {restaurant.cuisine}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
