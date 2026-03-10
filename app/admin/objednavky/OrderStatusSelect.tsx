'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'pending', label: 'Čeká', color: 'text-yellow-600' },
  { value: 'confirmed', label: 'Potvrzeno', color: 'text-blue-600' },
  { value: 'shipped', label: 'Odesláno', color: 'text-purple-600' },
  { value: 'delivered', label: 'Doručeno', color: 'text-green-600' },
  { value: 'cancelled', label: 'Zrušeno', color: 'text-red-600' },
]

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value

    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    router.refresh()
  }

  const currentOption = statusOptions.find(opt => opt.value === currentStatus)

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`px-2 py-1 border border-gray-200 rounded-lg text-sm font-medium ${currentOption?.color} bg-transparent focus:outline-none focus:ring-2 focus:ring-[#00adef]`}
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
