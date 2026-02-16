import CategoryBanners from "@/app/features/HomePage/CategoryBanners";
import Hero from "@/app/features/HomePage/Hero";
import Features from "@/app/features/HomePage/Features";
import Navbar from "@/app/features/Navbar/Navbar";
import TopRibbon from "@/app/features/Ribbon/TopRibbon";
import BestSellers from "./features/HomePage/BestSellers";
import ImageBento from "./features/HomePage/ImageBento";
import HandPicked from "./features/HomePage/HandPicked";
import NewArrivals from "./features/HomePage/NewArrivals";
import CourseBanner from "./features/HomePage/CourseBanner";
import Ceramics from "./features/HomePage/Ceramics";
import Testimonials from "./features/HomePage/Testimonials";
import CTA from "./features/HomePage/CTA";
import Footer from "./features/Footer/Footer";

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