import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderService } from "../../services/orderService";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      const response = await orderService.getMyOrders();

      const orders = response.data;

      if (response.success && orders) {
        // find current user order:
        const currentOrder = orders?.find(
          (order) => order?._id === id || order.orderNumber === id,
        );

        console.log("currentOrder", currentOrder);

        setOrderDetails(currentOrder || null);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-gray-500 mb-6">
          We couldn't find details for this order.
        </p>
        <Link to="/orders" className="text-blue-600 hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const {
    orderNumber,
    _id,
    createdAt,
    paymentStatus,
    status,
    paymentMethod,
    paymentDetails,
    shippingAddress,
    items = [],
    subtotal,
    discount,
    shippingCost,
    total,
  } = orderDetails;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Order Details</h2>
        <Link
          to="/orders"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          &larr; Back to My Orders
        </Link>
      </div>
      <div className="p-4 sm:p-6 rounded-xl border bg-white shadow-sm">
        {/* order info & status badges */}
        <div className="flex flex-col sm:flex-row justify-between pb-6 border-b mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Order #{orderNumber || _id}
            </h3>
            <p className="text-sm text-gray-500">
              Placed on {new Date(createdAt).toLocaleDateString()} at{" "}
              {new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 items-start">
            {/* payment status badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : paymentStatus === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Payment: {paymentStatus}
            </span>

            {/* order fulfillment status badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              Order: {status}
            </span>
          </div>
        </div>

        {/* customer, payment, & shipping info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b mb-6">
          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              Payment Details
            </h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Method:</span>{" "}
              <span className="uppercase">{paymentMethod}</span>
            </p>
            {paymentDetails?.transactionId && (
              <p className="text-sm text-gray-600 truncate">
                <span className="font-medium text-gray-800">
                  Transaction ID:
                </span>{" "}
                {paymentDetails.transactionId}
              </p>
            )}
            {paymentDetails?.paidAt && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Paid At:</span>{" "}
                {new Date(paymentDetails.paidAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* shipping address */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              Shipping Address
            </h4>
            {shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-900">
                  {shippingAddress.fullName}
                </p>
                <p>{shippingAddress.phone}</p>
                <p>
                  {shippingAddress.street}, {shippingAddress.city}
                </p>
                <p>
                  {shippingAddress.state}, {shippingAddress.pincode} -{" "}
                  {shippingAddress.country}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No address available</p>
            )}
          </div>
        </div>

        {/* product items table */}
        <div className="overflow-x-auto mb-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-900">
            Items Ordered
          </h4>

          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Product</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {items.map((item, index) => (
                <tr key={item.productId || index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md border flex-shrink-0"
                      />
                    )}
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                  </td>

                  <td className="py-3 px-4 font-mono">₹{item.unitPrice}</td>
                  <td className="py-3 px-4 font-mono">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-semibold font-mono text-gray-900">
                    ₹{item.totalPrice || item.unitPrice * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* order summary totals */}
        <div className="flex justify-end pt-4 border-t">
          <div className="w-full sm:w-80 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-gray-900">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-mono">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Cost</span>
              <span className="font-mono text-gray-900">₹{shippingCost}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
              <span>Grand Total</span>
              <span className="font-mono text-blue-600">₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
