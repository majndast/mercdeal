'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronRight } from 'lucide-react'

interface MercedesClass {
  id: string
  name: string
  slug: string
  sort_order: number
}

interface Generation {
  id: string
  class_id: string
  name: string
  slug: string
  year_from: number | null
  year_to: number | null
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<MercedesClass[]>([])
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedClass, setExpandedClass] = useState<string | null>(null)

  // Class form
  const [editingClass, setEditingClass] = useState<MercedesClass | null>(null)
  const [isNewClass, setIsNewClass] = useState(false)
  const [classForm, setClassForm] = useState({ name: '', slug: '' })
  const [savingClass, setSavingClass] = useState(false)

  // Generation form
  const [editingGen, setEditingGen] = useState<Generation | null>(null)
  const [isNewGen, setIsNewGen] = useState(false)
  const [genClassId, setGenClassId] = useState<string | null>(null)
  const [genForm, setGenForm] = useState({ name: '', slug: '', year_from: '', year_to: '' })
  const [savingGen, setSavingGen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [classesRes, gensRes] = await Promise.all([
        supabase.from('mercedes_classes').select('*').order('sort_order'),
        supabase.from('mercedes_generations').select('*').order('year_from', { ascending: false })
      ])

      setClasses(classesRes.data || [])
      setGenerations(gensRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  // Class handlers
  const handleNewClass = () => {
    setEditingClass(null)
    setIsNewClass(true)
    setClassForm({ name: '', slug: '' })
  }

  const handleEditClass = (cls: MercedesClass) => {
    setEditingClass(cls)
    setIsNewClass(false)
    setClassForm({ name: cls.name, slug: cls.slug })
  }

  const handleSaveClass = async () => {
    setSavingClass(true)
    const data = {
      name: classForm.name,
      slug: classForm.slug || generateSlug(classForm.name),
      sort_order: isNewClass ? classes.length + 1 : editingClass?.sort_order
    }

    try {
      if (isNewClass) {
        const { error } = await supabase.from('mercedes_classes').insert(data)
        if (error) throw error
      } else if (editingClass) {
        const { error } = await supabase.from('mercedes_classes').update(data).eq('id', editingClass.id)
        if (error) throw error
      }

      setEditingClass(null)
      setIsNewClass(false)
      fetchData()
    } catch (error: any) {
      console.error('Error saving class:', error)
      alert('Chyba při ukládání: ' + (error.message || 'Neznámá chyba'))
    } finally {
      setSavingClass(false)
    }
  }

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Opravdu smazat třídu? Smaže se i všechny její generace!')) return
    await supabase.from('mercedes_classes').delete().eq('id', id)
    fetchData()
  }

  // Generation handlers
  const handleNewGen = (classId: string) => {
    setEditingGen(null)
    setIsNewGen(true)
    setGenClassId(classId)
    setGenForm({ name: '', slug: '', year_from: '', year_to: '' })
  }

  const handleEditGen = (gen: Generation) => {
    setEditingGen(gen)
    setIsNewGen(false)
    setGenClassId(gen.class_id)
    setGenForm({
      name: gen.name,
      slug: gen.slug,
      year_from: gen.year_from?.toString() || '',
      year_to: gen.year_to?.toString() || ''
    })
  }

  const handleSaveGen = async () => {
    setSavingGen(true)
    const data = {
      class_id: genClassId,
      name: genForm.name,
      slug: genForm.slug || generateSlug(genForm.name),
      year_from: genForm.year_from ? parseInt(genForm.year_from) : null,
      year_to: genForm.year_to ? parseInt(genForm.year_to) : null
    }

    try {
      if (isNewGen) {
        const { error } = await supabase.from('mercedes_generations').insert(data)
        if (error) throw error
      } else if (editingGen) {
        const { error } = await supabase.from('mercedes_generations').update(data).eq('id', editingGen.id)
        if (error) throw error
      }

      setEditingGen(null)
      setIsNewGen(false)
      setGenClassId(null)
      fetchData()
    } catch (error: any) {
      console.error('Error saving generation:', error)
      alert('Chyba při ukládání: ' + (error.message || 'Neznámá chyba'))
    } finally {
      setSavingGen(false)
    }
  }

  const handleDeleteGen = async (id: string) => {
    if (!confirm('Opravdu smazat generaci?')) return
    await supabase.from('mercedes_generations').delete().eq('id', id)
    fetchData()
  }

  const getGenerationsForClass = (classId: string) => {
    return generations.filter(g => g.class_id === classId)
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Třídy a generace</h1>
          <p className="text-gray-500 mt-1">Spravujte Mercedes třídy a jejich generace pro vyhledávání</p>
        </div>
        <button
          onClick={handleNewClass}
          className="flex items-center gap-2 bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition"
        >
          <Plus className="w-5 h-5" />
          Nová třída
        </button>
      </div>

      {/* New/Edit Class Form */}
      {(isNewClass || editingClass) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">{isNewClass ? 'Nová třída' : 'Upravit třídu'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Název (např. C-Třída)"
              value={classForm.name}
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value, slug: generateSlug(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
            />
            <input
              type="text"
              placeholder="Slug (např. c-trida)"
              value={classForm.slug}
              onChange={(e) => setClassForm({ ...classForm, slug: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveClass}
              disabled={savingClass || !classForm.name}
              className="bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition disabled:opacity-50"
            >
              {savingClass ? 'Ukládám...' : 'Uložit'}
            </button>
            <button
              onClick={() => { setEditingClass(null); setIsNewClass(false) }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* New/Edit Generation Form */}
      {(isNewGen || editingGen) && genClassId && (
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 mb-6 border border-blue-200">
          <h2 className="text-lg font-bold mb-4">
            {isNewGen ? 'Nová generace' : 'Upravit generaci'}
            <span className="text-[#00adef] ml-2">
              ({classes.find(c => c.id === genClassId)?.name})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Název (např. W205)"
              value={genForm.name}
              onChange={(e) => setGenForm({ ...genForm, name: e.target.value, slug: generateSlug(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
            />
            <input
              type="text"
              placeholder="Slug"
              value={genForm.slug}
              onChange={(e) => setGenForm({ ...genForm, slug: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
            />
            <input
              type="number"
              placeholder="Rok od"
              value={genForm.year_from}
              onChange={(e) => setGenForm({ ...genForm, year_from: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
            />
            <input
              type="number"
              placeholder="Rok do (prázdné = současnost)"
              value={genForm.year_to}
              onChange={(e) => setGenForm({ ...genForm, year_to: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveGen}
              disabled={savingGen || !genForm.name}
              className="bg-[#00adef] text-white px-4 py-2 rounded-lg hover:bg-[#0095cc] transition disabled:opacity-50"
            >
              {savingGen ? 'Ukládám...' : 'Uložit'}
            </button>
            <button
              onClick={() => { setEditingGen(null); setIsNewGen(false); setGenClassId(null) }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Classes List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {classes.map((cls) => {
          const classGens = getGenerationsForClass(cls.id)
          const isExpanded = expandedClass === cls.id

          return (
            <div key={cls.id} className="border-b border-gray-200 last:border-b-0">
              {/* Class Row */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition">
                <button
                  onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-bold text-gray-900">{cls.name}</span>
                  <span className="text-gray-400 text-sm">{cls.slug}</span>
                  <span className="bg-[#00adef] text-white text-xs px-2 py-0.5 rounded-full">
                    {classGens.length} generací
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNewGen(cls.id)}
                    className="text-[#00adef] hover:text-[#0095cc] text-sm font-medium"
                  >
                    + Generace
                  </button>
                  <button onClick={() => handleEditClass(cls)} className="text-blue-600 hover:text-blue-800 p-2">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteClass(cls.id)} className="text-red-600 hover:text-red-800 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Generations */}
              {isExpanded && (
                <div className="bg-white">
                  {classGens.length === 0 ? (
                    <div className="px-12 py-4 text-gray-400 text-sm">
                      Žádné generace. <button onClick={() => handleNewGen(cls.id)} className="text-[#00adef]">Přidat první generaci</button>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-12 py-2 text-left">Název</th>
                          <th className="px-4 py-2 text-left">Slug</th>
                          <th className="px-4 py-2 text-left">Roky výroby</th>
                          <th className="px-4 py-2 text-right">Akce</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classGens.map((gen) => (
                          <tr key={gen.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-12 py-3 font-medium">{gen.name}</td>
                            <td className="px-4 py-3 text-gray-500">{gen.slug}</td>
                            <td className="px-4 py-3 text-gray-500">
                              {gen.year_from && gen.year_to
                                ? `${gen.year_from} - ${gen.year_to}`
                                : gen.year_from
                                ? `${gen.year_from} - současnost`
                                : '-'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => handleEditGen(gen)} className="text-blue-600 hover:text-blue-800 mr-2">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteGen(gen.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
