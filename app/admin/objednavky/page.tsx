import { createClient } from '@/lib/supabase/server'
import { OrderStatusSelect } from './OrderStatusSelect'

async function getOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false })

  return data || []
}

export default async function OrdersPage() {
  const orders = await getOrders()

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const paymentColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  const paymentLabels: Record<string, string> = {
    pending: 'Čeká',
    paid: 'Zaplaceno',
    failed: 'Selhalo',
  }

  const methodLabels: Record<string, string> = {
    cod: 'Dobírka',
    bank_transfer: 'Bankovní převod',
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Objednávky</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                Položky
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Celkem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Platba
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Zatím žádné objednávky
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.shipping_name}</p>
                      <p className="text-sm text-gray-500">{order.shipping_email}</p>
                      <p className="text-sm text-gray-500">{order.shipping_phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.order_items?.length || 0} položek
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {Number(order.total).toLocaleString('cs-CZ')} Kč
                    </p>
                    <p className="text-xs text-gray-500">
                      {methodLabels[order.payment_method]}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.payment_status]}`}>
                      {paymentLabels[order.payment_status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
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
  )
}
