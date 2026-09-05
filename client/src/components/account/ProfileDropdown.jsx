import { useState } from "react";
import { ChevronUp, CircleUser } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAddresses } from "../../hooks/useAddresses.jsx";
import { getCurrentUser } from "../../utils/getUser.js";
import { authService } from "../../services/authService.js";

const ProfileDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { email } = getCurrentUser();
  const { setAddresses } = useAddresses();
  const { logoutUser } = authService;

  const tabs = [
    { id: "profile", label: "Profile", path: "/profile" },
    { id: "settings", label: "Setting", path: "/settings" },
    { id: "orders", label: "Orders", path: "/orders" },
    { id: "signout", label: "Sign Out", path: "/" },
  ];

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setIsOpen(false);
    try {
      logoutUser(() => navigate("/login"));
      setAddresses?.([]);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoggingOut(false);
      navigate("/");
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 rounded-md transition-colors hover:bg-gray-100"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <CircleUser className="w-7 h-7 text-gray-800" />
        </div>
        <ChevronUp
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
          <div className="flex items-center gap-3 p-3.5 border-b border-gray-100 bg-gray-50/50">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
              <CircleUser className="w-5 h-5 text-gray-700" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
              {email}
            </span>
          </div>

          <div className="py-1">
            {tabs.map((tab) => {
              if (tab.id === "signout") {
                return (
                  <button
                    key={tab.id}
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors text-sm font-normal text-red-600 disabled:opacity-50"
                  >
                    {isLoggingOut ? "Signing Out.." : tab.label}
                  </button>
                );
              } else {
                return (
                  <Link
                    to={`${tab.path}`}
                    key={tab.id}
                    className="block w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors text-sm font-normal text-gray-800"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsOpen(false);
                    }}
                  >
                    <span
                      className={`${
                        activeTab === tab.id ? "font-semibold text-black" : ""
                      }`}
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;
