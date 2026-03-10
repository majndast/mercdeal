import { Shield, Truck, Award, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">O nás</h1>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">MercDeal - Váš partner pro Mercedes-Benz</h2>
        <p className="text-gray-600 mb-4">
          Jsme specializovaný e-shop zaměřený na náhradní díly a příslušenství pro vozy Mercedes-Benz.
          Od roku 2020 dodáváme kvalitní díly zákazníkům po celé České republice.
        </p>
        <p className="text-gray-600">
          Naším cílem je poskytovat prvotřídní produkty za konkurenceschopné ceny s důrazem na
          rychlé dodání a profesionální zákaznický servis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Shield className="w-12 h-12 text-[#00adef] mx-auto mb-4" />
          <h3 className="font-bold mb-2">Garance kvality</h3>
          <p className="text-gray-600 text-sm">Pouze ověřené a kvalitní díly</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Truck className="w-12 h-12 text-[#00adef] mx-auto mb-4" />
          <h3 className="font-bold mb-2">Rychlé doručení</h3>
          <p className="text-gray-600 text-sm">Doručení do 2-3 pracovních dnů</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Award className="w-12 h-12 text-[#00adef] mx-auto mb-4" />
          <h3 className="font-bold mb-2">Originální díly</h3>
          <p className="text-gray-600 text-sm">Originální i kvalitní aftermarket</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Users className="w-12 h-12 text-[#00adef] mx-auto mb-4" />
          <h3 className="font-bold mb-2">Podpora</h3>
          <p className="text-gray-600 text-sm">Profesionální zákaznický servis</p>
        </div>
      </div>
    </div>
  )
}
