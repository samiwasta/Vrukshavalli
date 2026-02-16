import NavbarDesktop from "@/app/features/Navbar/NavbarDesktop";
import NavbarMobile from "@/app/features/Navbar/NavbarMobile";

export default function Navbar() {
  return (
    <>
      <div className="hidden lg:block">
        <NavbarDesktop />
      </div>
      <div className="block lg:hidden">
        <NavbarMobile />
      </div>
    </>
  );
}
