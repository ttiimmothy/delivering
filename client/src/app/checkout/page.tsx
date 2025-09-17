'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrder } from '../../hooks/useOrders';
import { Checkout } from '../../components/Checkout';
import { PaymentForm } from '../../components/PaymentForm';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { Loader2, ArrowLeft, CreditCard, ExternalLink } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentMethod = searchParams.get('method') || 'checkout'; // 'checkout' or 'form'
  
  const { order, loading, error } = useOrder(orderId || '');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  const handlePaymentSuccess = (paymentIntentId?: string) => {
    console.log('Payment successful:', paymentIntentId);
    router.push(`/orders/${orderId}?payment=success`);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const handleCancel = () => {
    router.push(`/orders/${orderId}`);
  };

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
              <AlertDescription>
                {error?.message || 'Order not found'}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
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
              <Link href={`/orders/${orderId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Order
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
            <p className="text-muted-foreground">
              Order #{order.orderNumber} • {order.restaurant?.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your order before payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryFee}</span>
                  </div>
                  {parseFloat(order.tip) > 0 && (
                    <div className="flex justify-between">
                      <span>Tip</span>
                      <span>${order.tip}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${order.total}</span>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Items</h4>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.menuItem?.name}</span>
                        <span>${item.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Section */}
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant={paymentMethod === 'checkout' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => router.push(`/checkout?orderId=${orderId}&method=checkout`)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Stripe Checkout (Recommended)
                    </Button>
                    <Button
                      variant={paymentMethod === 'form' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => router.push(`/checkout?orderId=${orderId}&method=form`)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Direct Payment Form
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Component */}
              {paymentMethod === 'checkout' ? (
                <Checkout
                  orderId={order.id}
                  total={order.total}
                  restaurantName={order.restaurant?.name || 'Restaurant'}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleCancel}
                />
              ) : (
                <PaymentForm
                  amount={parseFloat(order.total)}
                  description={`Order #${order.orderNumber} from ${order.restaurant?.name}`}
                  metadata={{
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    restaurantId: order.restaurant?.id || '',
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {paymentError && (
                <Alert variant="destructive">
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
