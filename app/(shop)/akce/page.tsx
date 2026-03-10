import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ShoppingCart, Tag } from 'lucide-react'

async function getSaleProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .not('original_price', 'is', null)
    .order('created_at', { ascending: false })

  return products || []
}

export default async function SalePage() {
  const products = await getSaleProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full mb-4">
          <Tag className="w-5 h-5" />
          <span className="font-bold">AKČNÍ NABÍDKY</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Zlevněné produkty</h1>
        <p className="text-gray-600 mt-2">Využijte slevy na vybrané produkty</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Momentálně nejsou žádné akční nabídky.</p>
          <Link href="/produkty" className="text-[#00adef] hover:underline mt-2 inline-block">
            Zobrazit všechny produkty
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const discount = product.original_price
              ? Math.round((1 - product.price / product.original_price) * 100)
              : 0

            return (
              <Link
                key={product.id}
                href={`/produkty/${product.slug}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.product_images?.[0]?.url ? (
                    <img
                      src={product.product_images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                    -{discount}%
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-500">
                      {product.price.toLocaleString('cs-CZ')} Kč
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.original_price.toLocaleString('cs-CZ')} Kč
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
