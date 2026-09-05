import { Loader, Package, ShoppingBag } from "lucide-react";

import Layout from "../../components/layout/Layout";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import toast from "react-hot-toast";
import Drawer from "../../components/common/Drawer";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCartDrawer,
  openCartDrawer,
  reorderCartItems,
} from "../../features/cart/cartSlice";
import CartContents from "../../components/cart/CartContents";
import TrackOrderModal from "../../components/orders/TrackOrderModal";
import OrderSkeleton from "../../components/orders/OrderSkeleton";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReOrderingId] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const isCartDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);
  const dispatch = useDispatch();
  const { getMyOrders } = orderService;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();

      if (response.success) {
        const orders = response.data;
        setOrders(orders);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReOrderItem = async (orderId) => {
    setReOrderingId(orderId);

    try {
      await dispatch(reorderCartItems(orderId)).unwrap();

      dispatch(openCartDrawer());

      toast.success("Item(s) added to cart");
    } catch (error) {
      const errorMessage =
        typeof error === "object" ? error.message : "Failed to reorder items.";
      toast.error(errorMessage);
    } finally {
      setReOrderingId(null);
    }
  };

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatusText = (status = "") => {
    return status.replace(/_/g, " ");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Orders
              </h1>
            </div>

            {loading && (
              <div className="flex items-center justify-center p-8">
                <OrderSkeleton />
              </div>
            )}

            {!loading && orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-10 sm:p-20 px-4 sm:px-8 text-center border border-gray-100">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders yet
                </h2>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Go to store to place an order.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-6 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-50 p-4 sm:px-6 sm:py-4 border-b border-gray-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-start sm:items-center">
                        <div>
                          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                            Order Number
                          </p>
                          <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                            {order?.orderNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                            Date Placed
                          </p>
                          <p className="text-xs sm:text-sm text-gray-800 font-medium">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                            Total Amount
                          </p>
                          <p className="font-bold text-xs sm:text-sm text-gray-900">
                            ₹{order?.total}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getStatusStyles(
                              order.status,
                            )}`}
                          >
                            {formatStatusText(order?.status)}
                          </span>
                          <Link
                            to={`/order/${order?._id}`}
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      {order?.status?.toLowerCase() !== "delivered" &&
                        order.estimatedArrival && (
                          <div className="mb-4 p-3 bg-blue-50/50 rounded-md border border-blue-100">
                            <p className="text-xs sm:text-sm font-medium text-gray-700">
                              Estimated Arrival:{" "}
                              <span className="text-black font-semibold">
                                {new Date(
                                  order.estimatedArrival,
                                ).toDateString()}
                              </span>
                            </p>
                          </div>
                        )}

                      <div className="divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 sm:gap-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gray-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-xs sm:text-base text-gray-900 leading-snug line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Size: {item.size || "N/A"}{" "}
                                <span className="mx-1">•</span> Qty:{" "}
                                {item.quantity}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-xs sm:text-base text-gray-900">
                                ₹{item?.unitPrice}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-3">
                        <button
                          onClick={() => setTrackingOrderId(order?._id)}
                          className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          Track Order
                        </button>
                        <button
                          onClick={() => handleReOrderItem(order?._id)}
                          className="w-full sm:w-auto px-5 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition min-w-[110px] flex items-center justify-center"
                        >
                          {reorderingId === order?._id ? (
                            <div className="flex items-center gap-2">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Adding...</span>
                            </div>
                          ) : (
                            "Buy Again"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </Layout>
      </div>

      <Drawer
        isOpen={isCartDrawerOpen}
        onClose={() => dispatch(closeCartDrawer())}
        position="right"
        title="Your Cart"
      >
        <CartContents />
      </Drawer>

      <TrackOrderModal
        isOpen={!!trackingOrderId}
        orderId={trackingOrderId}
        onClose={() => setTrackingOrderId(null)}
        key={trackingOrderId}
      />
    </>
  );
};

export default OrdersPage;
