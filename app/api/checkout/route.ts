import { NextResponse } from "next/server"
// @ts-ignore
import { validateCartItems } from "use-shopping-cart/utilities"

import { inventory } from "@/config/inventory"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const { cartDetails } = await request.json()
  console.log(inventory)

  const line_items = validateCartItems(inventory, cartDetails) // changed lineitems to line_items
  console.log(line_items)
  const origin = request.headers.get("origin")

  const session = await stripe.checkout.sessions.create({
    submit_type: "pay",
    mode: "payment",
    line_items, // changed lineitems to line_items
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "IN"],
    },
    shipping_options: [
      {
        shipping_rate: "shr_1NuI0EACnWY2s0N92ESYzdCK",
      },
    ],
    billing_address_collection: "auto",
   success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/card`,
  })
  return NextResponse.json(session)
}
