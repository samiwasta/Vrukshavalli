import type { Metadata } from "next";
import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";

export const metadata: Metadata = {
  title: "Vruksha AI — Plant Disease Analyser",
  description:
    "Upload a photo of your plant and let Vruksha AI instantly detect signs of disease, pests, or nutrient deficiencies.",
};

export default function VrukshaAILayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
