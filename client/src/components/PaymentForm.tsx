'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCreatePaymentIntent, useConfirmPaymentIntent } from '../hooks/usePayment';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';
import { FormSubmitButton } from './forms';
import { paymentSchema, type PaymentFormData } from '../schemas/forms';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';
import { CreatePaymentIntentInput } from '../types/graphql';

interface PaymentFormProps {
  amount: number;
  description?: string;
  metadata?: Record<string, string>;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ 
  amount, 
  description, 
  metadata, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, loading: creatingIntent } = useCreatePaymentIntent();
  const { confirmPaymentIntent, loading: confirmingPayment } = useConfirmPaymentIntent();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const methods = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount,
      description: description || '',
      metadata: metadata || {}
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: PaymentFormData) => {
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    try {
      setError(null);

      // Create payment intent
      const input: CreatePaymentIntentInput = {
        amount: data.amount,
        currency: 'usd',
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };

      const paymentIntent = await createPaymentIntent(input);
      
      if (!paymentIntent?.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError?.(stripeError.message || 'Payment failed');
      } else if (confirmedPaymentIntent?.status === 'succeeded') {
        setSuccess(true);
        onSuccess?.(confirmedPaymentIntent.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your payment has been processed successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Enter your card information to complete the payment
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Information</label>
            <div className="p-3 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <div className="text-2xl font-bold">${amount.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total amount</p>
          </div>

          <FormSubmitButton
            isLoading={isSubmitting || creatingIntent || confirmingPayment}
            disabled={!stripe}
            className="w-full"
            size="lg"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ${amount.toFixed(2)}
          </FormSubmitButton>
        </form>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          <p>🔒 Secured by Stripe</p>
          <p>Your payment information is encrypted and secure</p>
        </div>
      </CardContent>
    </Card>
  );
}
