import Header from "../components/layout/Header";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import PlansSection from "../components/sections/PlansSection";
import MarketCategoriesSection from "../components/sections/MarketCategoriesSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import CarInvestment from "../components/sections/CarInvestment";
import HousingInvestment from "../components/sections/HousingInvestment";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />

        <section id="plans" className="py-24 px-6 bg-slate-950">
          <PlansSection />
        </section>

        <section id="market" className="py-24 px-6 bg-slate-900">
          <MarketCategoriesSection />
        </section>

        <CarInvestment />

        <HousingInvestment />

        <section id="testimonials" className="py-24 px-6 bg-slate-950">
          <TestimonialsSection />
        </section>
      </main>

      <Footer />
    </>
  );
}
