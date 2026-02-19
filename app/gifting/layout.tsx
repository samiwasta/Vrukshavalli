import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";

export default function GiftingLayout({
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
