'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Oblíbené produkty</h1>

      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Zatím nemáte žádné oblíbené produkty.</p>
        <Link
          href="/produkty"
          className="inline-block bg-[#00adef] text-white px-6 py-3 rounded-lg hover:bg-[#0095cc] transition"
        >
          Prohlédnout produkty
        </Link>
      </div>
    </div>
  )
}
