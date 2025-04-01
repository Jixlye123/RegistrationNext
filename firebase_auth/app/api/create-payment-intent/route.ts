import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "Not Loaded");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function POST(req: NextRequest) {
    try {
        const { amount } = await req.json();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "lkr",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    }catch (error) {
        console.error("Internal Error: ", error);
        return NextResponse.json(
            {error: `Internal Server Error: ${error}`},
            {status: 500}
        );
    }
}