import { ProductForm } from '../ProductForm'
import { createClient } from '@/lib/supabase/server'

async function getData() {
  const supabase = await createClient()

  const [{ data: categories }, { data: models }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('mercedes_models').select('*').order('name')
  ])

  return { categories: categories || [], models: models || [] }
}

export default async function NewProductPage() {
  const { categories, models } = await getData()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nový produkt</h1>
      <ProductForm categories={categories} models={models} />
    </div>
  )
}
