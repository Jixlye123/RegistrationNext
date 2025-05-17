'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';

// Define the expected type for the query parameters
interface PaymentParams {
  fineId: string;
  amount: string;
}

// Custom styles for the CardElement to match shadcn/ui
const cardElementOptions = {
  style: {
    base: {
      color: '#fff', // White text
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#a0aec0', // Gray placeholder
      },
      lineHeight: '1.6', // Add line height for better spacing
      fontWeight: '400',
      '::selection': {
        backgroundColor: '#f6ad55', // Orange selection
      },
    },
    invalid: {
      color: '#e53e3e', // Red error
      iconColor: '#e53e3e',
    },
  },
};

const CheckoutForm = ({ fineId, amount }: { fineId: string; amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(false); // Add disabled state

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded.
      return;
    }

    setProcessing(true);
    setDisabled(true); // Disable the button during processing
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (cardElement === null) {
      return;
    }

    try {
      // 1. Create a PaymentIntent on your server (API route)
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fineId: fineId,
          amount: amount * 100, // Stripe expects amount in cents
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create PaymentIntent');
      }

      const { clientSecret } = await response.json();

      // 2. Confirm the PaymentIntent with the CardElement
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        // Payment failed
        setError(result.error.message);
        setProcessing(false);
        setDisabled(false); // Re-enable the button
        console.error("Payment Error", result.error);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Payment succeeded
        setSucceeded(true);
        setProcessing(false);

        // 3.  Update fine status to 'paid' on your server
        const updateStatusResponse = await fetch('/api/fines/update-status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fineId: fineId,
            status: 'paid',
          }),
        });

        if (!updateStatusResponse.ok) {
          const updateErrorData = await updateStatusResponse.json();
          console.error("Failed to update payment status", updateErrorData);
        }
        console.log("Payment Succeeded", result);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment.');
      setProcessing(false);
      setDisabled(false);
      console.error("Error during payment process", err);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="card" className="text-orange-300">Card Details</Label>
        <CardElement
          id="card"
          options={cardElementOptions}
          className={cn(
            'w-full p-3 border rounded-md bg-zinc-800 border-zinc-600 text-white',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            error && 'border-red-500'
          )}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-orange-300">Amount</Label>
        <Input
          id="amount"
          type="text"
          value={`Rs. ${amount.toFixed(2)}`}
          readOnly
          className="w-full text-white bg-zinc-800 border-zinc-600"
        />
      </div>

      <Button
        type="submit"
        disabled={processing || !stripe || disabled}
        className={cn(
          'w-full py-3 font-semibold text-white transition duration-300 rounded',
          processing ? 'opacity-70 cursor-not-allowed bg-orange-500' : 'bg-orange-600 hover:bg-orange-500',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
        )}
      >
        {processing ? (
          <>
            <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" /> Pay Now
          </>
        )}
      </Button>

      {succeeded && (
        <div className="flex items-center gap-2 mt-6 text-green-400">
          <CheckCircle className="w-5 h-5" />
          Payment successful! Your fine status will be updated shortly.
        </div>
      )}
    </form>
  );
};

const StripePaymentPage = () => {
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
  );
  const [paymentParams, setPaymentParams] = useState<PaymentParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const fineId = urlParams.get('fineId');
    const amount = urlParams.get('amount');

    if (fineId && amount) {
      setPaymentParams({ fineId, amount });
    } else {
      setError("Missing fineId or amount parameters.");
    }
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe Publishable Key is missing.  Please check your .env.local file.");
    }
  }, []);


  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-orange-300">Loading Stripe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative px-4 py-3 text-red-100 bg-red-900 border border-red-700 rounded" role="alert">
          <AlertTriangle className="w-6 h-6 mr-4" />
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!paymentParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-orange-300">Loading payment...</p>
      </div>
    );
  }

  const amountNum = Number(paymentParams.amount);
  if (isNaN(amountNum)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400">Invalid amount provided.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-black via-zinc-900 to-orange-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-orange-400">
            Pay Your Fine
          </h2>
          <p className="mt-2 text-sm text-orange-200">
            Use your credit or debit card to pay the fine.
          </p>
        </div>
        <div className="p-8 border border-orange-500 rounded-lg shadow-2xl bg-zinc-800">
          <Elements stripe={stripePromise}>
            <CheckoutForm fineId={paymentParams.fineId} amount={amountNum} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentPage;
