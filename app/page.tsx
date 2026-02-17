import CategoryBanners from "@/app/features/homepage/CategoryBanners";
import Hero from "@/app/features/homepage/Hero";
import Features from "@/app/features/homepage/Features";
import Navbar from "@/app/features/navbar/Navbar";
import TopRibbon from "@/app/features/ribbon/TopRibbon";
import BestSellers from "./features/homepage/BestSellers";
import ImageBento from "./features/homepage/ImageBento";
import HandPicked from "./features/homepage/HandPicked";
import NewArrivals from "./features/homepage/NewArrivals";
import CourseBanner from "./features/homepage/CourseBanner";
import Ceramics from "./features/homepage/Ceramics";
import Testimonials from "./features/homepage/Testimonials";
import CTA from "./features/homepage/CTA";
import Footer from "./features/footer/Footer";

export default function Home() {
  return (
    <main>
      <TopRibbon />
      <Navbar />
      <Hero />
      <Features />
      <CategoryBanners />
      <BestSellers />
      <ImageBento />
      <HandPicked />
      <NewArrivals />
      <CourseBanner />
      <Ceramics />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}