import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  badge: string | null
  rating: number
  review_count: number
  categories: { name: string; slug: string } | null
  product_images: { url: string }[]
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl">
        <p className="text-gray-500 text-lg">Žádné produkty nebyly nalezeny</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const discount = product.original_price
          ? Math.round((1 - product.price / product.original_price) * 100)
          : null

        return (
          <Link
            key={product.id}
            href={`/produkty/${product.slug}`}
            className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative bg-gray-50 h-48 flex items-center justify-center">
              {product.product_images?.[0]?.url ? (
                <img
                  src={product.product_images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-6xl text-gray-300 group-hover:scale-110 transition-transform">
                  📦
                </span>
              )}
              {product.badge && (
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  product.badge === 'TOP' ? 'bg-[#00adef]' :
                  product.badge === 'NOVINKA' ? 'bg-green-500' :
                  product.badge === 'PREMIUM' ? 'bg-purple-500' :
                  product.badge === 'SLEVA' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-[#00adef] mb-1">
                {product.categories?.name || 'Bez kategorie'}
              </p>
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[#00adef] transition">
                {product.name}
              </h3>

              {/* Rating */}
              {product.review_count > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-gray-400 text-sm">({product.review_count})</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  {product.price.toLocaleString('cs-CZ')} Kč
                </span>
                {product.original_price && (
                  <span className="text-gray-400 line-through text-sm">
                    {product.original_price.toLocaleString('cs-CZ')} Kč
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
