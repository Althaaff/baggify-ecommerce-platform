import { CreditCard, MapPin, Package, Trash2, User, X } from "lucide-react";
import React, { useEffect } from "react";
import StatusDropDown from "./StatusDropDown";

const OrderDetailModal = ({
  isModalOpen = false,
  order,
  updatingOrderId,
  onClose,
  loadingState,
  onStatusUpdate,
  onPaymentStatusUpdate,
  onDeleteOrder,
}) => {
  console.log("isModalOpen", isModalOpen);
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 font-mono">
              {order.orderNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onDeleteOrder(order?._id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title={"Delete Order"}
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Order Status
              </p>

              <StatusDropDown
                type={"order"}
                currentStatus={order.status}
                orderId={order?._id}
                isUpdating={
                  updatingOrderId === order?._id &&
                  loadingState.type === "order"
                }
                onUpdate={onStatusUpdate}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Payment Status
              </p>

              <StatusDropDown
                type={"payment"}
                currentStatus={order.paymentStatus}
                orderId={order?._id}
                isUpdating={
                  updatingOrderId === order?._id &&
                  loadingState.type === "payment"
                }
                onUpdate={onPaymentStatusUpdate}
              />
            </div>
          </div>

          {/* Customer Info */}
          <div className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-gray-400" />
              <h3 className="font-semibold text-gray-700">
                Customer Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Name</p>
                <p className="font-medium text-gray-800">
                  {order.userId?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Email</p>
                <p className="font-medium text-gray-800">
                  {order.userId?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Phone</p>
                <p className="font-medium text-gray-800">
                  {order.shippingAddress?.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Order Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <h3 className="font-semibold text-gray-700">Shipping Address</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">
                {order.shippingAddress?.fullName}
              </p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.pincode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-gray-400" />
              <h3 className="font-semibold text-gray-700">
                Order Items ({order.items?.length})
              </h3>
            </div>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity} × ₹
                      {item.unitPrice?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">
                    ₹{item.totalPrice?.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <h3 className="font-semibold text-gray-700">Payment Summary</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount?.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {order.shippingCost === 0
                    ? "Free"
                    : `₹${order.shippingCost?.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
                <span>Total</span>
                <span>₹{order.total?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs pt-1">
                <span>Payment Method</span>
                <span className="capitalize">
                  {order.paymentMethod?.replace("_", " ")}
                </span>
              </div>
              {order.paymentDetails?.transactionId && (
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Transaction ID</span>
                  <span className="font-mono">
                    {order.paymentDetails.transactionId}
                  </span>
                </div>
              )}
              {order.paymentDetails?.paidAt && (
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Paid At</span>
                  <span>
                    {new Date(order.paymentDetails.paidAt).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
