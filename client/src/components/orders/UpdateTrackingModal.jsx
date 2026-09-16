import React, { useEffect } from "react";
import { useState } from "react";
import { Loader2, Truck, X } from "lucide-react";
import { orderService } from "../../services/orderService";

const UpdateTrackingModal = ({ isOpen, onClose, order, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: "processing",
    courierName: "",
    trackingId: "",
    trackingUrl: "",
    estimatedDelivery: "",
    updateStatusText: "",
    location: "",
  });

  // pre fill existing data when modal opens :
  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "processing",
        courierName: order.trackingInfo?.courierName || "",
        trackingId: order.trackingInfo?.trackingId || "",
        trackingUrl: order.trackingInfo?.trackingUrl || "",
        estimatedDelivery: order.trackingInfo?.estimatedDelivery
          ? new Date(order.trackingInfo.estimatedDelivery)
              .toISOString()
              .split("T")[0]
          : "",

        updateStatusText: "",
        location: "",
      });
    }
  }, [order]);

  // prevent background scroll when modal opens :
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await orderService.updateOrderTracking(
        order?._id,
        formData,
      );

      if (response.success) {
        onUpdateSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating tracking info:", error);
      alert(
        error.response?.data?.message || "Failed to update tracking details",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center border-b pb-5 mb-6">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Update Tracking ({order.orderNumber})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Order Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Order Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out For Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* courier name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Courier Partner
              </label>
              <input
                type="text"
                name="courierName"
                value={formData.courierName}
                onChange={handleChange}
                placeholder="e.g. Delhivery, BlueDart"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* tracking Id */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tracking / AWB Number
              </label>
              <input
                type="text"
                name="trackingId"
                value={formData.trackingId}
                onChange={handleChange}
                placeholder="e.g. WAYBILL987654"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* tracking Url */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tracking Link URL
              </label>
              <input
                type="url"
                name="trackingUrl"
                value={formData.trackingUrl}
                placeholder="https://courier.com/track/WAYBILL987654"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* estimated delivery date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Estimated Delivery Date
              </label>
              <input
                type="date"
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* optional update note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Checkpoint Update Note
              </label>
              <input
                type="text"
                name="updateStatusText"
                value={formData.updateStatusText || ""}
                placeholder="e.g. Package arrived at facility"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Current Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru Hub"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* form actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Tracking Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTrackingModal;
