import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, Settings, MapPin } from 'lucide-react'

async function getUserData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prihlaseni')

  const [
    { data: profile },
    { data: orders },
    { data: wishlist }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('wishlist').select('*, products(*)').eq('user_id', user.id)
  ])

  return { user, profile, orders: orders || [], wishlist: wishlist || [] }
}

export default async function AccountPage() {
  const { user, profile, orders, wishlist } = await getUserData()

  const statusLabels: Record<string, string> = {
    pending: 'Čeká na zpracování',
    confirmed: 'Potvrzeno',
    shipped: 'Odesláno',
    delivered: 'Doručeno',
    cancelled: 'Zrušeno',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Můj účet</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#00adef] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile?.full_name || 'Uživatel'}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <Link
                href="/ucet/nastaveni"
                className="flex items-center gap-2 text-[#00adef] hover:underline"
              >
                <Settings className="w-4 h-4" />
                Upravit profil
              </Link>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Link
                href="/ucet/objednavky"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 transition"
              >
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Moje objednávky</p>
                  <p className="text-sm text-gray-500">{orders.length} objednávek</p>
                </div>
              </Link>
              <Link
                href="/ucet/oblibene"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 transition"
              >
                <Heart className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Oblíbené produkty</p>
                  <p className="text-sm text-gray-500">{wishlist.length} položek</p>
                </div>
              </Link>
              <Link
                href="/ucet/adresy"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Uložené adresy</p>
                  <p className="text-sm text-gray-500">Správa doručovacích adres</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent orders */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Poslední objednávky</h2>
                <Link href="/ucet/objednavky" className="text-[#00adef] hover:underline text-sm">
                  Zobrazit vše
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Zatím nemáte žádné objednávky</p>
                  <Link
                    href="/produkty"
                    className="inline-block bg-[#00adef] text-white px-6 py-2 rounded-lg hover:bg-[#0095cc] transition"
                  >
                    Prohlédnout produkty
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order: any) => (
                    <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-mono text-sm text-gray-500">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('cs-CZ')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-900">
                          {Number(order.total).toLocaleString('cs-CZ')} Kč
                        </p>
                        <Link
                          href={`/ucet/objednavky/${order.id}`}
                          className="text-[#00adef] hover:underline text-sm"
                        >
                          Detail →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist preview */}
            {wishlist.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Oblíbené produkty</h2>
                  <Link href="/ucet/oblibene" className="text-[#00adef] hover:underline text-sm">
                    Zobrazit vše
                  </Link>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wishlist.slice(0, 4).map((item: any) => (
                    <Link
                      key={item.product_id}
                      href={`/produkty/${item.products.slug}`}
                      className="group"
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 group-hover:scale-110 transition">
                          📦
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#00adef]">
                        {item.products.name}
                      </p>
                      <p className="text-sm font-bold">
                        {Number(item.products.price).toLocaleString('cs-CZ')} Kč
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
