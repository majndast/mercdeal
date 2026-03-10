"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Exteriér", href: "/kategorie/exterior", icon: "🚗" },
  { name: "Interiér", href: "/kategorie/interior", icon: "🪑" },
  { name: "Osvětlení", href: "/kategorie/osvetleni", icon: "💡" },
  { name: "Motor & Výfuk", href: "/kategorie/motor", icon: "⚙️" },
  { name: "Podvozek & Brzdy", href: "/kategorie/podvozek", icon: "🔧" },
  { name: "Dárky & Merch", href: "/kategorie/darky", icon: "🎁" },
  { name: "Bazar", href: "/bazar", icon: "♻️" },
];

const mercedesModels = [
  "A-Třída", "B-Třída", "C-Třída", "E-Třída", "S-Třída",
  "GLA", "GLB", "GLC", "GLE", "GLS", "G-Třída",
  "CLA", "CLS", "AMG GT", "EQC", "EQS"
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-[#0d0d0d] text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span>📞 +420 123 456 789</span>
            <span>✉️ info@mercdeal.cz</span>
          </div>
          <div className="hidden md:flex gap-4">
            <Link href="/o-nas" className="hover:text-[#00adef] transition">O nás</Link>
            <Link href="/kontakt" className="hover:text-[#00adef] transition">Kontakt</Link>
            <Link href="/sledovani-zasilky" className="hover:text-[#00adef] transition">Sledování zásilky</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-[#0d0d0d] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">★</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0d0d0d]">Merc</span>
              <span className="text-2xl font-bold text-[#00adef]">Deal</span>
              <p className="text-xs text-gray-500">Tvůj dodavatel Mercedes dílů</p>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Hledejte díly, číslo dílu, model..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#00adef] focus:outline-none transition"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00adef] text-white px-4 py-2 rounded-md hover:bg-[#0095cc] transition">
                Hledat
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/oblibene" className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#00adef] transition">
              <span className="text-2xl">♡</span>
              <span className="text-xs">Oblíbené</span>
            </Link>
            <Link href="/ucet" className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#00adef] transition">
              <span className="text-2xl">👤</span>
              <span className="text-xs">Účet</span>
            </Link>
            <Link href="/kosik" className="flex flex-col items-center text-gray-600 hover:text-[#00adef] transition relative">
              <span className="text-2xl">🛒</span>
              <span className="text-xs">Košík</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00adef] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-2xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#0d0d0d] text-white">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center">
            {/* Categories dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-[#00adef] px-6 py-4 font-semibold hover:bg-[#0095cc] transition">
                <span>☰</span>
                <span>Kategorie</span>
              </button>
              <div className="absolute left-0 top-full w-64 bg-white text-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 border-b border-gray-100 transition"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Models dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-6 py-4 hover:bg-white/10 transition">
                <span>Dle modelu</span>
                <span className="text-xs">▼</span>
              </button>
              <div className="absolute left-0 top-full w-48 bg-white text-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-80 overflow-y-auto">
                {mercedesModels.map((model) => (
                  <Link
                    key={model}
                    href={`/model/${model.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-100 transition"
                  >
                    {model}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/novinky" className="px-6 py-4 hover:bg-white/10 transition">
              Novinky
            </Link>
            <Link href="/akce" className="px-6 py-4 hover:bg-white/10 transition flex items-center gap-2">
              <span className="bg-red-500 text-xs px-2 py-0.5 rounded">SLEVA</span>
              Akční nabídky
            </Link>
            <Link href="/amg" className="px-6 py-4 hover:bg-white/10 transition font-bold">
              AMG
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="p-4">
            <input
              type="text"
              placeholder="Hledejte díly..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-4"
            />
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
