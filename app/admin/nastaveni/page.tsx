'use client'

import { useState } from 'react'
import { Save, Store, Mail, Truck } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    storeName: 'MercDeal',
    storeEmail: 'info@mercdeal.cz',
    storePhone: '+420 123 456 789',
    storeAddress: 'Průmyslová 123, 150 00 Praha 5',
    freeShippingFrom: '2000',
    shippingPrice: '129',
    codPrice: '39',
  })

  const handleSave = async () => {
    setSaving(true)
    // V budoucnu uložit do databáze
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    alert('Nastavení uloženo (demo)')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nastavení</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Ukládám...' : 'Uložit změny'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-[#00adef]" />
            <h2 className="text-lg font-bold">Informace o obchodě</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Název obchodu</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresa</label>
              <input
                type="text"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-[#00adef]" />
            <h2 className="text-lg font-bold">Kontakt</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-[#00adef]" />
            <h2 className="text-lg font-bold">Doprava a platba</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doprava zdarma od (Kč)</label>
              <input
                type="number"
                value={settings.freeShippingFrom}
                onChange={(e) => setSettings({ ...settings, freeShippingFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cena dopravy (Kč)</label>
              <input
                type="number"
                value={settings.shippingPrice}
                onChange={(e) => setSettings({ ...settings, shippingPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Příplatek za dobírku (Kč)</label>
              <input
                type="number"
                value={settings.codPrice}
                onChange={(e) => setSettings({ ...settings, codPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
