import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "../../config/stripeConfig";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import { orderService } from "../../services/orderService";
import { confirmOrderCODOrder } from "../../services/paymentService";
import PaymentPageSkeleton from "../../components/payment/PaymentPageSkeleton";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../features/cart/cartSlice";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const stripePromise = getStripe();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!orderId) {
      alert("Invalid order. Please start from checkout.");
      navigate("/checkout");
      return;
    }
    fetchOrderDetails(orderId);
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const response = await orderService.fetchOrderDetailsService(id);

      if (response.success) {
        const orderDetails = response.data;
        setOrder(orderDetails);
        setLoading(false);
      }
    } catch (error) {
      console.log("Failed to load order", error);
      alert("Failed to load order details");
      navigate("/checkout");
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCODPayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setProcessing(true);

    try {
      const response = await confirmOrderCODOrder(orderId);

      if (response.success) {
        await dispatch(fetchCart());

        navigate(`/orders-success/${orderId}`);
      }
    } catch (error) {
      console.error("Error placing COD order:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  const handleStripeSuccess = async () => {
    await dispatch(fetchCart());

    navigate(`/orders-success/${orderId}`);
  };

  const handleStripeError = (errorMessage) => {
    console.log("errorMessage", errorMessage);
    console.error("payment failed:", errorMessage);
    alert(`Payment failed: ${errorMessage}`);
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen w-full bg-slate-50 pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 w-full bg-black p-3 flex items-center justify-start md:pl-60 shadow-md">
          <Link
            className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
            to={"/"}
          >
            Baggify
          </Link>
        </div>

        <div className="pt-20">
          <PaymentPageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-black p-3 flex items-center justify-start md:pl-60 shadow-md">
        <Link
          className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
          to={"/"}
        >
          Baggify
        </Link>
      </div>

      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 p-8 flex flex-col md:flex-row items-center justify-between bg-amber-50 border border-amber-200 rounded-xl">
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-slate-800">
                Complete Your Payment
              </h1>
              <p className="text-sm text-slate-600">
                Order ID: <span className="font-mono">{order?._id}</span>
              </p>
            </div>
            <div className="mt-2 md:mt-0 text-amber-700 font-medium flex items-center">
              <span className="mr-2">⏱️</span>
              Session expires at:{" "}
              {new Date(order.expiresAt).toLocaleTimeString()}
            </div>
          </div>

          <div className="min-h-screen bg-slate-50 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
                      How would you like to pay?
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <div
                        onClick={() => handlePaymentMethodChange("stripe")}
                        className={`group relative flex items-center p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "stripe"
                            ? "border-indigo-600 bg-indigo-50/50"
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            paymentMethod === "stripe"
                              ? "border-indigo-600"
                              : "border-slate-300"
                          }`}
                        >
                          {paymentMethod === "stripe" && (
                            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                          )}
                        </div>
                        <div className="ml-4 min-w-0">
                          <p className="font-bold text-slate-800 text-sm md:text-base">
                            Pay Online
                          </p>
                          <p className="text-xs md:text-sm text-slate-500 truncate">
                            Cards, UPI, Netbanking (Secure via Stripe)
                          </p>
                        </div>
                        <span className="ml-auto text-xl md:text-2xl shrink-0 grayscale group-hover:grayscale-0 transition-all">
                          💳
                        </span>
                      </div>

                      <div
                        onClick={() =>
                          handlePaymentMethodChange("cash_on_delivery")
                        }
                        className={`group relative flex items-center p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "cash_on_delivery"
                            ? "border-indigo-600 bg-indigo-50/50"
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            paymentMethod === "cash_on_delivery"
                              ? "border-indigo-600"
                              : "border-slate-300"
                          }`}
                        >
                          {paymentMethod === "cash_on_delivery" && (
                            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                          )}
                        </div>
                        <div className="ml-4 min-w-0">
                          <p className="font-bold text-slate-800 text-sm md:text-base">
                            Cash on Delivery
                          </p>
                          <p className="text-xs md:text-sm text-slate-500 truncate">
                            Pay when your ordered product arrives
                          </p>
                        </div>
                        <span className="ml-auto text-xl md:text-2xl shrink-0 grayscale group-hover:grayscale-0 transition-all">
                          💵
                        </span>
                      </div>
                    </div>

                    {paymentMethod === "stripe" && (
                      <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border-2 border-indigo-100">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">
                              Enter Card Details
                            </h3>
                            <p className="text-xs text-slate-500">
                              Complete your payment securely
                            </p>
                          </div>
                        </div>

                        {/* Stripe Elements Wrapper */}
                        <Elements stripe={stripePromise}>
                          <CheckoutForm
                            orderId={orderId}
                            amount={order.total}
                            onPaymentSuccess={handleStripeSuccess}
                            onPaymentError={handleStripeError}
                          />
                        </Elements>
                      </div>
                    )}

                    {paymentMethod === "cash_on_delivery" && (
                      <div className="mt-8">
                        <button
                          onClick={handleCODPayment}
                          disabled={processing}
                          className="w-full py-4 px-6 rounded-xl font-black text-lg tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-[0.98] bg-slate-900 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center justify-center gap-3"
                        >
                          {processing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>VERIFYING...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>CONFIRM ORDER</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
                      <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                        Shipping To
                      </h3>
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase">
                        Verified Address
                      </span>
                    </div>
                    <div className="text-slate-600 text-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-base mb-1 truncate">
                          {order.shippingAddress.fullName}
                        </p>
                        <div className="text-slate-500 leading-relaxed space-y-0.5">
                          <p className="truncate">
                            {order.shippingAddress.street}
                          </p>
                          <p className="truncate">
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                          </p>
                          <p className="font-medium text-slate-700">
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                      <div className="md:text-right flex flex-col md:justify-end">
                        <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">
                          Contact Number
                        </p>
                        <p className="font-mono text-slate-800 font-bold text-base">
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-10">
                    <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                      <h3 className="font-bold">Order Summary</h3>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {order.items.length} Items
                      </span>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 items-center">
                            <div className="relative shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border border-slate-100 shadow-sm"
                              />
                              <span className="absolute -top-[0.2px] -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                ₹{item.unitPrice} / unit
                              </p>
                            </div>
                            <div className="text-sm font-bold text-slate-900 shrink-0">
                              ₹{item.totalPrice}
                            </div>
                          </div>
                        ))}
                      </div>

                      <hr className="border-dashed border-slate-200 mb-6" />

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal</span>
                          <span className="font-medium text-slate-800">
                            ₹{order.subtotal}
                          </span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Special Discount</span>
                          <span>-₹{order.discount}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 pb-4 border-b border-slate-100">
                          <span>Shipping</span>
                          <span className="text-emerald-600 font-bold uppercase text-[11px]">
                            {order?.shippingCost > 0
                              ? `₹${order.shippingCost}`
                              : "FREE"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="font-bold text-slate-800 text-base">
                            Total Payable
                          </span>
                          <div className="text-right">
                            <p className="text-2xl font-black text-slate-900 leading-none">
                              ₹{order.total}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter mt-1">
                              Inclusive of all taxes
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                        <span className="text-xl">🎉</span>
                        <p className="text-xs text-emerald-800 font-bold leading-tight">
                          Awesome! You're saving ₹{order.discount} on this order
                          today.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
