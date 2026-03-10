const brands = [
  { name: "Bosch", logo: "BOSCH" },
  { name: "Brembo", logo: "BREMBO" },
  { name: "H&R", logo: "H&R" },
  { name: "Bilstein", logo: "BILSTEIN" },
  { name: "Osram", logo: "OSRAM" },
  { name: "Mann Filter", logo: "MANN" },
  { name: "Liqui Moly", logo: "LIQUI MOLY" },
  { name: "KW", logo: "KW" },
  { name: "Eibach", logo: "EIBACH" },
  { name: "Akrapovič", logo: "AKRAPOVIČ" },
];

export default function Brands() {
  return (
    <section className="py-12 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 mb-8">Spolupracujeme s předními značkami</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="text-gray-400 hover:text-[#0d0d0d] transition cursor-pointer"
              title={brand.name}
            >
              <span className="font-bold text-lg md:text-xl tracking-wider">{brand.logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
