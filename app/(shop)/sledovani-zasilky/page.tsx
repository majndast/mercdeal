'use client'

import { useState } from 'react'
import { Package, Search, Truck, CheckCircle } from 'lucide-react'

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [tracking, setTracking] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo tracking
    if (orderNumber) {
      setTracking({
        status: 'in_transit',
        steps: [
          { title: 'Objednávka přijata', date: '10.3.2026 14:30', done: true },
          { title: 'Odesláno ze skladu', date: '10.3.2026 16:00', done: true },
          { title: 'Na cestě k vám', date: '11.3.2026 08:00', done: true },
          { title: 'Doručeno', date: '', done: false },
        ],
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sledování zásilky</h1>

      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Číslo objednávky (např. ORD-123456)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-[#00adef] text-white px-6 py-3 rounded-lg hover:bg-[#0095cc] transition flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Sledovat
            </button>
          </form>
        </div>

        {tracking && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <Package className="w-8 h-8 text-[#00adef]" />
              <div>
                <p className="font-bold">Objednávka #{orderNumber}</p>
                <p className="text-sm text-gray-500">Na cestě k vám</p>
              </div>
            </div>

            <div className="space-y-4">
              {tracking.steps.map((step: any, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Truck className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
