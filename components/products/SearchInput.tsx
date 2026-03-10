'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { trackSearch } from '@/components/seo/MetaPixel'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  image_url: string | null
  category_name: string | null
}

export function SearchInput() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 400)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const { data, error } = await supabase.rpc('search_products', {
          search_query: debouncedQuery
        })

        if (error) throw error
        setResults(data || [])
        trackSearch(debouncedQuery)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchProducts()
  }, [debouncedQuery, supabase])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/produkty?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Hledejte díly, číslo dílu, model..."
            className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:border-[#00adef] focus:outline-none transition"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00adef] text-white px-4 py-2 rounded-md hover:bg-[#0095cc] transition flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hledat'}
          </button>
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/produkty/${product.slug}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-2xl text-gray-400">📦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#00adef]">{product.category_name || 'Bez kategorie'}</p>
                <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{product.price.toLocaleString('cs-CZ')} Kč</span>
                  {product.original_price && (
                    <span className="text-gray-400 line-through text-sm">
                      {product.original_price.toLocaleString('cs-CZ')} Kč
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
          <Link
            href={`/produkty?q=${encodeURIComponent(query)}`}
            onClick={() => setIsOpen(false)}
            className="block p-4 text-center text-[#00adef] hover:bg-gray-50 font-medium"
          >
            Zobrazit všechny výsledky →
          </Link>
        </div>
      )}

      {isOpen && query.length >= 2 && !isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-8 text-center">
          <p className="text-gray-500">Žádné výsledky pro "{query}"</p>
        </div>
      )}
    </div>
  )
}
