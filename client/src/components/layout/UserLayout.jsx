import { Outlet, useLocation } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const UserLayout = () => {
  const location = useLocation();
  const hiddenRoutes = [
    "/login",
    "/profile",
    "/checkout",
    "/orders",
    "/payment",
    "/orders-success",
  ];

  const hideFooter =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/orders-success") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {" "}
          <Outlet />
        </main>

        {!hideFooter && <Footer />}
      </div>
    </>
  );
};

export default UserLayout;
