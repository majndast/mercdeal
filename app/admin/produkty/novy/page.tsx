import { ProductForm } from '../ProductForm'
import { createClient } from '@/lib/supabase/server'

async function getData() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  return { categories: categories || [] }
}

export default async function NewProductPage() {
  const { categories } = await getData()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nový produkt</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
