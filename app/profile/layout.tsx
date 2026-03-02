import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";
import TopRibbon from "@/app/features/ribbon/TopRibbon";

export const metadata = {
  title: "My Profile — Vrukshavalli",
  description: "Manage your account details and addresses.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <TopRibbon />
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
