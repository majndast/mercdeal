'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', icon: '' })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setIsNew(false)
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '' })
  }

  const handleNew = () => {
    setEditing(null)
    setIsNew(true)
    setForm({ name: '', slug: '', icon: '' })
  }

  const handleSave = async () => {
    setSaving(true)
    const data = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      icon: form.icon || null,
    }

    if (isNew) {
      await supabase.from('categories').insert(data)
    } else if (editing) {
      await supabase.from('categories').update(data).eq('id', editing.id)
    }

    setEditing(null)
    setIsNew(false)
    setSaving(false)
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat kategorii?')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#00adef]" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kategorie</h1>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition"
        >
          <Plus className="w-5 h-5" />
          Nová kategorie
        </button>
      </div>

      {(isNew || editing) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">{isNew ? 'Nová kategorie' : 'Upravit kategorii'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Název"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Ikona (emoji)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              className="bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition disabled:opacity-50"
            >
              {saving ? 'Ukládám...' : 'Uložit'}
            </button>
            <button
              onClick={() => { setEditing(null); setIsNew(false) }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ikona</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Název</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-2xl">{cat.icon || '📁'}</td>
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
