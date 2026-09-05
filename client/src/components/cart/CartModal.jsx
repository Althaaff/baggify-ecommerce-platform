import { useEffect, useRef } from "react";
import CheckoutButton from "./CheckOutButton";

const CartModal = ({ addedItem = null, onClose, onViewCart }) => {
  const modalRef = useRef(null);

  const handleViewCartClick = () => {
    onClose();
    onViewCart();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed md:top-[147px] top-[87px] right-4 w-full max-w-sm z-[9999] px-2 md:px-0">
      <div
        className="bg-white w-full border border-black p-4 flex flex-col gap-4"
        ref={modalRef}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="text-base font-medium uppercase tracking-wider text-black">
            Added to cart
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors text-2xl leading-none focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {addedItem && (
          <div className="flex gap-4 items-start">
            <img
              src={addedItem?.image?.url}
              alt={addedItem?.name}
              className="w-20 h-24 object-cover border border-gray-200"
            />
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-medium text-black line-clamp-2">
                {addedItem?.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">
                  ₹{addedItem?.originalPrice}
                </span>
                <span className="text-red-600 font-medium">
                  ₹{addedItem?.price}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-emerald-50 text-emerald-800 text-xs py-2 px-3 border border-emerald-200 font-medium text-center tracking-wide">
          5% Off on Prepaid Orders
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            className="w-full bg-white text-black py-2.5 text-xs font-medium tracking-widest uppercase border border-black hover:bg-gray-50 transition-colors"
            onClick={handleViewCartClick}
          >
            View Cart
          </button>
          <CheckoutButton />
        </div>
      </div>
    </div>
  );
};

export default CartModal;
