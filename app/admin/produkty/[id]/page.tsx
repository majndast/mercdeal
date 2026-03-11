import { ProductForm } from '../ProductForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

async function getData(id: string) {
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', id)
      .single(),
    supabase.from('categories').select('*').order('name')
  ])

  return { product, categories: categories || [] }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { product, categories } = await getData(id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/produkty"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Upravit produkt</h1>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  )
}
