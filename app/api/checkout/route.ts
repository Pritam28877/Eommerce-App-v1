import { NextResponse } from "next/server"
// @ts-ignore
import { validateCartItems } from "use-shopping-cart/utilities"

import { inventory } from "@/config/inventory"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const { cartDetails } = await request.json()

  const line_items = validateCartItems(inventory, cartDetails)
  const origin = request.headers.get("origin")

  const seassion = await stripe.checkout.sessions.create({
    submit_type: "pay",
    mode: "payment",
    line_items,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "IN"],
    },
    shipping_options: [
      {
        shipping_rate: "shr_1Nu9YPSAWTK2a9UdriX34EZv",
      },
    ],
    billing_address_collection: "auto",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/card`,
  })
  return NextResponse.json(seassion)
}
