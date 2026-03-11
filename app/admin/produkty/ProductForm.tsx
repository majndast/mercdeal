'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Upload, X } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(2, 'Název musí mít alespoň 2 znaky'),
  slug: z.string().min(2, 'Slug musí mít alespoň 2 znaky').regex(/^[a-z0-9-]+$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'),
  description: z.string().optional(),
  price: z.number().min(0, 'Cena musí být kladná'),
  original_price: z.number().optional().nullable(),
  sku: z.string().optional(),
  part_number: z.string().optional(),
  condition: z.string().optional().nullable(),
  color: z.string().optional(),
  stock: z.number().min(0, 'Sklad musí být kladný'),
  category_id: z.string().optional().nullable(),
  class_id: z.string().optional().nullable(),
  generation_id: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

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

interface ProductFormProps {
  categories: { id: string; name: string }[]
  product?: any
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>(
    product?.product_images || []
  )
  const [uploading, setUploading] = useState(false)
  const [classes, setClasses] = useState<MercedesClass[]>([])
  const [generations, setGenerations] = useState<Generation[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>(product?.class_id || '')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchClassesAndGenerations()
  }, [])

  const fetchClassesAndGenerations = async () => {
    const [classesRes, gensRes] = await Promise.all([
      supabase.from('mercedes_classes').select('*').order('sort_order'),
      supabase.from('mercedes_generations').select('*').order('year_from', { ascending: false })
    ])
    setClasses(classesRes.data || [])
    setGenerations(gensRes.data || [])
  }

  const filteredGenerations = selectedClassId
    ? generations.filter(g => g.class_id === selectedClassId)
    : []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      price: product?.price || 0,
      original_price: product?.original_price || null,
      sku: product?.sku || '',
      part_number: product?.part_number || '',
      condition: product?.condition || null,
      color: product?.color || '',
      stock: product?.stock || 0,
      category_id: product?.category_id || null,
      class_id: product?.class_id || null,
      generation_id: product?.generation_id || null,
      badge: product?.badge || null,
      is_active: product?.is_active ?? true,
      is_featured: product?.is_featured ?? false,
    },
  })

  const watchClassId = watch('class_id')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (!product) {
      setValue('slug', generateSlug(name))
    }
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return
    setImages([...images, ...Array.from(files)])
  }

  const removeNewImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const removeExistingImage = async (imageId: string) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId))
  }

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
    setValue('class_id', classId || null)
    setValue('generation_id', null)
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true)

      // Create or update product
      const productData = {
        ...data,
        original_price: data.original_price && !isNaN(data.original_price) ? data.original_price : null,
        category_id: data.category_id || null,
        class_id: data.class_id || null,
        generation_id: data.generation_id || null,
        condition: data.condition || null,
        badge: data.badge || null,
      }

      let productId = product?.id

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
        if (error) throw error
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()
        if (error) throw error
        productId = newProduct.id
      }

      // Upload new images
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)

        await supabase.from('product_images').insert({
          product_id: productId,
          url: publicUrl,
          sort_order: existingImages.length + i,
        })
      }

      // Delete removed existing images
      const removedImageIds = product?.product_images
        ?.filter((img: any) => !existingImages.find((ei) => ei.id === img.id))
        .map((img: any) => img.id) || []

      if (removedImageIds.length > 0) {
        await supabase.from('product_images').delete().in('id', removedImageIds)
      }

      router.push('/admin/produkty')
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Chyba při ukládání produktu')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Základní informace</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Název produktu *
                </label>
                <input
                  {...register('name')}
                  onChange={(e) => {
                    register('name').onChange(e)
                    handleNameChange(e)
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL slug *
                </label>
                <input
                  {...register('slug')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popis
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Obrázky</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={image.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.map((file, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#00adef] transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Nahrát</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Class & Generation */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Třída a generace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Třída Mercedes
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                >
                  <option value="">Vyberte třídu</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generace
                </label>
                <select
                  {...register('generation_id')}
                  disabled={!selectedClassId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none disabled:bg-gray-100"
                >
                  <option value="">Vyberte generaci</option>
                  {filteredGenerations.map((gen) => (
                    <option key={gen.id} value={gen.id}>
                      {gen.name} ({gen.year_from}{gen.year_to ? `-${gen.year_to}` : '-'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Part details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Detaily dílu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Číslo dílu
                </label>
                <input
                  {...register('part_number')}
                  placeholder="např. A2059001234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stav
                </label>
                <select
                  {...register('condition')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                >
                  <option value="">Vyberte stav</option>
                  <option value="A+">A+ (jako nový)</option>
                  <option value="A">A (výborný)</option>
                  <option value="B">B (dobrý)</option>
                  <option value="C">C (použitelný)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barva
                </label>
                <input
                  {...register('color')}
                  placeholder="např. Obsidian Black"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Cena a sklad</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena (Kč) *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Původní cena (Kč)
                </label>
                <input
                  {...register('original_price', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  {...register('sku')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skladem (ks)
                </label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Organizace</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie
                </label>
                <select
                  {...register('category_id')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                >
                  <option value="">Bez kategorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Štítek
                </label>
                <select
                  {...register('badge')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
                >
                  <option value="">Žádný</option>
                  <option value="TOP">TOP</option>
                  <option value="NOVINKA">NOVINKA</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="SLEVA">SLEVA</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('is_active')}
                    type="checkbox"
                    className="w-4 h-4 text-[#00adef] rounded"
                  />
                  <span className="text-sm text-gray-700">Aktivní</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('is_featured')}
                    type="checkbox"
                    className="w-4 h-4 text-[#00adef] rounded"
                  />
                  <span className="text-sm text-gray-700">Doporučený</span>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full bg-[#00adef] text-white py-3 rounded-lg font-semibold hover:bg-[#0095cc] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {(isSubmitting || uploading) && <Loader2 className="w-5 h-5 animate-spin" />}
            {product ? 'Uložit změny' : 'Vytvořit produkt'}
          </button>
        </div>
      </div>
    </form>
  )
}
