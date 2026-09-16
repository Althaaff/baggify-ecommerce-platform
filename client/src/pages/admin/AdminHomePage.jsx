import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";
import { Loader } from "lucide-react";

const AdminHomePage = () => {
  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await dashboardService.getDashboardStats();

      if (response.success) {
        setDashboard(response?.data);
      }
    } catch (error) {
      console.error(
        error?.response?.data?.message || "Failed to fetch dashboard details",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl">₹{dashboard.totalRevenue}</p>
        </div>

        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">{dashboard.totalOrders}</p>

          <Link to={"/admin/orders"} className="text-blue-500 hover:underline">
            Manage Orders
          </Link>
        </div>

        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">{dashboard.totalProducts}</p>

          <Link
            to={"/admin/products"}
            className="text-blue-500 hover:underline"
          >
            Manage Products
          </Link>
        </div>
      </div>

      <div className="mt-6">
        {" "}
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order Id</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={999} className="p-8 text-center">
                    <Loader className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : dashboard?.recentOrders?.length > 0 ? (
                dashboard.recentOrders.map((order) => (
                  <tr
                    key={order?._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.userId?.name}</td>
                    <td className="p-4">{order.total}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No Recent Orders Found..
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
