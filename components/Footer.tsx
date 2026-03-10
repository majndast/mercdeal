import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-white">
      {/* Newsletter */}
      <div className="bg-[#00adef] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Přihlaste se k odběru novinek</h3>
              <p className="text-white/80">Získejte slevy a informace o nových produktech</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Váš e-mail"
                className="px-4 py-3 rounded-l-lg text-gray-800 w-full md:w-64 focus:outline-none"
              />
              <button className="bg-[#0d0d0d] px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-800 transition">
                Odebírat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#0d0d0d] text-xl">★</span>
              </div>
              <div>
                <span className="text-xl font-bold">Merc</span>
                <span className="text-xl font-bold text-[#00adef]">Deal</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Váš spolehlivý partner pro náhradní díly a příslušenství Mercedes-Benz. Kvalita a profesionalita od roku 2020.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#00adef] transition">
                <span>f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#00adef] transition">
                <span>ig</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#00adef] transition">
                <span>yt</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Kategorie</h4>
            <ul className="space-y-2">
              <li><Link href="/kategorie/exterior" className="text-gray-400 hover:text-[#00adef] transition">Exteriér</Link></li>
              <li><Link href="/kategorie/interior" className="text-gray-400 hover:text-[#00adef] transition">Interiér</Link></li>
              <li><Link href="/kategorie/osvetleni" className="text-gray-400 hover:text-[#00adef] transition">Osvětlení</Link></li>
              <li><Link href="/kategorie/motor" className="text-gray-400 hover:text-[#00adef] transition">Motor & Výfuk</Link></li>
              <li><Link href="/kategorie/podvozek" className="text-gray-400 hover:text-[#00adef] transition">Podvozek & Brzdy</Link></li>
              <li><Link href="/bazar" className="text-gray-400 hover:text-[#00adef] transition">Bazar</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-bold mb-4">Informace</h4>
            <ul className="space-y-2">
              <li><Link href="/o-nas" className="text-gray-400 hover:text-[#00adef] transition">O nás</Link></li>
              <li><Link href="/kontakt" className="text-gray-400 hover:text-[#00adef] transition">Kontakt</Link></li>
              <li><Link href="/doprava" className="text-gray-400 hover:text-[#00adef] transition">Doprava a platba</Link></li>
              <li><Link href="/reklamace" className="text-gray-400 hover:text-[#00adef] transition">Reklamace</Link></li>
              <li><Link href="/obchodni-podminky" className="text-gray-400 hover:text-[#00adef] transition">Obchodní podmínky</Link></li>
              <li><Link href="/gdpr" className="text-gray-400 hover:text-[#00adef] transition">Ochrana osobních údajů</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Kontakt</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span>📍</span>
                <span>MercDeal s.r.o.<br />Průmyslová 123<br />150 00 Praha 5</span>
              </li>
              <li className="flex items-center gap-3">
                <span>📞</span>
                <a href="tel:+420123456789" className="hover:text-[#00adef] transition">+420 123 456 789</a>
              </li>
              <li className="flex items-center gap-3">
                <span>✉️</span>
                <a href="mailto:info@mercdeal.cz" className="hover:text-[#00adef] transition">info@mercdeal.cz</a>
              </li>
              <li className="flex items-center gap-3">
                <span>🕐</span>
                <span>Po-Pá: 8:00 - 17:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 MercDeal s.r.o. Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Platební metody:</span>
              <div className="flex gap-2">
                <span className="bg-white/10 px-2 py-1 rounded text-xs">VISA</span>
                <span className="bg-white/10 px-2 py-1 rounded text-xs">MC</span>
                <span className="bg-white/10 px-2 py-1 rounded text-xs">PayPal</span>
                <span className="bg-white/10 px-2 py-1 rounded text-xs">Dobírka</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
