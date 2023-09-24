import { client } from "@/sanity/lib/client"
import { product } from "@/sanity/schemas/product-schema"
import { groq } from "next-sanity"
import { Product } from "use-shopping-cart/core"

import { SanityProduct } from "@/config/inventory"
import { siteConfig } from "@/config/site"
import { seedSanityData } from "@/lib/seed"
import { cn } from "@/lib/utils"
import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { ProductSort } from "@/components/product-sort"

interface Props {
  searchParams : {
    date?: string
    price?: string
    color?: string
    category?: string
    size?: string
  }
}

export default async function Page({searchParams}:Props) {
  console.log(searchParams)
  const priceOrder = searchParams.price ? `| order(price ${searchParams.price})` : ``
  const dateOrder = searchParams.date ? `| order(_createdAt ${searchParams.date})` : ``
  const order = `${priceOrder} ${dateOrder}`

  const productFilter = `_type == "product"`
  const categoryFilter = searchParams.category ? ` && "${searchParams.category}" in categories` : ``
  const colorFilter = searchParams.color ? ` && "${searchParams.color}" in colors` : ``
  const sizeFilter = searchParams.size ? ` && "${searchParams.size}"in sizes` : ``
  const filter = `*[${productFilter} ${categoryFilter} ${colorFilter} ${sizeFilter}]`
  const Products = await client.fetch<SanityProduct[]>(
    groq`${filter} ${order}  {
      _id,
      _createdAt,
      name,
      sku,
      image,
      images,
      currency,
      price,
      description,
      "slug": slug.current,
    }`
  )

  return (
    <div>
      <div className="px-4 pt-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-normal">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base">
          {siteConfig.description}
        </p>
      </div>
      <div>
        <main className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 pt-24 dark:border-gray-800">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {Products.length}product{Products.length > 1 && "s"}
            </h1>
            {/* Product Sort */}
            <ProductSort />
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            <div
              className={cn(
                "grid grid-cols-1 gap-x-8 gap-y-10 ",
                Products.length > 0
                  ? "lg:grid-cols-4"
                  : "lg:grid-cols-[1fr_3fr]"
              )}
            >
              <div className="hidden lg:block">
                {/* Product filters */}
                <ProductFilters />
              </div>
              {/* Product grid */}
              <ProductGrid products={Products} />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
