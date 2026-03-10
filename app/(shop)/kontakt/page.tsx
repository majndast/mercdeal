import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Kontakt</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Kontaktní údaje</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#00adef] flex-shrink-0" />
                <div>
                  <p className="font-medium">Adresa</p>
                  <p className="text-gray-600">MercDeal s.r.o.</p>
                  <p className="text-gray-600">Průmyslová 123</p>
                  <p className="text-gray-600">150 00 Praha 5</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#00adef] flex-shrink-0" />
                <div>
                  <p className="font-medium">Telefon</p>
                  <a href="tel:+420123456789" className="text-[#00adef] hover:underline">
                    +420 123 456 789
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#00adef] flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:info@mercdeal.cz" className="text-[#00adef] hover:underline">
                    info@mercdeal.cz
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[#00adef] flex-shrink-0" />
                <div>
                  <p className="font-medium">Otevírací doba</p>
                  <p className="text-gray-600">Po - Pá: 8:00 - 17:00</p>
                  <p className="text-gray-600">So - Ne: Zavřeno</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Napište nám</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jméno</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zpráva</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00adef] text-white py-3 rounded-lg font-semibold hover:bg-[#0095cc] transition"
            >
              Odeslat zprávu
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
