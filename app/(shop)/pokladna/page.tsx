'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { createClient } from '@/lib/supabase/client'
import { trackPurchase } from '@/components/seo/MetaPixel'

const checkoutSchema = z.object({
  shipping_name: z.string().min(2, 'Zadejte jméno'),
  shipping_email: z.string().email('Zadejte platný email'),
  shipping_phone: z.string().min(9, 'Zadejte platné telefonní číslo'),
  shipping_address: z.string().min(5, 'Zadejte adresu'),
  shipping_city: z.string().min(2, 'Zadejte město'),
  shipping_zip: z.string().min(5, 'Zadejte PSČ'),
  billing_same: z.boolean(),
  billing_name: z.string().optional(),
  billing_address: z.string().optional(),
  billing_city: z.string().optional(),
  billing_zip: z.string().optional(),
  billing_ico: z.string().optional(),
  billing_dic: z.string().optional(),
  payment_method: z.enum(['cod', 'bank_transfer']),
  note: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billing_same: true,
      payment_method: 'cod',
    },
  })

  const billingSame = watch('billing_same')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0 && !orderComplete) {
      router.push('/kosik')
    }
  }, [mounted, items.length, orderComplete, router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="bg-white rounded-xl p-8 h-96" />
          </div>
        </div>
      </div>
    )
  }

  const shipping = totalPrice() >= 2000 ? 0 : 149
  const codFee = 39
  const total = totalPrice() + shipping

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const finalTotal = data.payment_method === 'cod' ? total + codFee : total

      // Create order
      const orderData = {
        user_id: user?.id || null,
        status: 'pending' as const,
        payment_method: data.payment_method,
        payment_status: 'pending' as const,
        subtotal: totalPrice(),
        shipping,
        total: finalTotal,
        shipping_name: data.shipping_name,
        shipping_email: data.shipping_email,
        shipping_phone: data.shipping_phone,
        shipping_address: data.shipping_address,
        shipping_city: data.shipping_city,
        shipping_zip: data.shipping_zip,
        billing_same: data.billing_same,
        billing_name: data.billing_same ? null : data.billing_name,
        billing_address: data.billing_same ? null : data.billing_address,
        billing_city: data.billing_same ? null : data.billing_city,
        billing_zip: data.billing_same ? null : data.billing_zip,
        billing_ico: data.billing_same ? null : data.billing_ico,
        billing_dic: data.billing_same ? null : data.billing_dic,
        note: data.note || null,
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData as any)
        .select()
        .single()

      if (orderError) throw orderError

      const orderId = (order as any).id

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any)

      if (itemsError) throw itemsError

      // Track purchase
      trackPurchase(orderId, finalTotal)

      // Clear cart and show success
      setOrderId(orderId)
      setOrderComplete(true)
      clearCart()
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Chyba při vytváření objednávky. Zkuste to prosím znovu.')
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Děkujeme za objednávku!</h1>
            <p className="text-gray-600 mb-6">
              Vaše objednávka byla úspěšně přijata. Potvrzení jsme vám zaslali na email.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Číslo objednávky: <span className="font-mono">{orderId?.slice(0, 8)}</span>
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#00adef] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0095cc] transition"
            >
              Zpět na hlavní stránku
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pokladna</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Doručovací údaje</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jméno a příjmení *
                    </label>
                    <input
                      {...register('shipping_name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                    />
                    {errors.shipping_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('shipping_email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                    />
                    {errors.shipping_email && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      {...register('shipping_phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                    />
                    {errors.shipping_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_phone.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresa *
                    </label>
                    <input
                      {...register('shipping_address')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                    />
                    {errors.shipping_address && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_address.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Město *
                    </label>
                    <input
                      {...register('shipping_city')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                    />
                    {errors.shipping_city && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PSČ *
                    </label>
                    <input
                      {...register('shipping_zip')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                    />
                    {errors.shipping_zip && (
                      <p className="text-red-500 text-sm mt-1">{errors.shipping_zip.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <label className="flex items-center gap-3 cursor-pointer mb-6">
                  <input
                    {...register('billing_same')}
                    type="checkbox"
                    className="w-5 h-5 text-[#00adef] rounded"
                  />
                  <span className="font-medium text-gray-900">
                    Fakturační údaje jsou stejné jako doručovací
                  </span>
                </label>

                {!billingSame && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jméno / Firma
                      </label>
                      <input
                        {...register('billing_name')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresa
                      </label>
                      <input
                        {...register('billing_address')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Město
                      </label>
                      <input
                        {...register('billing_city')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PSČ
                      </label>
                      <input
                        {...register('billing_zip')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IČO
                      </label>
                      <input
                        {...register('billing_ico')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DIČ
                      </label>
                      <input
                        {...register('billing_dic')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Způsob platby</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[#00adef] transition">
                    <input
                      {...register('payment_method')}
                      type="radio"
                      value="bank_transfer"
                      className="w-5 h-5 text-[#00adef]"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Bankovní převod</p>
                      <p className="text-sm text-gray-500">Platba předem na účet</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[#00adef] transition">
                    <input
                      {...register('payment_method')}
                      type="radio"
                      value="cod"
                      className="w-5 h-5 text-[#00adef]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Dobírka</p>
                      <p className="text-sm text-gray-500">Platba při převzetí</p>
                    </div>
                    <span className="text-sm text-gray-500">+{codFee} Kč</span>
                  </label>
                </div>
              </div>

              {/* Note */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Poznámka k objednávce</h2>
                <textarea
                  {...register('note')}
                  rows={3}
                  placeholder="Máte nějaké speciální požadavky?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Vaše objednávka</h2>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl text-gray-300">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">{item.quantity}×</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4 mb-6">
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
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Celkem</span>
                    <span>{total.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00adef] text-white py-4 rounded-lg font-semibold hover:bg-[#0095cc] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  Dokončit objednávku
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
