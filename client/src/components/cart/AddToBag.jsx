import { useState } from "react";
import Loader from "../common/Loader.jsx";
import CartModal from "./CartModal.jsx";
import Drawer from "../common/Drawer.jsx";
import CartContents from "./CartContents.jsx";
import useCart from "../../hooks/useCart.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCartDrawer,
  openCartDrawer,
} from "../../features/cart/cartSlice.js";

const AddToBagButton = ({
  product,
  quantity = 1,
  isAddedToCart,
  onSuccess,
}) => {
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { addToCart, addingToCart, lastAddedItem } = useCart();
  const isCartDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);

  const isUnAvailable =
    product?.stock === 0 || error === "This product currently unavailable";

  const handleAddToCart = async () => {
    if (isUnAvailable || addingToCart) return;

    // reset previous error when retry
    setError("");

    try {
      const result = await addToCart({ productId: product?._id, quantity });

      if (result?.meta?.requestStatus === "fulfilled") {
        onSuccess();
      }
      if (result?.meta?.requestStatus === "rejected") {
        setError(result?.payload);
        return;
      }

      // show modal after 1sec (after loader)
      setTimeout(() => {
        setIsModalOpen(true);
      }, 1000);

      // close modal after after 4sec
      setTimeout(() => {
        setIsModalOpen(false);
      }, 4000);
    } catch (error) {
      console.error("failed to add to cart:", error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="w-full flex flex-col items-start gap-2 py-2">
        {/* if error occured */}
        {error && (
          <div className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-md flex items-center justify-between text-xs text-red-600 font-medium animate-fade-in">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 text-base leading-none focus:outline-none"
              aria-label="Dismiss error"
            >
              &times;
            </button>
          </div>
        )}

        {/* action */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isUnAvailable || addingToCart}
          className={`relative w-full h-12 px-6 flex items-center justify-center font-sans font-medium text-sm tracking-wider uppercase transition-all duration-300 rounded-md overflow-hidden ${
            isUnAvailable
              ? "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
              : addingToCart
                ? "bg-black text-white border border-black cursor-wait"
                : isAddedToCart // Fixed typo to match your exact state hook prop name
                  ? "bg-white text-emerald-700 border border-emerald-600 cursor-pointer"
                  : "bg-black text-white border border-black hover:bg-gray-800 cursor-pointer"
          }`}
        >
          {addingToCart ? (
            <div className="flex items-center gap-2">
              <Loader />
              <span className="text-xs">Adding...</span>
            </div>
          ) : isUnAvailable ? (
            <span>Sold Out</span>
          ) : isAddedToCart ? (
            <span className="flex items-center gap-2 animate-fade-in">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Added To Bag
            </span>
          ) : (
            <span className="flex items-center gap-2">Add To Bag</span>
          )}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CartModal
          addedItem={lastAddedItem}
          onClose={closeModal}
          onViewCart={() => dispatch(openCartDrawer())}
        />
      )}

      {/* Cart Drawer */}
      <Drawer
        isOpen={isCartDrawerOpen}
        onClose={() => dispatch(closeCartDrawer())}
        position="right"
        title="Your Cart"
      >
        <CartContents />
      </Drawer>
    </>
  );
};

export default AddToBagButton;
