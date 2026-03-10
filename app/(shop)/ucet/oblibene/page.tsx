import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft, ShoppingCart } from 'lucide-react'

async function getWishlist() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/prihlaseni?redirect=/ucet/oblibene')
  }

  const { data: wishlist } = await supabase
    .from('wishlist')
    .select('*, products(*, product_images(*))')
    .eq('user_id', user.id)

  return wishlist || []
}

export default async function WishlistPage() {
  const wishlist = await getWishlist()

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/ucet" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#00adef] mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zpět na účet
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Oblíbené produkty</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Zatím nemáte žádné oblíbené produkty.</p>
          <Link
            href="/produkty"
            className="inline-block bg-[#00adef] text-white px-6 py-3 rounded-lg hover:bg-[#0095cc] transition"
          >
            Prohlédnout produkty
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item: any) => (
            <Link
              key={item.id}
              href={`/produkty/${item.products.slug}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {item.products.product_images?.[0]?.url ? (
                  <img
                    src={item.products.product_images[0].url}
                    alt={item.products.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                )}
                <button className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-white" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.products.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#00adef]">
                    {item.products.price.toLocaleString('cs-CZ')} Kč
                  </span>
                  {item.products.original_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {item.products.original_price.toLocaleString('cs-CZ')} Kč
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
