import { Order } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// update order status :
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  ).populate("userId", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: order,
      message: `Order updated to ${status}`,
    }),
  );
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];

  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new ApiError(400, "Invalid Payment Status");
  }

  const updateData = { paymentStatus };

  // date when user paid:
  if (paymentStatus === "paid") {
    updateData["paymentDetails.paidAt"] = new Date();
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { ...updateData, updatedAt: new Date() },
    { new: true },
  ).populate("userId", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: order,
      message: `Payment status updated to ${paymentStatus}`,
    }),
  );
});

export const getOrderStats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    revenueData,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Order.countDocuments({ status: "processing" }),
    Order.countDocuments({ status: "shipped" }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "cancelled" }),

    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]),
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  const stats = {
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: stats,
      message: "Order statistics fetched successfully",
    }),
  );
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Order deleted successfully",
    }),
  );
});

// get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    startDate,
    endDate,
  } = req.query;

  const query = {};

  // status filter:
  if (status && status !== "all") {
    query.status = status;
  }

  // payment status filter:
  if (paymentStatus && paymentStatus !== "all") {
    query.paymentStatus = paymentStatus;
  }

  // date range filter:
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // search filter:
  if (search) {
    query.$or = [{ orderNumber: { $regex: search, $options: "i" } }];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  // fetching data
  const [orders, totalOrders] = await Promise.all([
    Order.find(query)
      .populate("userId", "name email phone")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),

    Order.countDocuments(query),
  ]).catch((error) => {
    throw new ApiError(500, "Database query failed", error.message);
  });

  const totalPages = Math.ceil(totalOrders / parseInt(limit));

  const responsePayload = {
    orders,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalOrders,
      limit: parseInt(limit),
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    },
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: responsePayload,
      message: "Orders fetched successfully",
    }),
  );
});

// update order tracking:
export const updateOrderTracking = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const {
    status,
    courierName,
    trackingId,
    trackingUrl,
    estimatedDelivery,
    updateStatusText,
    location,
  } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const updatedPayload = {};

  if (status) {
    updatedPayload.status = status;
  }

  // update tracking info object:
  if (courierName) updatedPayload["trackingInfo.courierName"] = courierName;
  if (trackingId) updatedPayload["trackingInfo.trackingId"] = trackingId;
  if (trackingUrl) updatedPayload["trackingInfo.trackingUrl"] = trackingUrl;
  if (estimatedDelivery) {
    updatedPayload["trackingInfo.estimatedDelivery"] = new Date(
      estimatedDelivery,
    );
  }

  const updatedQuery = { $set: updatedPayload };

  // checkpoint update logs:
  if (updateStatusText) {
    updatedQuery.$push = {
      "trackingInfo.updates": {
        status: updateStatusText,
        location: location || "",
        timestamp: new Date(),
      },
    };
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedQuery, {
    new: true,
    runValidators: true,
  }).catch((error) => {
    throw new ApiError(
      500,
      "Failed to update order tracking details",
      error.message,
    );
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: updatedOrder,
      message: "Order tracking updated successfully",
    }),
  );
});
