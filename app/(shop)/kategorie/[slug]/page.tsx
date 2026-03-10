import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) return null

  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return { category, products: products || [] }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const data = await getCategory(slug)

  if (!data) {
    notFound()
  }

  const { category, products } = data

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        <p className="text-gray-600 mt-2">{products.length} produktů</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">V této kategorii zatím nejsou žádné produkty.</p>
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
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
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
