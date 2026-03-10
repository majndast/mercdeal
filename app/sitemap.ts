import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mercdeal.cz'
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/produkty`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/o-nas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  const productPages: MetadataRoute.Sitemap = (products || []).map((product: any) => ({
    url: `${baseUrl}/produkty/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, created_at')

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((category: any) => ({
    url: `${baseUrl}/kategorie/${category.slug}`,
    lastModified: new Date(category.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Mercedes models
  const { data: models } = await supabase
    .from('mercedes_models')
    .select('slug, created_at')

  const modelPages: MetadataRoute.Sitemap = (models || []).map((model: any) => ({
    url: `${baseUrl}/model/${model.slug}`,
    lastModified: new Date(model.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...modelPages]
}
