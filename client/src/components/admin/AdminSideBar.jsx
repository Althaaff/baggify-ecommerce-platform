import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { authService } from "../../services/authService";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const { logoutUser } = authService;

  const handleLogout = () => {
    logoutUser(() => navigate("/login"));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to={"/"} className="text-2xl font-medium">
          Baggify
        </Link>
      </div>
      <Link to={"/admin"}>
        <h2 className="text-xl font-medium mb-6 text-center">
          Admin Dashboard
        </h2>
      </Link>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to={"/admin/users"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink
          to={"/admin/products"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>

        <NavLink
          to={"/admin/orders"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white space-x-2 py-2 px-4 rounded flex items-center justify-center"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
