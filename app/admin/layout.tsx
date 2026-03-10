import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Car,
  Star,
  Settings,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produkty', href: '/admin/produkty', icon: Package },
  { name: 'Objednávky', href: '/admin/objednavky', icon: ShoppingCart },
  { name: 'Kategorie', href: '/admin/kategorie', icon: FolderTree },
  { name: 'Modely', href: '/admin/modely', icon: Car },
  { name: 'Recenze', href: '/admin/recenze', icon: Star },
  { name: 'Uživatelé', href: '/admin/uzivatele', icon: Users },
  { name: 'Nastavení', href: '/admin/nastaveni', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0d0d0d] text-white">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#00adef] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">★</span>
            </div>
            <div>
              <span className="text-xl font-bold">MercDeal</span>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 text-gray-400 hover:text-white transition"
          >
            <LogOut className="w-5 h-5" />
            Zpět na web
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
