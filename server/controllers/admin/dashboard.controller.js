import { Order } from "../../models/order.model.js";
import { Product } from "../../models/product.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    totalProducts,
    recentOrders,
    revenue,
    processingOrders,
    deliveredOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]),

    Order.countDocuments({ status: "processing" }),

    Order.countDocuments({ status: "delivered" }),
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        totalOrders,
        totalProducts,
        recentOrders,
        totalRevenue: revenue[0]?.totalRevenue || 0,
        processingOrders,
        deliveredOrders,
      },
      message: "Dashboard stats fetched successfully",
    }),
  );
});
