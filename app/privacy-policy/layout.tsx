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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
