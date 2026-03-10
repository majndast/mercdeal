"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/lib/hooks/useCart";
import { SearchInput } from "@/components/products/SearchInput";
import { User, Heart, ShoppingCart, Menu, X, LogOut, Settings } from "lucide-react";

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const totalItems = useCart((state) => state.totalItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? totalItems() : 0;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-[#0d0d0d] text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span>📞 +420 123 456 789</span>
            <span className="hidden sm:inline">✉️ info@mercdeal.cz</span>
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
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-12 h-12 bg-[#0d0d0d] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">★</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0d0d0d]">Merc</span>
              <span className="text-2xl font-bold text-[#00adef]">Deal</span>
              <p className="text-xs text-gray-500 hidden sm:block">Tvůj dodavatel Mercedes dílů</p>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchInput />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/oblibene" className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#00adef] transition">
              <Heart className="w-6 h-6" />
              <span className="text-xs">Oblíbené</span>
            </Link>

            {/* User menu */}
            <div className="relative">
              {loading ? (
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#00adef] transition"
                >
                  <User className="w-6 h-6" />
                  <span className="text-xs">{profile?.full_name?.split(' ')[0] || 'Účet'}</span>
                </button>
              ) : (
                <Link href="/prihlaseni" className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#00adef] transition">
                  <User className="w-6 h-6" />
                  <span className="text-xs">Přihlásit</span>
                </Link>
              )}

              {/* User dropdown */}
              {userMenuOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{profile?.full_name || 'Uživatel'}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/ucet"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4" />
                    Můj účet
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 transition"
                    >
                      <Settings className="w-4 h-4" />
                      Administrace
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Odhlásit se
                  </button>
                </div>
              )}
            </div>

            <Link href="/kosik" className="flex flex-col items-center text-gray-600 hover:text-[#00adef] transition relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs">Košík</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00adef] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                <Menu className="w-5 h-5" />
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

            <Link href="/produkty" className="px-6 py-4 hover:bg-white/10 transition">
              Všechny produkty
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
            <div className="mb-4">
              <SearchInput />
            </div>

            {/* Mobile auth */}
            {!loading && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{profile?.full_name || 'Uživatel'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={signOut}
                      className="text-red-500 text-sm"
                    >
                      Odhlásit
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/prihlaseni"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2 bg-[#00adef] text-white rounded-lg font-medium"
                    >
                      Přihlásit se
                    </Link>
                    <Link
                      href="/registrace"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2 border border-gray-300 rounded-lg font-medium"
                    >
                      Registrace
                    </Link>
                  </div>
                )}
              </div>
            )}

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

            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-[#00adef] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Administrace
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
