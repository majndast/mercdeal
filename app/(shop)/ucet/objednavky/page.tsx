import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'

async function getOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/prihlaseni?redirect=/ucet/objednavky')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return orders || []
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Čeká na zpracování', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Potvrzeno', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Odesláno', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Doručeno', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Zrušeno', color: 'bg-red-100 text-red-800' },
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/ucet" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#00adef] mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zpět na účet
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Moje objednávky</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Zatím nemáte žádné objednávky.</p>
          <Link
            href="/produkty"
            className="inline-block bg-[#00adef] text-white px-6 py-3 rounded-lg hover:bg-[#0095cc] transition"
          >
            Začít nakupovat
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold">Objednávka #{order.order_number}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusLabels[order.status]?.color || 'bg-gray-100'}`}>
                  {statusLabels[order.status]?.label || order.status}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="space-y-2">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.products?.name || 'Produkt'} × {item.quantity}
                      </span>
                      <span className="font-medium">{item.price.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t font-bold">
                  <span>Celkem</span>
                  <span className="text-[#00adef]">{order.total.toLocaleString('cs-CZ')} Kč</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
