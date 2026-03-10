import Link from "next/link";

const modelSeries = [
  {
    series: "Sedan & Kombi",
    models: [
      { name: "A-Třída", code: "W177", years: "2018-" },
      { name: "C-Třída", code: "W206", years: "2021-" },
      { name: "C-Třída", code: "W205", years: "2014-2021" },
      { name: "E-Třída", code: "W213", years: "2016-" },
      { name: "S-Třída", code: "W223", years: "2020-" },
    ],
  },
  {
    series: "Kupé & Kabriolet",
    models: [
      { name: "CLA", code: "C118", years: "2019-" },
      { name: "CLS", code: "C257", years: "2018-" },
      { name: "E Kupé", code: "C238", years: "2017-" },
      { name: "AMG GT", code: "C190", years: "2014-" },
    ],
  },
  {
    series: "SUV & Crossover",
    models: [
      { name: "GLA", code: "H247", years: "2020-" },
      { name: "GLB", code: "X247", years: "2019-" },
      { name: "GLC", code: "X254", years: "2022-" },
      { name: "GLE", code: "V167", years: "2019-" },
      { name: "GLS", code: "X167", years: "2019-" },
      { name: "G-Třída", code: "W463", years: "2018-" },
    ],
  },
  {
    series: "Elektromobily",
    models: [
      { name: "EQA", code: "H243", years: "2021-" },
      { name: "EQB", code: "X243", years: "2021-" },
      { name: "EQC", code: "N293", years: "2019-" },
      { name: "EQE", code: "V295", years: "2022-" },
      { name: "EQS", code: "V297", years: "2021-" },
    ],
  },
];

export default function ModelSelector() {
  return (
    <section className="py-16 bg-[#0d0d0d] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Vyberte svůj model</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Najděte díly přesně pro váš Mercedes-Benz. Vyberte modelovou řadu a rok výroby.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modelSeries.map((series) => (
            <div key={series.series} className="bg-white/5 rounded-xl p-6 backdrop-blur">
              <h3 className="text-lg font-bold mb-4 text-[#00adef]">{series.series}</h3>
              <ul className="space-y-2">
                {series.models.map((model) => (
                  <li key={`${model.name}-${model.code}`}>
                    <Link
                      href={`/model/${model.code.toLowerCase()}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/10 transition group"
                    >
                      <div>
                        <span className="font-medium">{model.name}</span>
                        <span className="text-gray-400 text-sm ml-2">{model.code}</span>
                      </div>
                      <span className="text-gray-500 text-sm group-hover:text-[#00adef] transition">
                        {model.years}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-400 mb-4">Nemůžete najít svůj model?</p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-[#00adef] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0095cc] transition"
          >
            Kontaktujte nás
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
