const reviews = [
  {
    id: 1,
    name: "Martin K.",
    location: "Praha",
    rating: 5,
    text: "Skvělá komunikace a rychlé dodání. Nárazník na moje C-ko sedí perfektně. Určitě objednám znovu!",
    product: "AMG nárazník C-Třída",
    date: "před 2 dny",
    verified: true,
  },
  {
    id: 2,
    name: "Jakub P.",
    location: "Brno",
    rating: 5,
    text: "Konečně e-shop, který rozumí Mercedesům. Poradili mi přesně to, co jsem potřeboval. Kvalita dílů je výborná.",
    product: "LED osvětlení interiéru",
    date: "před týdnem",
    verified: true,
  },
  {
    id: 3,
    name: "Tomáš H.",
    location: "Ostrava",
    rating: 5,
    text: "Objednal jsem sportovní pružiny H&R. Montáž bez problémů, auto jede skvěle. Děkuji za profesionální přístup!",
    product: "H&R pružiny E-Třída",
    date: "před 2 týdny",
    verified: true,
  },
  {
    id: 4,
    name: "Pavel M.",
    location: "Plzeň",
    rating: 4,
    text: "Dobrá nabídka dílů pro starší modely. Našel jsem vše pro své W204. Doporučuji.",
    product: "Různé díly W204",
    date: "před měsícem",
    verified: true,
  },
];

export default function Reviews() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Co o nás říkají zákazníci</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex text-yellow-400 text-2xl">★★★★★</div>
            <span className="text-gray-600">
              <span className="font-bold text-[#0d0d0d]">4.9</span> / 5 na základě{" "}
              <span className="font-bold text-[#0d0d0d]">2 847</span> hodnocení
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00adef] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-gray-500 text-sm">{review.location}</p>
                  </div>
                </div>
                {review.verified && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    ✓ Ověřeno
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex text-yellow-400 mb-3">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              {/* Text */}
              <p className="text-gray-600 mb-4 line-clamp-4">{review.text}</p>

              {/* Product & Date */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-[#00adef] font-medium">{review.product}</p>
                <p className="text-xs text-gray-400 mt-1">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-sm">
            <span className="text-3xl">🛡️</span>
            <div>
              <p className="font-bold">Ověřený prodejce</p>
              <p className="text-sm text-gray-500">Heureka.cz</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-sm">
            <span className="text-3xl">✓</span>
            <div>
              <p className="font-bold">Bezpečný nákup</p>
              <p className="text-sm text-gray-500">SSL certifikát</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-sm">
            <span className="text-3xl">🔄</span>
            <div>
              <p className="font-bold">14 dní na vrácení</p>
              <p className="text-sm text-gray-500">Bez udání důvodu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
