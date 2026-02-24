import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";

export const metadata = {
  title: "Our Story — Vrikshavalli",
  description:
    "From a family nursery rooted in 1993 to a thriving plant boutique — the story of Madhuri and Pratik, and why we started Vrikshavalli.",
};

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
