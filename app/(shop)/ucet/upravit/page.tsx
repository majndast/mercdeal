'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/prihlaseni?redirect=/ucet/upravit')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
        })
        .eq('id', user.id)
    }

    setSaving(false)
    router.push('/ucet')
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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upravit profil</h1>

      <div className="max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Celé jméno
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                placeholder="Jan Novák"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                placeholder="+420 123 456 789"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#00adef] text-white py-3 rounded-lg font-semibold hover:bg-[#0095cc] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin" />}
              Uložit změny
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
