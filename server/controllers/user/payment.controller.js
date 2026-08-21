import stripe from "../../config/stripe.js";
import { Cart } from "../../models/cart.model.js";
import { Order } from "../../models/order.model.js";
import { Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user?._id;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  // verify order belongs to the user :
  if (order.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  // check if order is already paid :
  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order is already paid");
  }

  // payment on stripe :
  const amount = Math.round(order.total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    metadata: {
      orderId: order?._id.toString(),
      userId: userId.toString(),
      orderNumber: order?.orderNumber,
    },
    description: `Order #${order._id}`,
    receipt_email: req.user.email,
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        orderNumber: order?.orderNumber,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent?.id,
      },
      message: "Payment intent created successfully",
    }),
  );
});

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webHookSecret);
  } catch (error) {
    console.error(
      "Error: Webhook signature verification failed:",
      error.message,
    );
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log("consoled");
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
          console.error(`CRITICAL: Order ${orderId} paid but not found in DB`);
          return res.status(200).json({ received: true });
        }

        // prevent duplicate webhook processing:
        if (order.paymentStatus === "paid") {
          console.log(`Order ${orderId} already paid`);
          return res.status(200).json({ received: true });
        }

        // update core order properties :
        order.paymentMethod = "stripe";
        order.paymentStatus = "paid";
        order.status = "processing";
        order.paymentDetails = {
          transactionId: paymentIntent.id,
          paidAt: new Date(),
        };

        // remove the expiration date so MongoDB TTL index does not delete this paid order
        order.expiresAt = null;

        await order.save();

        const productIds = order.items.map((item) => item.productId);

        console.log("productIds", productIds);
        // clear cart :
        await Cart.findOneAndUpdate(
          {
            userId: order.userId,
          },
          { $pull: { items: { productId: { $in: productIds } } } },
        );

        console.log(`Order ${orderId} confirmed through Stripe webhook`);
        return res.status(200).json({ received: true });
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        const order = await Order.findById(orderId);

        if (order && order.paymentStatus !== "failed") {
          order.paymentStatus = "failed";
          await order.save();
          console.log(`Payment failed logged for order ${orderId}`);
        }

        return res.status(200).json({ received: true });
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
        return res.status(200).json({ received: true });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error handling webhook",
    });
  }
};

// return publishable key to frontend :
export const getStripeConfig = async (req, res) => {
  return res.status(200).json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};
