import { Package } from 'lucide-react'
import Link from 'next/link'

export default function BazarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bazar</h1>

      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Bazar se připravuje</h2>
        <p className="text-gray-500 mb-4">
          Brzy zde najdete použité díly za výhodné ceny.
        </p>
        <Link
          href="/produkty"
          className="inline-block bg-[#00adef] text-white px-6 py-3 rounded-lg hover:bg-[#0095cc] transition"
        >
          Zobrazit nové produkty
        </Link>
      </div>
    </div>
  )
}
