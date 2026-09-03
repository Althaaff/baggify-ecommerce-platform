import { useLocation } from "react-router-dom";
import TopBar from "../layout/TopBar";
import NavBar from "./NavBar";

const Header = () => {
  const location = useLocation();
  const hideComponent =
    location.pathname === "/orders" ||
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/checkout" ||
    location.pathname === "/payment" ||
    location.pathname === "/profile";

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-50 text-white transition-all ease-in-out duration-200">
        {/* TopBar */}
        {!hideComponent && <TopBar />}

        {/* NavBar */}
        {!hideComponent && <NavBar />}
      </header>
    </>
  );
};

export default Header;
