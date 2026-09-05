import React, { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  Loader2,
} from "lucide-react";
import { orderService } from "../../services/orderService";

const STEPS = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

export const TrackOrderModal = ({ isOpen, orderId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchTracking = async () => {
        setLoading(true);
        try {
          const response = await orderService.getOrderTracking(orderId);
          if (response.success) {
            setTrackingData(response.data);
          }
        } catch (error) {
          console.error("Failed to load tracking details", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTracking();
    }
  }, [isOpen, orderId]);

  // prevent background scroll when modal opens :
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getCurrentStepIndex = (status) => {
    if (!status) return 0;

    const index = STEPS.findIndex((s) => s.key === status.toLowerCase());
    return index !== -1 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex(trackingData?.status);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-[95vw] max-w-4xl min-h-[40vh] max-h-[70vh] overflow-y-auto p-8 relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Track Order #{trackingData?.orderNumber || "..."}
            </h3>

            {trackingData?.estimatedDelivery && (
              <p className="text-xs text-green-600 font-medium mt-0.5">
                Estimated Delivery:{" "}
                {new Date(trackingData.estimatedDelivery).toDateString()}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="py-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Courier Partner
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {trackingData?.courierName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Tracking / AWB Number
                </p>
                <p className="text-sm font-semibold font-mono text-gray-800">
                  {trackingData?.trackingId}
                </p>
              </div>

              {trackingData?.trackingUrl && (
                <a
                  href={trackingData?.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
                >
                  Live Courier Tracking <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="px-2 pt-4">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0" />

                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 z-0"
                  style={{
                    width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                  }}
                />

                {/* Steps */}
                {STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? "bg-blue-600 text-white ring-4 ring-blue-50"
                            : "bg-white border-2 border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          isCurrent
                            ? "text-blue-600 font-bold"
                            : isCompleted
                              ? "text-gray-800"
                              : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {trackingData?.updates?.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Tracking Updates
                </h4>
                <div className="space-y-3">
                  {trackingData?.updates?.map((update, i) => {
                    return (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />

                        <div>
                          <p className="font-medium text-gray-800">
                            {update.status}
                          </p>
                          <p className="text-xs text-gray-400">
                            {update.location} •
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderModal;
