'use client';

import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '../../../hooks/useOrders';
import { OrderTracking } from '../../../components/OrderTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Loader2, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const { order, loading, error } = useOrder(orderId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <Package className="h-4 w-4" />
              <AlertDescription>
                {error?.message || 'Order not found'}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button asChild variant="outline">
                <Link href="/orders">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              {order.restaurant?.name} • {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Order Tracking */}
          <OrderTracking order={order} />

          {/* Order Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Complete order information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Order Number</p>
                    <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Status</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-sm text-muted-foreground">${order.total}</p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.menuItem?.name}</span>
                          <span>${item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${order.tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryFee}</span>
                  </div>
                  {parseFloat(order.tip) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tip</span>
                      <span>${order.tip}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${order.total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
