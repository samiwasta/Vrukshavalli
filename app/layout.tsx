import type { Metadata } from "next";
import { Poppins, Bricolage_Grotesque } from "next/font/google";
import { WishlistProvider } from "@/context/WishlistContext";
import { BagProvider } from "@/context/BagContext";
import BagSlider from "@/app/features/bag/BagSlider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vrukshavalli",
  description: "Vrukshavalli: India's premier luxury plant ecommerce destination, delivering exquisite indoor and outdoor plants, planters, and accessories to every corner of the country. Explore our curated collections and elevate your space with rare greens. Expert plant care guides, in-depth tutorials, and personalized support empower you to nurture a thriving botanical oasis at home. Discover, purchase, and learn all about luxury plants with Vrukshavalli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${bricolageGrotesque.variable}`}
    >
      <body className="antialiased overflow-x-hidden overflow-y-auto" suppressHydrationWarning>
        <WishlistProvider>
          <BagProvider>
            {children}
            <BagSlider />
          </BagProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
