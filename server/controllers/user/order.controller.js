import { Order } from "../../models/order.model.js";
import { Product } from "../../models/product.model.js";
import { Cart } from "../../models/cart.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// initiate order
export const initiateOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { items, shippingAddress, subtotal, discount, shippingCost, total } =
    req.body;

  if (!items && items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item");
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
    throw new ApiError(400, "Shipping address is required");
  }

  await Order.deleteMany({
    userId,
    status: "pending",
    paymentStatus: "pending",
  });

  // batch-fetch target products in 1 query to prevent N+1 overhead loops :
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const productMap = new Map(products.map((p) => [p?._id.toString(), p]));

  const bulkOps = [];
  const missingOrInsufficientItems = [];

  for (const item of items) {
    const product = productMap.get(item.productId.toString());

    if (!product || product.stock < item.quantity) {
      missingOrInsufficientItems.push(item.name || item.productId);
      continue;
    }

    bulkOps.push({
      updateOne: {
        filter: { _id: product._id, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    });
  }

  if (missingOrInsufficientItems.length > 0) {
    throw new ApiError(
      400,
      `Some items became unavailable while checking out: ${missingOrInsufficientItems.join(", ")}`,
    );
  }

  if (bulkOps.length > 0) {
    await Product.bulkWrite(bulkOps);
  }

  // create pending order :
  const order = await Order.create({
    userId,
    items,
    shippingAddress,
    subtotal,
    discount,
    shippingCost,
    total,
    paymentMethod: "pending",
    status: "pending",
    paymentStatus: "pending",
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // reserves stock for exactly 15 minutes
  });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: order?._id,
      message: "Order Id fetched successfully",
    }),
  );
});

// confirm-COD order :
export const confirmOrderCODOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentMethod, paymentDetails } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  if (paymentMethod !== "cash_on_delivery") {
    throw new ApiError(
      400,
      "This endpoint can only process 'cash_on_delivery' orders.",
    );
  }

  if (order.paymentStatus === "paid") {
    throw new ApiError(
      400,
      "Order payment has already been confirmed and marked as paid.",
    );
  }

  order.paymentMethod = paymentMethod;
  order.paymentStatus = "paid";
  order.status = "delivered";

  order.paymentDetails = {
    ...order.paymentDetails,
    ...paymentDetails,
    paidAt: new Date(),
  };

  // CRUCIAL: clear the timer so MongoDB TTL processes do not delete this order
  order.expiresAt = null;

  if (order.trackingInfo && order.trackingInfo.updates) {
    order.trackingInfo.updates.push({
      status: "delivered",
      location: order.shippingAddress?.city || "Destination",
      timestamp: new Date(),
    });
  }

  await order.save();

  const productIds = order.items.map((item) => item.productId);
  await Cart.findOneAndUpdate(
    { userId: order.userId },
    { $pull: { items: { productId: { $in: productIds } } } },
  );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message:
        "COD order payment confirmed and marked as delivered successfully.",
      data: order,
    }),
  );
});

// get user orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const orders = await Order.find({
    userId,
  })
    .populate("items.productId", "name images")
    .sort({ createdAt: -1 });

  const formattedOrders = orders.map((order) => {
    const orderObj = order.toObject();

    if (orderObj.status !== "delivered") {
      const estimatedDate = new Date(orderObj.createdAt);

      estimatedDate.setDate(estimatedDate.getDate() + 5);

      orderObj.estimatedArrival = estimatedDate;
    }

    return orderObj;
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: formattedOrders,
      message: "User Order fetched successfully",
    }),
  );
});

// get order
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?._id;

  const order = await Order.findById(orderId)
    .populate("items.productId", "image")
    .populate("userId", "name email role");

  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  const isOrderOwner = order.userId?._id.toString() === userId.toString();
  const isAdmin = order.userId?.role === "admin";

  if (!isOrderOwner && !isAdmin) {
    throw ApiError(403, "You don't have permission to view this order");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: order,
      message: "Order fetched successfully",
    }),
  );
});

// get order tracking details :
export const getOrderTrackingDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  // fetch order tracking details belonging to logged-in user only :
  const order = await Order.findOne({ _id: orderId, userId: req.user?._id });

  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        courierName: order.trackingInfo?.courierName || "N/A",
        trackingId: order.trackingInfo?.trackingId || "N/A",
        trackingUrl: order.trackingInfo?.trackingUrl || null,
        estimatedDelivery: order.trackingInfo?.estimatedDelivery || null,
        updates: order.trackingInfo?.updates || [],
        createdAt: order.createdAt,
      },
      message: "Order tracking details fetched successfully",
    }),
  );
});
