import { Loader2 } from "lucide-react";
import React from "react";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const statusColors = {
  // Order statuses
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-blue-100 text-blue-800 border-blue-200",
  out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  // Payment statuses
  paid: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

const StatusDropDown = ({
  type,
  currentStatus,
  orderId,
  isUpdating,
  onUpdate,
}) => {
  console.log("currentStatus", currentStatus);
  const statuses = type === "order" ? ORDER_STATUSES : PAYMENT_STATUSES;

  const handleChange = (e) => {
    const newStatus = e.target.value;

    if (newStatus !== currentStatus) {
      onUpdate(orderId, newStatus);
    }
  };

  if (isUpdating)
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        <span className="text-xs text-gray-400">Updating...</span>
      </div>
    );

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`text-xs font-medium border rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
        statusColors[currentStatus] || ""
      }`}
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))}
        </option>
      ))}
    </select>
  );
};

export default StatusDropDown;
