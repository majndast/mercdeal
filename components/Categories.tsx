import Link from "next/link";

const categories = [
  {
    name: "Exteriér",
    description: "Nárazníky, masky, zrcátka, spoilery",
    icon: "🚗",
    href: "/kategorie/exterior",
    color: "from-blue-500 to-blue-600",
    count: 2340,
  },
  {
    name: "Interiér",
    description: "Volanty, pedály, LED osvětlení",
    icon: "🪑",
    href: "/kategorie/interior",
    color: "from-purple-500 to-purple-600",
    count: 1560,
  },
  {
    name: "Osvětlení",
    description: "Přední světla, DRL, LED moduly",
    icon: "💡",
    href: "/kategorie/osvetleni",
    color: "from-yellow-500 to-orange-500",
    count: 890,
  },
  {
    name: "Motor & Výfuk",
    description: "Sání, výfuky, chiptuning",
    icon: "⚙️",
    href: "/kategorie/motor",
    color: "from-red-500 to-red-600",
    count: 1230,
  },
  {
    name: "Podvozek & Brzdy",
    description: "Pružiny, tlumiče, brzdové kotouče",
    icon: "🔧",
    href: "/kategorie/podvozek",
    color: "from-gray-600 to-gray-700",
    count: 980,
  },
  {
    name: "Dárky & Merch",
    description: "Klíčenky, modely, oblečení",
    icon: "🎁",
    href: "/kategorie/darky",
    color: "from-green-500 to-green-600",
    count: 450,
  },
];

export default function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nakupujte podle kategorií</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vyberte si z našeho širokého sortimentu kvalitních dílů a příslušenství pro váš Mercedes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{cat.icon}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{cat.description}</p>
              <p className="text-[#00adef] text-sm font-semibold">{cat.count} produktů</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
