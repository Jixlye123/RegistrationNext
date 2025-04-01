"use client"

import CheckoutPage from "@/components/CheckOut";
import covertToSubCurrency from "@/lib/convertToSubCurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY == undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PayFinesPage() {
    const amount = 1000.00
    return (
        <main className="max-w-6xl mx-auto p-10 text-center text-white border m-10 rounded-md bg-gradient-to-tr from-orange-500 to-black-500">
            <div className="mb-10">
                <h1 className="text-3xl font-bold">Jinuka</h1>
                <h2 className="text-2xl font-bold">has requested</h2>
                <span className="text-2xl font-bold">LKR{amount}</span>
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

        </main>
    )
}