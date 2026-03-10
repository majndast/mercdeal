'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { trackInitiateCheckout } from '@/components/seo/MetaPixel'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="bg-white rounded-xl p-8 h-64" />
          </div>
        </div>
      </div>
    )
  }

  const shipping = totalPrice() >= 2000 ? 0 : 149
  const total = totalPrice() + shipping

  const handleCheckout = () => {
    trackInitiateCheckout(total)
    router.push('/pokladna')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Váš košík je prázdný</h1>
          <p className="text-gray-500 mb-8">Přidejte do košíku nějaké produkty a vraťte se zpět.</p>
          <Link
            href="/produkty"
            className="inline-block bg-[#00adef] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0095cc] transition"
          >
            Prohlédnout produkty
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Košík</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-6 border-b border-gray-100 last:border-0"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-[#00adef] font-bold">
                      {item.price.toLocaleString('cs-CZ')} Kč
                    </p>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="w-24 text-right font-bold text-gray-900">
                    {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                  </p>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Vyprázdnit košík
            </button>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Souhrn objednávky</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Mezisoučet</span>
                  <span>{totalPrice().toLocaleString('cs-CZ')} Kč</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Doprava</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Zdarma</span>
                    ) : (
                      `${shipping} Kč`
                    )}
                  </span>
                </div>
                {totalPrice() < 2000 && (
                  <p className="text-sm text-gray-500">
                    Do dopravy zdarma zbývá {(2000 - totalPrice()).toLocaleString('cs-CZ')} Kč
                  </p>
                )}
                <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-bold text-gray-900">
                  <span>Celkem</span>
                  <span>{total.toLocaleString('cs-CZ')} Kč</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#00adef] text-white py-4 rounded-lg font-semibold hover:bg-[#0095cc] transition"
              >
                Pokračovat k pokladně
              </button>

              <Link
                href="/produkty"
                className="block text-center text-[#00adef] mt-4 hover:underline"
              >
                ← Pokračovat v nákupu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
