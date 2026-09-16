import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeIcon,
  Loader2,
  Trash2,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import StatusDropDown from "./StatusDropDown";
import UpdateTrackingModal from "../orders/UpdateTrackingModal";

const OrderTable = ({
  orders,
  loading,
  pagination,
  updatingOrderId,
  onStatusUpdate,
  loadingState,
  onPaymentStatusUpdate,
  onViewOrder,
  onDeleteOrder,
  onPageChange,
  onOrderUpdateSuccess,
}) => {
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-cente">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500 text-lg">No orders found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {" "}
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Order
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Items
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Total
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Payment
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Order Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Payment Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-center py-4 px-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                console.log("order status", order.status);
                return (
                  <tr
                    key={order?._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Order Number */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-semibold text-blue-600">
                        {order.orderNumber}
                      </span>
                    </td>
                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {order.userId?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.userId?.email || ""}
                        </p>
                      </div>
                    </td>
                    {/* Items count */}
                    <td className="py-4 px-4">
                      <span className="text-gray-600">
                        {order.items?.length}{" "}
                        {order.items?.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-800">
                        ₹{order.total?.toLocaleString("en-IN")}
                      </span>
                    </td>
                    {/* payment method */}
                    <td className="py-4 px-4">
                      <span className=" text-gray-600 capitalize">
                        {order.paymentMethod?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusDropDown
                        type="order"
                        currentStatus={order.status}
                        orderId={order?._id}
                        isUpdating={
                          updatingOrderId === order?._id &&
                          loadingState.type === "order"
                        }
                        onUpdate={onStatusUpdate}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <StatusDropDown
                        type="payment"
                        currentStatus={order.paymentStatus}
                        orderId={order?._id}
                        isUpdating={
                          updatingOrderId === order?._id &&
                          loadingState.type === "payment"
                        }
                        onUpdate={onPaymentStatusUpdate}
                      />
                    </td>{" "}
                    {/* Date */}
                    <td className="py-4 px-4">
                      <span className="text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewOrder(order?._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedOrderForTracking(order)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Update Tracking Info"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(order?._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing
            <span className="font-medium">
              {(pagination.currentPage - 1) * pagination.limit + 1}
            </span>
            to
            <span className="font-medium">
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalOrders,
              )}
            </span>
            of
            <span className="font-medium">{pagination.totalOrders}</span> orders
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.currentPage) <= 1,
              )
              .reduce((acc, page, i, arr) => {
                if (i > 0 && page - arr[i - 1] > 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((page, i) =>
                page === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === pagination.currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <UpdateTrackingModal
        isOpen={!!selectedOrderForTracking}
        order={selectedOrderForTracking}
        onClose={() => setSelectedOrderForTracking(null)}
        onUpdateSuccess={(updatedOrder) => {
          if (onOrderUpdateSuccess) {
            onOrderUpdateSuccess(updatedOrder);
          }
        }}
      />
    </>
  );
};

export default OrderTable;
