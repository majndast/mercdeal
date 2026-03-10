import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-[#0d0d0d] to-[#2a2a2a] text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00adef]/20 text-[#00adef] px-4 py-2 rounded-full mb-6">
              <span className="animate-pulse">●</span>
              <span>Nové díly každý týden</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Prémiové díly pro váš
              <span className="text-[#00adef]"> Mercedes-Benz</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Největší výběr originálních a aftermarket dílů. Od A-Třídy po AMG GT.
              Rychlé dodání a odborné poradenství.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/kategorie"
                className="bg-[#00adef] text-white px-8 py-4 rounded-lg font-bold text-center hover:bg-[#0095cc] transition transform hover:scale-105"
              >
                Prohlédnout díly
              </Link>
              <Link
                href="/akce"
                className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-lg font-bold text-center hover:bg-white/20 transition border border-white/20"
              >
                Akční nabídky 🔥
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-3xl">✓</span>
                <div>
                  <p className="font-bold">15 000+</p>
                  <p className="text-sm text-gray-400">produktů skladem</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🚚</span>
                <div>
                  <p className="font-bold">Doručení do 48h</p>
                  <p className="text-sm text-gray-400">po celé ČR</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="font-bold">4.9 / 5</p>
                  <p className="text-sm text-gray-400">hodnocení zákazníků</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mercedes star visual */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-[#c0c0c0] to-[#808080] rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-72 h-72 bg-gradient-to-br from-[#0d0d0d] to-[#2a2a2a] rounded-full flex items-center justify-center">
                  <span className="text-[150px] text-[#c0c0c0]">★</span>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-[#00adef] text-white px-4 py-2 rounded-full font-bold animate-bounce">
                -20%
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-[#0d0d0d] px-4 py-2 rounded-lg shadow-lg">
                AMG Performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
