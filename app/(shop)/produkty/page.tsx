import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilters } from '@/components/products/ProductFilters'

interface Props {
  searchParams: Promise<{
    q?: string
    kategorie?: string
    model?: string
    min?: string
    max?: string
    razeni?: string
  }>
}

async function getProducts(searchParams: Awaited<Props['searchParams']>) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(url),
      product_models(mercedes_models(name, slug))
    `)
    .eq('is_active', true)

  // Search
  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,sku.ilike.%${searchParams.q}%`)
  }

  // Category filter
  if (searchParams.kategorie) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.kategorie)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  // Price filter
  if (searchParams.min) {
    query = query.gte('price', parseFloat(searchParams.min))
  }
  if (searchParams.max) {
    query = query.lte('price', parseFloat(searchParams.max))
  }

  // Sorting
  switch (searchParams.razeni) {
    case 'cena-asc':
      query = query.order('price', { ascending: true })
      break
    case 'cena-desc':
      query = query.order('price', { ascending: false })
      break
    case 'nazev':
      query = query.order('name', { ascending: true })
      break
    case 'nejnovejsi':
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data } = await query

  return data || []
}

async function getFiltersData() {
  const supabase = await createClient()

  const [{ data: categories }, { data: models }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('mercedes_models').select('*').order('name'),
  ])

  return { categories: categories || [], models: models || [] }
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const [products, filtersData] = await Promise.all([
    getProducts(params),
    getFiltersData(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#00adef]">Domů</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Produkty</span>
          {params.q && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Výsledky pro "{params.q}"</span>
            </>
          )}
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="bg-white rounded-xl p-6 animate-pulse h-96" />}>
              <ProductFilters
                categories={filtersData.categories}
                models={filtersData.models}
                currentFilters={params}
              />
            </Suspense>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Nalezeno <strong>{products.length}</strong> produktů
              </p>
              <select
                defaultValue={params.razeni || 'nejnovejsi'}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
              >
                <option value="nejnovejsi">Nejnovější</option>
                <option value="cena-asc">Cena: od nejnižší</option>
                <option value="cena-desc">Cena: od nejvyšší</option>
                <option value="nazev">Název A-Z</option>
              </select>
            </div>

            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  )
}
