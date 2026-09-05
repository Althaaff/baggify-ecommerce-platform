import {
  AlertCircle,
  ArrowLeft,
  Check,
  Loader,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderService } from "../../services/orderService";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getOrderById } = orderService;

  useEffect(() => {
    let attempts = 0;
    const maxAttempt = 5;
    let timeoutId;

    const pollOrderDetails = async () => {
      try {
        const response = await getOrderById(orderId);

        const order = response.data;

        if (response.success && order) {
          if (order.paymentStatus === "paid") {
            setOrder(order);
            setLoading(false);
            return;
          }
        }

        // if not paid yet, retry until max attempts
        attempts++;

        if (attempts < maxAttempt) {
          timeoutId = setTimeout(pollOrderDetails, 1500);
        } else {
          if (order) {
            setOrder(order);
          } else {
            setError(true);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching order", error);
        setError(true);
        setLoading(false);
      }
    };

    if (orderId) {
      pollOrderDetails();
    }

    // cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl max-w-sm w-full text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <Loader className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-bold text-lg">Confirming Order</h3>
            <p className="text-slate-400 text-xs">
              Verifying payment and updating stock level...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/50 border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Order Confirmation Delayed
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              We are confirming item availability and payment logs. Please
              refresh or check your order history.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-black active:scale-[0.99] transition-all shadow-md"
            >
              Refresh Page
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] transition-all"
            >
              Go to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 text-green-600 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Order confirmed
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Thank you for your purchase. We’ve sent a confirmation email to
                your inbox.
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Order Reference</p>
            <p className="text-sm font-semibold text-gray-900 font-mono mt-0.5">
              #{order?.orderNumber}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                Order Items ({order?.items?.length || 0})
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Processing
            </span>
          </div>

          <ul className="divide-y divide-gray-200 max-h-[360px] overflow-y-auto">
            {order?.items?.map((item) => (
              <li
                key={item.productId}
                className="p-4 sm:px-6 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {item.category || "General"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{item.unitPrice}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-gray-50 border-t border-gray-200 p-4 sm:px-6 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>₹{order?.total}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Paid</span>
              <span className="text-lg">₹{order?.total}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Need help? Contact our{" "}
            <a
              href="#"
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              support team
            </a>
            .
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
