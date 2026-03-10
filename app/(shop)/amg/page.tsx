import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

async function getAMGProducts() {
  const supabase = await createClient()

  // Hledat produkty s AMG v názvu nebo s badge PREMIUM/AMG
  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .or('name.ilike.%AMG%,badge.eq.PREMIUM')
    .order('created_at', { ascending: false })

  return products || []
}

export default async function AMGPage() {
  const products = await getAMGProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Mercedes-<span className="text-red-600">AMG</span>
        </h1>
        <p className="text-gray-600">Prémiové díly a příslušenství pro AMG modely</p>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-8 mb-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Driving Performance</h2>
          <p className="text-gray-300">
            AMG - Aufrecht Melcher Großaspach. Divize Mercedes-Benz zaměřená na vysoký výkon.
            Nabízíme originální i aftermarket díly pro všechny AMG modely.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Momentálně nejsou k dispozici žádné AMG produkty.</p>
          <Link href="/produkty" className="text-[#00adef] hover:underline mt-2 inline-block">
            Zobrazit všechny produkty
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
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
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                  AMG
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#00adef]">
                    {product.price.toLocaleString('cs-CZ')} Kč
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.original_price.toLocaleString('cs-CZ')} Kč
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
