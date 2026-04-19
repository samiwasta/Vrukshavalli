import type { Metadata } from "next";
import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — Vrukshavalli",
  description:
    "Read our Terms & Conditions, Cancellation Policy, and Shipping Policy before purchasing from Vrukshavalli.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
