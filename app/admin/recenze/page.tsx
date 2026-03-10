'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Check, X, Star } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
  profiles: { email: string; full_name: string | null } | null
  products: { name: string } | null
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(email, full_name), products(name)')
      .order('created_at', { ascending: false })
    setReviews((data as any) || [])
    setLoading(false)
  }

  const approveReview = async (id: string) => {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
    fetchReviews()
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Opravdu smazat recenzi?')) return
    await supabase.from('reviews').delete().eq('id', id)
    fetchReviews()
  }

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.is_approved
    if (filter === 'approved') return r.is_approved
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#00adef]" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recenze</h1>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filter === f
                  ? 'bg-[#00adef] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Všechny' : f === 'pending' ? 'Čekající' : 'Schválené'}
            </button>
          ))}
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Žádné recenze
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        review.is_approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {review.is_approved ? 'Schváleno' : 'Čeká na schválení'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    <span>{review.profiles?.full_name || review.profiles?.email || 'Anonym'}</span>
                    <span className="mx-2">•</span>
                    <span>{review.products?.name || 'Neznámý produkt'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(review.created_at).toLocaleDateString('cs-CZ')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!review.is_approved && (
                    <button
                      onClick={() => approveReview(review.id)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                      title="Schválit"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    title="Smazat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
