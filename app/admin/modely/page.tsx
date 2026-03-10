'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

interface Model {
  id: string
  name: string
  slug: string
  year_from: number | null
  year_to: number | null
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Model | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', year_from: '', year_to: '' })
  const supabase = createClient()

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    const { data } = await supabase.from('mercedes_models').select('*').order('name')
    setModels(data || [])
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

  const handleEdit = (model: Model) => {
    setEditing(model)
    setIsNew(false)
    setForm({
      name: model.name,
      slug: model.slug,
      year_from: model.year_from?.toString() || '',
      year_to: model.year_to?.toString() || '',
    })
  }

  const handleNew = () => {
    setEditing(null)
    setIsNew(true)
    setForm({ name: '', slug: '', year_from: '', year_to: '' })
  }

  const handleSave = async () => {
    setSaving(true)
    const data = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      year_from: form.year_from ? parseInt(form.year_from) : null,
      year_to: form.year_to ? parseInt(form.year_to) : null,
    }

    if (isNew) {
      await supabase.from('mercedes_models').insert(data)
    } else if (editing) {
      await supabase.from('mercedes_models').update(data).eq('id', editing.id)
    }

    setEditing(null)
    setIsNew(false)
    setSaving(false)
    fetchModels()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu smazat model?')) return
    await supabase.from('mercedes_models').delete().eq('id', id)
    fetchModels()
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
        <h1 className="text-3xl font-bold text-gray-900">Modely Mercedes</h1>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition"
        >
          <Plus className="w-5 h-5" />
          Nový model
        </button>
      </div>

      {(isNew || editing) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">{isNew ? 'Nový model' : 'Upravit model'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Název (např. C-Třída W205)"
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
              type="number"
              placeholder="Rok od"
              value={form.year_from}
              onChange={(e) => setForm({ ...form, year_from: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Rok do"
              value={form.year_to}
              onChange={(e) => setForm({ ...form, year_to: e.target.value })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Název</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roky výroby</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{model.name}</td>
                <td className="px-6 py-4 text-gray-500">{model.slug}</td>
                <td className="px-6 py-4 text-gray-500">
                  {model.year_from && model.year_to
                    ? `${model.year_from} - ${model.year_to}`
                    : model.year_from
                    ? `od ${model.year_from}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(model)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(model.id)} className="text-red-600 hover:text-red-800">
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
