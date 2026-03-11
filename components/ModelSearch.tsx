'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

// Mercedes classes with their generations
const mercedesModels = [
  {
    class: 'A-Třída',
    slug: 'a-trida',
    generations: [
      { name: 'W177', years: '2018-', slug: 'w177' },
      { name: 'W176', years: '2012-2018', slug: 'w176' },
    ]
  },
  {
    class: 'B-Třída',
    slug: 'b-trida',
    generations: [
      { name: 'W247', years: '2018-', slug: 'w247' },
      { name: 'W246', years: '2011-2018', slug: 'w246' },
    ]
  },
  {
    class: 'C-Třída',
    slug: 'c-trida',
    generations: [
      { name: 'W206', years: '2021-', slug: 'w206' },
      { name: 'W205', years: '2014-2021', slug: 'w205' },
      { name: 'W204', years: '2007-2014', slug: 'w204' },
    ]
  },
  {
    class: 'E-Třída',
    slug: 'e-trida',
    generations: [
      { name: 'W214', years: '2023-', slug: 'w214' },
      { name: 'W213', years: '2016-2023', slug: 'w213' },
      { name: 'W212', years: '2009-2016', slug: 'w212' },
    ]
  },
  {
    class: 'S-Třída',
    slug: 's-trida',
    generations: [
      { name: 'W223', years: '2020-', slug: 'w223' },
      { name: 'W222', years: '2013-2020', slug: 'w222' },
    ]
  },
  {
    class: 'CLA',
    slug: 'cla',
    generations: [
      { name: 'C118', years: '2019-', slug: 'c118' },
      { name: 'C117', years: '2013-2019', slug: 'c117' },
    ]
  },
  {
    class: 'CLS',
    slug: 'cls',
    generations: [
      { name: 'C257', years: '2018-', slug: 'c257' },
    ]
  },
  {
    class: 'GLA',
    slug: 'gla',
    generations: [
      { name: 'H247', years: '2020-', slug: 'h247' },
      { name: 'X156', years: '2013-2020', slug: 'x156' },
    ]
  },
  {
    class: 'GLB',
    slug: 'glb',
    generations: [
      { name: 'X247', years: '2019-', slug: 'x247' },
    ]
  },
  {
    class: 'GLC',
    slug: 'glc',
    generations: [
      { name: 'X254', years: '2022-', slug: 'x254' },
      { name: 'X253', years: '2015-2022', slug: 'x253' },
    ]
  },
  {
    class: 'GLE',
    slug: 'gle',
    generations: [
      { name: 'V167', years: '2019-', slug: 'v167' },
      { name: 'W166', years: '2011-2019', slug: 'w166' },
    ]
  },
  {
    class: 'GLS',
    slug: 'gls',
    generations: [
      { name: 'X167', years: '2019-', slug: 'x167' },
    ]
  },
  {
    class: 'G-Třída',
    slug: 'g-trida',
    generations: [
      { name: 'W463', years: '2018-', slug: 'w463' },
    ]
  },
  {
    class: 'AMG GT',
    slug: 'amg-gt',
    generations: [
      { name: 'C190', years: '2014-', slug: 'c190' },
    ]
  },
]

interface ModelSearchProps {
  variant?: 'header' | 'standalone'
}

export default function ModelSearch({ variant = 'standalone' }: ModelSearchProps) {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState('')

  const selectedModel = mercedesModels.find(m => m.slug === selectedClass)
  const generations = selectedModel?.generations || []

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
          {mercedesModels.map((model) => (
            <option key={model.slug} value={model.slug}>
              {model.class}
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
              {gen.name} ({gen.years})
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
          {mercedesModels.map((model) => (
            <option key={model.slug} value={model.slug}>
              {model.class}
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
              {gen.name} ({gen.years})
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
