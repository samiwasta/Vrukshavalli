import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Vrukshavalli",
  description:
    "Meet the team behind Vrukshavalli — Madhuri & Pratik — and learn what drives India's favourite plant boutique.",
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
