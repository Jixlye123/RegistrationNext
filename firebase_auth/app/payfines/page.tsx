"use client";

import CheckoutPage from "@/components/CheckOut";
import covertToSubCurrency from "@/lib/convertToSubCurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY == undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PayFinesPage() {
  const amount = 1000.0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-orange-500 via-black to-black">
      <div className="w-full max-w-4xl p-8 text-center text-white border shadow-lg bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
        <div className="mb-10">
          <h1 className="mb-2 text-4xl font-bold">🚦 Pawani Jayawardhana</h1>
          <h2 className="mb-2 text-2xl font-semibold">has requested</h2>
          <span className="text-2xl font-bold">LKR {amount.toFixed(2)}</span>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: covertToSubCurrency(amount, 100),
            currency: "lkr",
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>

        <div className="mt-10">
          <Link href="/disputefines">
            <button className="px-6 py-3 font-bold text-white transition bg-red-500 rounded-md hover:bg-red-700">
              Dispute Fine
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
