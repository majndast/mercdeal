import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getModel(slug: string) {
  const supabase = await createClient()

  const { data: model } = await supabase
    .from('mercedes_models')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!model) return null

  const { data: productModels } = await supabase
    .from('product_models')
    .select('product_id')
    .eq('model_id', model.id)

  const productIds = productModels?.map((pm: any) => pm.product_id) || []

  let products: any[] = []
  if (productIds.length > 0) {
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .in('id', productIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    products = data || []
  }

  return { model, products }
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params
  const data = await getModel(slug)

  if (!data) {
    notFound()
  }

  const { model, products } = data

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mercedes-Benz {model.name}</h1>
        {model.year_from && (
          <p className="text-gray-600 mt-2">
            Roky výroby: {model.year_from} - {model.year_to || 'současnost'}
          </p>
        )}
        <p className="text-gray-500 mt-1">{products.length} kompatibilních produktů</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Pro tento model zatím nejsou žádné produkty.</p>
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
