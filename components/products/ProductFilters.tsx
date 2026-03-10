'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Model {
  id: string
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  models: Model[]
  currentFilters: {
    kategorie?: string
    model?: string
    min?: string
    max?: string
  }
}

export function ProductFilters({ categories, models, currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceMin, setPriceMin] = useState(currentFilters.min || '')
  const [priceMax, setPriceMax] = useState(currentFilters.max || '')

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/produkty?${params.toString()}`)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (priceMin) {
      params.set('min', priceMin)
    } else {
      params.delete('min')
    }
    if (priceMax) {
      params.set('max', priceMax)
    } else {
      params.delete('max')
    }
    router.push(`/produkty?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/produkty')
  }

  const hasActiveFilters = currentFilters.kategorie || currentFilters.model || currentFilters.min || currentFilters.max

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filtry</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#00adef] hover:underline"
          >
            Vymazat vše
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Kategorie</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('kategorie', category.slug === currentFilters.kategorie ? null : category.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                category.slug === currentFilters.kategorie
                  ? 'bg-[#00adef] text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Cena</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Od"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
          />
          <input
            type="number"
            placeholder="Do"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={applyPriceFilter}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Aplikovat
        </button>
      </div>

      {/* Models */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Model Mercedes</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => updateFilter('model', model.slug === currentFilters.model ? null : model.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                model.slug === currentFilters.model
                  ? 'bg-[#00adef] text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
