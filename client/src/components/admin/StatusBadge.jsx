import React from "react";

const orderStatusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },

  processing: {
    label: "Processing",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const paymentStatusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  refunded: {
    label: "Refunded",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

const StatusBadge = ({ status, type = "order" }) => {
  const config =
    type === "order" ? orderStatusConfig[status] : paymentStatusConfig[status];

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
