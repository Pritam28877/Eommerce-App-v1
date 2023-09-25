"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart"

import { Button } from "@/components/ui/button"
import { stripe } from "@/lib/stripe"

export function CartSummary() {
  const {
    cartDetails,
    formattedTotalPrice,
    totalPrice,
    cartCount,
    redirectToCheckout,
  } = useShoppingCart()
  const [loading, setLoading] = useState(false)
  const isDisabled = cartCount === 0 || loading
  const shippingAmont = cartCount! > 0 ? 100 : 0
  const totalAmount = totalPrice ? totalPrice + shippingAmont : shippingAmont
  async function onCheckout() {
    setLoading(true);
    console.log(cartDetails);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ cartDetails }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data); // log the entire data object
      
      if (!data.url) {
        throw new Error("No checkout URL in API response");
      }
      
      // Redirect to the Stripe checkout URL
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium">{formattedTotalPrice}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
          <dt className="flex items-center text-sm">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-sm font-medium">
            {formatCurrencyString({ value: totalAmount, currency: "USD" })}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
          <dt className="text-base font-medium">Order total</dt>
          <dd className="text-base font-medium">Order Amount</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button onClick={onCheckout} className="w-full" disabled={isDisabled}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Loading..." : "Checkout"}
        </Button>
      </div>
    </section>
  )
}
