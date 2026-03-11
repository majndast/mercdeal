'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MercedesClass {
  id: string
  name: string
  slug: string
}

interface Generation {
  id: string
  class_id: string
  name: string
  slug: string
  year_from: number | null
  year_to: number | null
}

interface ModelSearchProps {
  variant?: 'header' | 'standalone'
}

export default function ModelSearch({ variant = 'standalone' }: ModelSearchProps) {
  const router = useRouter()
  const supabase = createClient()

  const [classes, setClasses] = useState<MercedesClass[]>([])
  const [allGenerations, setAllGenerations] = useState<Generation[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [classesRes, gensRes] = await Promise.all([
      supabase.from('mercedes_classes').select('*').order('sort_order'),
      supabase.from('mercedes_generations').select('*').order('year_from', { ascending: false })
    ])
    setClasses(classesRes.data || [])
    setAllGenerations(gensRes.data || [])
  }

  const selectedClassObj = classes.find(c => c.slug === selectedClass)
  const generations = selectedClassObj
    ? allGenerations.filter(g => g.class_id === selectedClassObj.id)
    : []

  const formatYears = (gen: Generation) => {
    if (gen.year_from && gen.year_to) return `${gen.year_from}-${gen.year_to}`
    if (gen.year_from) return `${gen.year_from}-`
    return ''
  }

  const handleClassChange = (classSlug: string) => {
    setSelectedClass(classSlug)
    setSelectedGeneration('')
  }

  const handleSearch = () => {
    if (selectedGeneration) {
      router.push(`/model/${selectedGeneration}`)
    } else if (selectedClass) {
      router.push(`/model/${selectedClass}`)
    }
  }

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
        <select
          value={selectedClass}
          onChange={(e) => handleClassChange(e.target.value)}
          className="px-3 py-2 bg-transparent text-sm focus:outline-none cursor-pointer"
        >
          <option value="">Třída</option>
          {classes.map((cls) => (
            <option key={cls.slug} value={cls.slug}>
              {cls.name}
            </option>
          ))}
        </select>
        <select
          value={selectedGeneration}
          onChange={(e) => setSelectedGeneration(e.target.value)}
          disabled={!selectedClass}
          className="px-3 py-2 bg-transparent text-sm focus:outline-none cursor-pointer disabled:opacity-50"
        >
          <option value="">Generace</option>
          {generations.map((gen) => (
            <option key={gen.slug} value={gen.slug}>
              {gen.name} ({formatYears(gen)})
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          disabled={!selectedClass}
          className="p-2 bg-[#00adef] text-white rounded-lg hover:bg-[#0095cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="font-bold text-lg mb-4 text-gray-900">Vyhledat podle modelu</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedClass}
          onChange={(e) => handleClassChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef] cursor-pointer"
        >
          <option value="">Vyberte třídu</option>
          {classes.map((cls) => (
            <option key={cls.slug} value={cls.slug}>
              {cls.name}
            </option>
          ))}
        </select>
        <select
          value={selectedGeneration}
          onChange={(e) => setSelectedGeneration(e.target.value)}
          disabled={!selectedClass}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef] cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Vyberte generaci</option>
          {generations.map((gen) => (
            <option key={gen.slug} value={gen.slug}>
              {gen.name} ({formatYears(gen)})
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          disabled={!selectedClass}
          className="px-6 py-3 bg-[#00adef] text-white font-semibold rounded-lg hover:bg-[#0095cc] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          <span>Hledat</span>
        </button>
      </div>
    </div>
  )
}
