import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: usersCount },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
  ])

  // Calculate revenue
  const { data: revenue } = await supabase
    .from('orders')
    .select('total')
    .eq('payment_status', 'paid')

  const totalRevenue = revenue?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0

  return {
    productsCount: productsCount || 0,
    ordersCount: ordersCount || 0,
    usersCount: usersCount || 0,
    totalRevenue,
    recentOrders: recentOrders || []
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      name: 'Produkty',
      value: stats.productsCount,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Objednávky',
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      name: 'Uživatelé',
      value: stats.usersCount,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Tržby',
      value: `${stats.totalRevenue.toLocaleString('cs-CZ')} Kč`,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Čeká',
    confirmed: 'Potvrzeno',
    shipped: 'Odesláno',
    delivered: 'Doručeno',
    cancelled: 'Zrušeno',
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.name}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4"
          >
            <div className={`${card.color} p-4 rounded-xl`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.name}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Poslední objednávky</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Zákazník
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Celkem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Datum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Zatím žádné objednávky
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.shipping_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {Number(order.total).toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('cs-CZ')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
