import { Loader, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import toast from "react-hot-toast";

const OrderSummary = ({ orderItems, deliveryAddress, totalSavings }) => {
  const {
    incrementQuantity,
    decrementQuantity,
    removeItem,
    isItemUpdating,
    loading,
  } = useCart();

  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shippingCost = subtotal > 500 ? 0 : 40;

  const total = subtotal + shippingCost;

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/"
          className="bg-black text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 text-center">Loading your order details...</div>
    );
  }

  const getDiscountedPrice = (item) => {
    // if (item.discount > 0) {
    //   return item.originalPrice * (1 - item.discount / 100);
    // }

    // already discounted :
    return item.price;
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleContinue = async () => {
    if (orderLoading) return;

    try {
      if (!deliveryAddress) {
        alert("Please select a delivery address");
        return;
      }

      if (orderItems.length === 0) {
        alert("Your cart is empty");
        return;
      }

      setOrderLoading(true);

      const shippingAddress = {
        fullName: `${deliveryAddress?.firstName} ${deliveryAddress?.lastName}`,
        phone: deliveryAddress?.phoneNumber,
        street: deliveryAddress?.address,
        city: deliveryAddress?.city,
        state: deliveryAddress?.state,
        pincode: deliveryAddress?.pinCode,
        country: deliveryAddress?.country || "India",
      };

      const initiateOrderData = {
        items: formattedOrderItems,
        shippingAddress,
        subtotal,
        discount: totalSavings,
        shippingCost,
        total,
      };

      const response = await orderService.initiateOrder(initiateOrderData);
      const orderId = response.data;

      if (response.success) {
        setTimeout(() => {
          navigate(`/payment?orderId=${orderId}`);
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to proceed to payment",
      );
    } finally {
      setOrderLoading(false);
    }
  };

  let formattedOrderItems = orderItems?.map((item) => ({
    productId: item?.productId,
    name: item?.product.name,
    image: item?.product.image,
    quantity: item?.quantity,
    unitPrice: item?.price,
    totalPrice: item?.price * item?.quantity,
  }));

  return (
    <div className="divide-y space-y-6 ">
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:hidden">
        {orderItems.map((item) => {
          // logic to show the original price if a discount exists
          const hasDiscount = item.discount > 0;
          const displayOriginalPrice = hasDiscount
            ? item.originalPrice
            : item.price;

          return (
            <div
              className={`flex flex-col md:flex-row gap-6 py-6 ${isItemUpdating(item._id) ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="flex flex-col items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-contain"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      decrementQuantity({
                        itemId: item._id,
                        currentQuantity: item.quantity,
                      })
                    }
                    className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="w-10 border text-center text-sm py-0.5">
                    {item.quantity}
                  </div>
                  <button
                    onClick={() =>
                      incrementQuantity({
                        itemId: item._id,
                        currentQuantity: item.quantity,
                      })
                    }
                    className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium line-clamp-2">
                  {item.product.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase">
                  In Stock: {item.product.stock}
                </p>

                <div className="flex items-baseline gap-2 mt-4">
                  {hasDiscount && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{displayOriginalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-lg font-bold">
                    ₹{formatPrice(getDiscountedPrice(item))}
                  </span>
                  {hasDiscount && (
                    <span className="text-green-600 font-bold text-xs">
                      {item.discount}% Off
                    </span>
                  )}
                </div>

                <button
                  onClick={() => removeItem(item?._id)}
                  className="mt-4 font-bold uppercase text-sm text-gray-800 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="">
                <span className="text-gray-600">Delivery by Mon Feb 18</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Section */}
      <div className="border-t pt-4 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={orderLoading || !deliveryAddress || orderItems.length === 0}
          className="bg-[#fb641b] text-white font-bold py-3.5 px-12 rounded-sm shadow-md uppercase text-sm hover:bg-[#f4511e] transition-colors"
        >
          {orderLoading ? (
            <Loader className="animate-spin ease-in" />
          ) : (
            "CONTINUE"
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
