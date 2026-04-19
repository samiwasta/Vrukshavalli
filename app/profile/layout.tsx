import Navbar from "@/app/features/navbar/Navbar";
import Footer from "@/app/features/footer/Footer";
import TopRibbon from "@/app/features/ribbon/TopRibbon";

export const metadata = {
  title: "My Profile — Vrukshavalli",
  description: "Manage your account details and addresses.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar topSlot={<TopRibbon />} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
