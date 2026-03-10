import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AddToCartButton } from '@/components/products/AddToCartButton'
import { ProductGallery } from '@/components/products/ProductGallery'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(id, url, alt, sort_order),
      product_models(mercedes_models(id, name, slug)),
      reviews(id, rating, title, content, created_at, profiles(full_name))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Produkt nenalezen | MercDeal' }
  }

  return {
    title: `${product.name} | MercDeal`,
    description: product.description || `Kupte ${product.name} za skvělou cenu na MercDeal.`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.product_images?.[0]?.url ? [product.product_images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const images = product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
  const models = product.product_models?.map((pm: any) => pm.mercedes_models) || []
  const approvedReviews = product.reviews?.filter((r: any) => r.is_approved) || []

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images[0]?.url,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'CZK',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.review_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#00adef]">Domů</Link>
            <span className="mx-2">/</span>
            <Link href="/produkty" className="hover:text-[#00adef]">Produkty</Link>
            {product.categories && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/kategorie/${product.categories.slug}`} className="hover:text-[#00adef]">
                  {product.categories.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Gallery */}
              <ProductGallery images={images} productName={product.name} />

              {/* Info */}
              <div>
                {product.badge && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${
                    product.badge === 'TOP' ? 'bg-[#00adef]' :
                    product.badge === 'NOVINKA' ? 'bg-green-500' :
                    product.badge === 'PREMIUM' ? 'bg-purple-500' :
                    product.badge === 'SLEVA' ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {product.badge}
                  </span>
                )}

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                {/* Rating */}
                {product.review_count > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-gray-500">
                      {product.rating} ({product.review_count} recenzí)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {Number(product.price).toLocaleString('cs-CZ')} Kč
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        {Number(product.original_price).toLocaleString('cs-CZ')} Kč
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <p className="text-green-600 font-medium">
                      ✓ Skladem ({product.stock} ks)
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      ✕ Vyprodáno
                    </p>
                  )}
                </div>

                {/* Models */}
                {models.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Kompatibilní modely:</p>
                    <div className="flex flex-wrap gap-2">
                      {models.map((model: any) => (
                        <Link
                          key={model.id}
                          href={`/model/${model.slug}`}
                          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
                        >
                          {model.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to cart */}
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: images[0]?.url || null,
                    stock: product.stock,
                  }}
                />

                {/* SKU */}
                {product.sku && (
                  <p className="text-sm text-gray-500 mt-6">
                    SKU: {product.sku}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popis</h2>
                <div className="prose max-w-none text-gray-600">
                  {product.description}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="border-t border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Recenze ({approvedReviews.length})
              </h2>

              {approvedReviews.length === 0 ? (
                <p className="text-gray-500">Zatím žádné recenze</p>
              ) : (
                <div className="space-y-6">
                  {approvedReviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex text-yellow-400 text-sm">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {review.profiles?.full_name || 'Anonym'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('cs-CZ')}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                      )}
                      {review.content && (
                        <p className="text-gray-600">{review.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
