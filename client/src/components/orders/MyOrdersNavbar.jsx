import ProfileDropdown from "../account/ProfileDropdown";
import { Link } from "react-router-dom";

const MyOrdersNavBar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="py-1.5 px-3 bg-black rounded cursor-pointer">
              <h2 className="text-center text-white font-bold text-sm sm:text-base">
                Baggify
              </h2>
            </div>

            <Link
              className="text-sm font-medium text-gray-700 hover:text-black p-2 rounded-md hover:bg-gray-100 transition-colors"
              to={"/"}
            >
              Shop
            </Link>

            <div className="p-2">
              <span className="text-sm font-semibold text-black border-b-2 border-black pb-0.5">
                Orders
              </span>
            </div>
          </div>

          <div>
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MyOrdersNavBar;
