import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutButton = ({ onClose }) => {
  console.log("navigated");
  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  return (
    <div className="w-full">
      <Link to="/checkout" className="w-full block">
        <button
          onClick={handleClose}
          type="button"
          className="inline-flex items-center justify-center gap-2 w-full px-6 h-12 bg-black text-white font-sans text-sm font-medium uppercase tracking-widest transition-colors duration-200 hover:bg-gray-900"
        >
          Check Out <ChevronRight className="h-4 w-4" />
        </button>
      </Link>
    </div>
  );
};

export default CheckoutButton;
