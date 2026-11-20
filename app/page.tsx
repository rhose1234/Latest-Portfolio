import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Roles from "@/components/Roles";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import Pricing from "@/components/Pricing";
import Reviews from "@/components/Reviews";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Roles />
      <Marquee />
      <Work />
      <Pricing />
      <Reviews />
      <Cta />
      <Footer />
    </main>
  );
}
