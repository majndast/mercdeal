'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { trackAddToCart } from '@/components/seo/MetaPixel'

interface Product {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })

    trackAddToCart(product.id, product.price * quantity)

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1)
  }

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full py-4 bg-gray-200 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
      >
        Vyprodáno
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Množství:</span>
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-[#00adef] text-white hover:bg-[#0095cc]'
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Přidáno do košíku
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Přidat do košíku
          </>
        )}
      </button>
    </div>
  )
}
