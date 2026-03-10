"use client";

import { useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  models: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "AMG Style přední nárazník pro C-Třídu W205",
    category: "Exteriér",
    price: 12990,
    originalPrice: 15990,
    image: "🚗",
    badge: "TOP",
    rating: 4.8,
    reviews: 124,
    models: ["C-Třída W205"],
  },
  {
    id: 2,
    name: "LED ambientní osvětlení 64 barev",
    category: "Interiér",
    price: 4990,
    image: "💡",
    badge: "NOVINKA",
    rating: 4.9,
    reviews: 89,
    models: ["C-Třída", "E-Třída", "S-Třída"],
  },
  {
    id: 3,
    name: "Sportovní výfukové koncovky AMG",
    category: "Motor & Výfuk",
    price: 3490,
    originalPrice: 4290,
    image: "⚙️",
    rating: 4.7,
    reviews: 56,
    models: ["Univerzální"],
  },
  {
    id: 4,
    name: "Karbonové zrcátka pro E-Třídu W213",
    category: "Exteriér",
    price: 8990,
    image: "🔲",
    badge: "TOP",
    rating: 4.9,
    reviews: 42,
    models: ["E-Třída W213"],
  },
  {
    id: 5,
    name: "Sportovní volant AMG s perforovanou kůží",
    category: "Interiér",
    price: 18990,
    originalPrice: 22990,
    image: "🎯",
    rating: 5.0,
    reviews: 78,
    models: ["Univerzální"],
  },
  {
    id: 6,
    name: "H&R sportovní pružiny -30mm",
    category: "Podvozek",
    price: 6990,
    image: "🔧",
    rating: 4.6,
    reviews: 34,
    models: ["C-Třída W205", "W206"],
  },
  {
    id: 7,
    name: "MULTIBEAM LED světlomety upgrade",
    category: "Osvětlení",
    price: 45990,
    image: "✨",
    badge: "PREMIUM",
    rating: 4.9,
    reviews: 23,
    models: ["E-Třída W213"],
  },
  {
    id: 8,
    name: "Klíčenka Mercedes-AMG originál",
    category: "Dárky",
    price: 990,
    image: "🔑",
    rating: 4.8,
    reviews: 156,
    models: ["Univerzální"],
  },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", name: "Všechny" },
    { id: "top", name: "TOP produkty" },
    { id: "new", name: "Novinky" },
    { id: "sale", name: "Ve slevě" },
  ];

  const filteredProducts = products.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "top") return product.badge === "TOP";
    if (activeTab === "new") return product.badge === "NOVINKA";
    if (activeTab === "sale") return product.originalPrice;
    return true;
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Doporučené produkty</h2>
            <p className="text-gray-600">Nejprodávanější díly a novinky</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#0d0d0d] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/produkt/${product.id}`}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative bg-gray-50 h-48 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform">
                  {product.image}
                </span>
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    product.badge === "TOP" ? "bg-[#00adef]" :
                    product.badge === "NOVINKA" ? "bg-green-500" :
                    product.badge === "PREMIUM" ? "bg-purple-500" : "bg-gray-500"
                  }`}>
                    {product.badge}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-[#00adef] hover:text-white">
                  ♡
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-[#00adef] mb-1">{product.category}</p>
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[#00adef] transition">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400 text-sm">
                    {"★".repeat(Math.floor(product.rating))}
                    {"☆".repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-gray-400 text-sm">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{product.price.toLocaleString()} Kč</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      {product.originalPrice.toLocaleString()} Kč
                    </span>
                  )}
                </div>

                {/* Models */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.models.slice(0, 2).map((model) => (
                    <span key={model} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 bg-[#0d0d0d] text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            Zobrazit všechny produkty
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
