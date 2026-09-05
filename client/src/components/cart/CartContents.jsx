import { useEffect } from "react";
import CheckOutButton from "./CheckOutButton";
import useCart from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeCartDrawer } from "../../features/cart/cartSlice";
import CheckoutButton from "./CheckOutButton";

const CartContents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCartDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);
  const {
    loadCart,
    cart,
    items,
    loading,
    addingToCart,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    isItemRemoving,
    isItemUpdating,
  } = useCart();

  useEffect(() => {
    loadCart();
  }, [isCartDrawerOpen]);

  const handleClose = () => {
    dispatch(closeCartDrawer());
  };

  const handleNavigate = () => {
    navigate("/");
  };

  const handleIncrementQuantity = (itemId, quantity) => {
    incrementQuantity({ itemId, currentQuantity: quantity });
  };

  const handleDecrementQuantity = (itemId, quantity) => {
    decrementQuantity({ itemId, currentQuantity: quantity });
  };

  const isProcessing = loading || addingToCart;

  if (isProcessing && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // discounted price :
  const getDiscountedPrice = (item) => {
    // if (item.discount > 0) {
    //   return item.originalPrice * (1 - item.discount / 100);
    // }

    // already discounted :
    return item.price;
  };

  // calculate subtotal :
  const calculateSubtotal = () => {
    return items
      .reduce((total, item) => {
        const discountedPrice = getDiscountedPrice(item);

        return total + discountedPrice * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // format price with commas :
  const formatPrice = (price) => {
    return price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  function handleRemove(itemId) {
    removeItem(itemId);
  }

  // empty cart state :
  if (items?.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Your cart is empty</p>

        <button
          onClick={handleNavigate}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <style>
          {`
      /* Hide scrollbar for Chrome, Safari and Opera */
      div::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
        <div className="bg-black w-full h-[2px]"></div>

        {items?.map((item) => {
          const discountedPrice = getDiscountedPrice(item);
          const hasDiscount = item.discount > 0;
          const isUpdating = isItemUpdating(item?._id);
          const isRemoving = isItemRemoving(item?._id);
          const isDisabled = isUpdating || isRemoving;

          return (
            <div className="flex flex-col gap-4 justify-between items-center">
              <div
                key={item?._id}
                className={`${isItemUpdating(item._id) ? "opacity-50 pointer-events-none" : ""} flex items-end justify-between py-4 px-4 border-b overflow-y-auto`}
              >
                <div className="flex items-center justify-between">
                  <img
                    src={item.product?.image}
                    alt={item?.product.name}
                    className="w-28 h-32 object-cover mr-4"
                  />
                  <div className="w-full p-3">
                    <h3 className="text-black whitespace-nowrap">
                      {item.product?.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-1">
                      {hasDiscount ? (
                        <>
                          <span className="line-through text-black font-sans text-md whitespace-nowrap">
                            ₹ {formatPrice(item?.originalPrice)} INR
                          </span>

                          <span className="text-red-600 font-sans text-md whitespace-nowrap">
                            ₹ {formatPrice(discountedPrice)}
                          </span>

                          <span className="text-green-600 text-sm whitespace-nowrap">
                            ({item.discount}% OFF)
                          </span>
                        </>
                      ) : (
                        <span className="text-black font-sans text-md whitespace-nowrap">
                          ₹ {formatPrice(item.price)} INR
                        </span>
                      )}
                    </div>{" "}
                    <div className="flex flex-col md:flex-row items-start mt-2 justify-between py-3">
                      <div className="inline-flex border border-gray-400 rounded-sm overflow-hidden select-none font-sans text-gray-900">
                        <button
                          // disabled={isDisabled || item.quantity <= 1}
                          onClick={() =>
                            handleDecrementQuantity(item?._id, item?.quantity)
                          }
                          className="px-3 py-1 hover:bg-gray-200 focus:outline-none transition-all"
                          aria-label="Decrease Quantity"
                        >
                          -
                        </button>

                        <div className="px-6 py-1 border-gray-400 flex items-center justify-center w-12">
                          {item?.quantity}
                        </div>

                        <button
                          disabled={
                            isDisabled || item.quantity >= item?.product?.stock
                          }
                          onClick={() =>
                            handleIncrementQuantity(item?._id, item?.quantity)
                          }
                          className="px-3 py-1 hover:bg-gray-200 focus:outline-none transition-all"
                          aria-label="Decrease Quantity"
                        >
                          +
                        </button>
                      </div>{" "}
                    </div>
                    {/* show stock warning if quantity is near stock limit */}
                    {item.quantity >= item.product?.stock && (
                      <p className="text-orange-500 text-sm">
                        Only {item.product?.stock} available
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-2 hidden md:block">
                  <span
                    onClick={() => !isRemoving && handleRemove(item?._id)}
                    className={`underline text-sm cursor-pointer text-red-500 ${
                      isRemoving
                        ? "opacity-50 pointer-events-none"
                        : "hover:text-red-600"
                    }`}
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* subtotal + buy now (always bottom) */}
      <div className="fixed bottom-0 bg-white shadow-md p-4 flex flex-col justify-around gap-3 w-full">
        <hr className="h-[4px] bg-black rounded-lg mb-3" />
        <div className="inline-flex items-center justify-between gap-4 text-lg font-medium text-gray-900">
          <span>Subtotal ({items.length} items):</span>
          <span>₹{calculateSubtotal()} INR</span>
        </div>
        {cart?.couponCode && (
          <div className="inline-flex items-center justify-between gap-4 text-sm text-green-600">
            <span>Coupon ({cart.couponCode}):</span>
            <span>-₹{formatPrice(cart.couponDiscountAmount)}</span>
          </div>
        )}
        <CheckoutButton onClose={handleClose} />
      </div>
    </div>
  );
};

export default CartContents;
