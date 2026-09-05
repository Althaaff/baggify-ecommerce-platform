import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../../services/paymentService";
import { getCurrentUser } from "../../utils/getUser";

const CheckoutForm = ({
  orderId,
  amount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const currentUser = getCurrentUser();
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#0f172a",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#94a3b8",
        },
        iconColor: "#4f46e5",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe.js has not loaded yet.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await createPaymentIntent(orderId);

      if (!response || !response.success || !response.data?.clientSecret) {
        const errorMsg =
          response?.message || "Failed to initialize payment configuration.";
        setError(errorMsg);
        onPaymentError(errorMsg);
        return;
      }

      const { clientSecret } = response.data;
      const cardNumberElement = elements.getElement(CardNumberElement);

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              email: currentUser.email,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        onPaymentError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Payment failed. Please try again.";

      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="w-full">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Card Number
        </label>
        <div className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
          <CardNumberElement options={ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="w-full min-w-0">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Expires (MM/YY)
          </label>
          <div className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
            <CardExpiryElement options={ELEMENT_OPTIONS} />
          </div>
        </div>

        <div className="w-full min-w-0">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            CVC / CVV
          </label>
          <div className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
            <CardCvcElement options={ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <span className="shrink-0 text-sm">⚠️</span>
          <p className="leading-snug">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-black active:scale-[0.99] shadow-lg shadow-slate-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {processing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pt-1">
        <span>🔒</span>
        <p>Encrypted and secured by Stripe</p>
      </div>
    </form>
  );
};

export default CheckoutForm;
