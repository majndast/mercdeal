'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Plus, MapPin, Trash2, Loader2, Check } from 'lucide-react'

interface Address {
  id: string
  name: string
  street: string
  city: string
  zip: string
  phone: string | null
  is_default: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', street: '', city: '', zip: '', phone: '' })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/prihlaseni?redirect=/ucet/adresy')
      return
    }

    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    setAddresses(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!form.name || !form.street || !form.city || !form.zip) return

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('addresses').insert({
      user_id: user.id,
      name: form.name,
      street: form.street,
      city: form.city,
      zip: form.zip,
      phone: form.phone || null,
      is_default: addresses.length === 0,
    })

    setForm({ name: '', street: '', city: '', zip: '', phone: '' })
    setShowForm(false)
    setSaving(false)
    fetchAddresses()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat adresu?')) return
    await supabase.from('addresses').delete().eq('id', id)
    fetchAddresses()
  }

  const handleSetDefault = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Remove default from all
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)

    // Set new default
    await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)

    fetchAddresses()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00adef]" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/ucet" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#00adef] mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zpět na účet
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Uložené adresy</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition"
        >
          <Plus className="w-5 h-5" />
          Přidat adresu
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Nová adresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Název (např. Domů, Práce)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Ulice a číslo"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Město"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="PSČ"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
            />
            <input
              type="tel"
              placeholder="Telefon (volitelné)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none md:col-span-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.street || !form.city || !form.zip}
              className="bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Uložit
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Zatím nemáte žádné uložené adresy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl shadow-sm p-6 relative">
              {address.is_default && (
                <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Výchozí
                </span>
              )}
              <h3 className="font-bold mb-2">{address.name}</h3>
              <p className="text-gray-600">{address.street}</p>
              <p className="text-gray-600">{address.zip} {address.city}</p>
              {address.phone && <p className="text-gray-500 text-sm mt-1">{address.phone}</p>}
              <div className="flex gap-3 mt-4">
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-[#00adef] hover:underline text-sm"
                  >
                    Nastavit jako výchozí
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Smazat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
