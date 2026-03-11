'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, SlidersHorizontal, X } from 'lucide-react'

// Subcategories for each main category (will be loaded from DB in future)
const subcategoriesMap: Record<string, { name: string; slug: string }[]> = {
  exterior: [
    { name: 'Světla', slug: 'svetla' },
    { name: 'Kliky', slug: 'kliky' },
    { name: 'Masky', slug: 'masky' },
    { name: 'Zrcátka', slug: 'zrcatka' },
    { name: 'Karosářské díly', slug: 'karosarske-dily' },
  ],
  interior: [
    { name: 'Volanty', slug: 'volanty' },
    { name: 'Sedadla', slug: 'sedadla' },
    { name: 'Obložení', slug: 'oblozeni' },
    { name: 'Pedály', slug: 'pedaly' },
  ],
  osvetleni: [
    { name: 'Přední světla', slug: 'predni-svetla' },
    { name: 'Zadní světla', slug: 'zadni-svetla' },
    { name: 'LED moduly', slug: 'led-moduly' },
    { name: 'Ambientní osvětlení', slug: 'ambientni-osvetleni' },
  ],
  elektroinstalace: [
    { name: 'Kabeláž', slug: 'kabelaz' },
    { name: 'Senzory', slug: 'senzory' },
    { name: 'Řídící jednotky', slug: 'ridici-jednotky' },
    { name: 'Displeje', slug: 'displeje' },
  ],
  podvozek: [
    { name: 'Brzdy', slug: 'brzdy' },
    { name: 'Pružiny', slug: 'pruziny' },
    { name: 'Tlumiče', slug: 'tlumice' },
    { name: 'Ramena', slug: 'ramena' },
  ],
}

const categoryNames: Record<string, string> = {
  exterior: 'Exteriér',
  interior: 'Interiér',
  osvetleni: 'Osvětlení',
  elektroinstalace: 'Elektroinstalace',
  podvozek: 'Podvozek',
}

interface Category {
  id: string
  name: string
  slug: string
}

// Mercedes classes and generations
const mercedesClasses = [
  { name: 'A-Třída', slug: 'a-trida' },
  { name: 'C-Třída', slug: 'c-trida' },
  { name: 'E-Třída', slug: 'e-trida' },
  { name: 'S-Třída', slug: 's-trida' },
  { name: 'GLA', slug: 'gla' },
  { name: 'GLC', slug: 'glc' },
  { name: 'GLE', slug: 'gle' },
]

const sortOptions = [
  { name: 'Nejprodávanější', value: 'bestselling' },
  { name: 'Nejlevnější', value: 'price_asc' },
  { name: 'Nejdražší', value: 'price_desc' },
  { name: 'Abecedně', value: 'name' },
]

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  stock: number
  badge: string | null
  product_images: { url: string }[]
}

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [priceFrom, setPriceFrom] = useState(searchParams.get('priceFrom') || '')
  const [priceTo, setPriceTo] = useState(searchParams.get('priceTo') || '')
  const [availability, setAvailability] = useState(searchParams.get('availability') || '')
  const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'bestselling')
  const [activeSubcategory, setActiveSubcategory] = useState(searchParams.get('sub') || '')

  const supabase = createClient()
  const subcategories = subcategoriesMap[slug] || []
  const categoryName = category?.name || categoryNames[slug] || slug

  useEffect(() => {
    fetchCategoryAndProducts()
  }, [slug, sortBy, activeSubcategory])

  const fetchCategoryAndProducts = async () => {
    setLoading(true)

    // First, get the category by slug
    const { data: categoryData } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    setCategory(categoryData)

    // Then fetch products for this category
    let query = supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_active', true)

    // Filter by category if found
    if (categoryData?.id) {
      query = query.eq('category_id', categoryData.id)
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (priceFrom) params.set('priceFrom', priceFrom)
    if (priceTo) params.set('priceTo', priceTo)
    if (availability) params.set('availability', availability)
    if (selectedClass) params.set('class', selectedClass)
    if (sortBy) params.set('sort', sortBy)
    if (activeSubcategory) params.set('sub', activeSubcategory)

    router.push(`/kategorie/${slug}?${params.toString()}`)
    setShowFilters(false)
    fetchCategoryAndProducts()
  }

  const clearFilters = () => {
    setPriceFrom('')
    setPriceTo('')
    setAvailability('')
    setSelectedClass('')
    setActiveSubcategory('')
    router.push(`/kategorie/${slug}`)
  }

  // Filter products by price and availability
  const filteredProducts = products.filter(product => {
    if (priceFrom && product.price < parseInt(priceFrom)) return false
    if (priceTo && product.price > parseInt(priceTo)) return false
    if (availability === 'instock' && product.stock <= 0) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-gray-600 mt-1">{filteredProducts.length} produktů</p>
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubcategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeSubcategory === ''
                    ? 'bg-[#00adef] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vše
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSubcategory(sub.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeSubcategory === sub.slug
                      ? 'bg-[#00adef] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Filters and Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filtry
            {(priceFrom || priceTo || availability || selectedClass) && (
              <span className="bg-[#00adef] text-white text-xs px-2 py-0.5 rounded-full">!</span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Řazení:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00adef]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Filtry</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cena od</label>
                <input
                  type="number"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  placeholder="0 Kč"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cena do</label>
                <input
                  type="number"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  placeholder="100 000 Kč"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dostupnost</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
                >
                  <option value="">Vše</option>
                  <option value="instock">Skladem</option>
                  <option value="all">Včetně nedostupných</option>
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Třída</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00adef]"
                >
                  <option value="">Všechny třídy</option>
                  {mercedesClasses.map((cls) => (
                    <option key={cls.slug} value={cls.slug}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-[#00adef] text-white rounded-lg hover:bg-[#0095cc] transition"
              >
                Použít filtry
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Zrušit filtry
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Žádné produkty nenalezeny</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[#00adef] hover:underline"
            >
              Zrušit filtry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/produkty/${product.slug}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.product_images?.[0]?.url ? (
                    <img
                      src={product.product_images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                  )}
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {product.badge}
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium">
                        Není skladem
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-[#00adef] transition">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#00adef]">
                      {product.price.toLocaleString('cs-CZ')} Kč
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.original_price.toLocaleString('cs-CZ')} Kč
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
