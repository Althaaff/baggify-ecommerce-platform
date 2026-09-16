import React from "react";
import {
  ShoppingBag,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  IndianRupeeIcon,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
    <div className={`${bgColor} p-3 rounded-lg`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
    </div>
  </div>
);

const OrderStats = ({ stats, loading }) => {
  console.log("stats", stats);
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array(7)
          .fill(0)
          .map((__, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-24 animate-pulse border border-gray-100"
            ></div>
          ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending",
      value: stats?.pendingOrders,
      icon: ShoppingBag,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Processing",
      value: stats?.processingOrders,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Shipped",
      value: stats?.shippedOrders,
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Delivered",
      value: stats?.deliveredOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Cancelled",
      value: stats?.cancelledOrders,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Revenue",
      value: stats?.totalRevenue
        ? `₹${stats.totalRevenue.toLocaleString("en-IN")}`
        : "₹0",
      icon: IndianRupeeIcon,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
      {statCards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default OrderStats;
