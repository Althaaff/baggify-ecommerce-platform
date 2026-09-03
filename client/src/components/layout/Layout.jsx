import React from "react";
import MyOrdersNavBar from "../orders/MyOrdersNavbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MyOrdersNavBar />

      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  );
};

export default Layout;
