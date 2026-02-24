import type { Metadata } from "next";
import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Vrukshavalli",
  description:
    "Learn how Vrukshavalli collects, uses, and protects your personal information when you shop with us.",
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
