import Link from "next/link";
import { Car, Armchair, Zap, Gauge } from "lucide-react";

const categories = [
  {
    name: "Exteriér",
    description: "Osvětlení, kliky, masky, zrcátka",
    icon: Car,
    href: "/kategorie/exterior",
  },
  {
    name: "Interiér",
    description: "Volanty, sedadla, obložení, pedály",
    icon: Armchair,
    href: "/kategorie/interior",
  },
  {
    name: "Elektroinstalace",
    description: "Kabeláž, senzory, displeje",
    icon: Zap,
    href: "/kategorie/elektroinstalace",
  },
  {
    name: "Podvozek",
    description: "Brzdy, pružiny, tlumiče, ramena",
    icon: Gauge,
    href: "/kategorie/podvozek",
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-14 h-14 bg-[#0d0d0d] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00adef] transition-colors">
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-[#00adef] transition-colors">{cat.name}</h3>
              <p className="text-gray-500 text-sm">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
