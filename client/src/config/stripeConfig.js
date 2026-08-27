import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error(
        `Stripe publishable key not found in environment variables`,
      );

      return null;
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
