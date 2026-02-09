import NavbarDesktop from "@/app/features/navbar/NavbarDesktop";
import NavbarMobile from "@/app/features/navbar/NavbarMobile";

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
