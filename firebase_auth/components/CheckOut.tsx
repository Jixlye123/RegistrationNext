"use client";

import React, { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import covertToSubCurrency from "@/lib/convertToSubCurrency";
import { PaymentIntentResult } from "@stripe/stripe-js";

const CheckoutPage = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!amount)  return;
        console.log("Fetching clientSecret...");
        
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: covertToSubCurrency(amount, 100) }),
        })
        .then(async (res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log("API Response:", data);
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                throw new Error("Missing clientSecret in API response");
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            setErrorMessage(error.message);
        })
        .finally(() => setLoading(false));
    }, [amount]);

    if (loading) return <p>Loading payment form...</p>;
    if (errorMessage) return <p style={{ color: "red" }}>Error: {errorMessage}</p>;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
    

    if(!stripe || !elements){
        setErrorMessage("Something went wrong");
        setLoading(false);
        return;
    }

    const paymentElement = elements.getElement(PaymentElement);
    if (!paymentElement) {
        setErrorMessage("Payment element not found");
        setLoading(false);
        return;
    }

    if(!clientSecret){
        setErrorMessage("Payment intent isnt ready,Something went wrong");
        setLoading(false);
        return;
    }


    

    const result = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret!,
        confirmParams: {
            return_url: `http://localhost:3001/payment-success?amount=${amount}`,
        },
    }); 
    
    if (result.error?.message) {
        setErrorMessage(result.error.message);
    } else {
        setErrorMessage("Payment successful!");
    }
    
    setLoading(false);

    if (!clientSecret ||  !stripe || !elements){
        return (
            <div className="flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]
                 text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                 </div>
            </div>
        )
    }
}
    return (
        <form onSubmit={handleSubmit} className="p-2 bg-white rounded-md">
            {clientSecret ? <PaymentElement /> : <p>Waiting for payment intent...</p>}
            {errorMessage && <div>{errorMessage}</div>}
            <button type="submit" disabled={!stripe || loading || !clientSecret} className="w-full p-5 mt-2 font-bold text-white bg-black rounded-md disabled:opacity-50 disabled:animate-pulse">
                {!loading ? `Pay LKR${amount}` : "Processing"}
            </button>
        </form>
    );
};

export default CheckoutPage;