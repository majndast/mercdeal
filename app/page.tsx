import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import ModelSelector from "@/components/ModelSelector";
import Reviews from "@/components/Reviews";
import Brands from "@/components/Brands";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <Categories />
      <FeaturedProducts />
      <ModelSelector />
      <Reviews />
    </>
  );
}
