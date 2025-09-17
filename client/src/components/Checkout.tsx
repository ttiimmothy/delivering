'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCheckoutSession } from '../hooks/usePayment';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';
import { Loader2, CreditCard, Shield, Clock } from 'lucide-react';
import { CreateCheckoutSessionInput } from '../types/graphql';

interface CheckoutProps {
  orderId: string;
  total: string;
  restaurantName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function Checkout({ orderId, total, restaurantName, onSuccess, onCancel }: CheckoutProps) {
  const router = useRouter();
  const { createCheckoutSession, loading, error } = useCreateCheckoutSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      
      const input: CreateCheckoutSessionInput = {
        orderId,
        amount: parseFloat(total.replace('$', '')), // Convert total string to number
        currency: 'usd', // Default currency
        successUrl: `${window.location.origin}/orders/${orderId}?payment=success`,
        cancelUrl: `${window.location.origin}/orders/${orderId}?payment=cancelled`,
      };

      const session = await createCheckoutSession(input);
      
      if (session?.url) {
        // Redirect to Stripe Checkout
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          Secure payment for your order from {restaurantName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">${total}</div>
          <p className="text-sm text-muted-foreground">Total amount</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message || 'Failed to create checkout session. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secured by Stripe</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Payment processed instantly</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleCheckout} 
            disabled={loading || isProcessing}
            className="w-full"
            size="lg"
          >
            {loading || isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Stripe
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="w-full"
            disabled={loading || isProcessing}
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          By proceeding, you agree to our terms of service and privacy policy.
        </div>
      </CardContent>
    </Card>
  );
}
