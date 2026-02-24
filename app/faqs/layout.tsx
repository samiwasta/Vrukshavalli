import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs — Vrikshavalli",
  description:
    "Frequently asked questions about ordering, delivery, plant care, and more at Vrikshavalli.",
};

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
