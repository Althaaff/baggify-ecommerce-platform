import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export const SettingsPage = () => {
  const [isLoggingOut, setIsLogginOut] = useState(false);
  const navigate = useNavigate();
  const { logoutUser } = authService;

  // async function for logging out
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLogginOut(true);
    try {
      logoutUser(() => navigate("/login"));
    } catch (error) {
      console.error(
        "Backend logout failed, proceeding with client-side logout:",
        error,
      );
    } finally {
      setIsLogginOut(false);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div className="flex items-start gap-4">
              <Lock className="w-14 h-14 -mt-4 text-gray-700 font-bold" />
              <div className="">
                <h2 className="text-lg font-semibold mb-2">
                  Sign out everywhere
                </h2>
                <p className="text-gray-600 text-sm">
                  If you've lost a device or have security concerns, log out
                  everywhere to ensure the security of your account.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white w-full rounded-md">
              <div className="flex flex-col md:flex-row items-center gap-4 ml-8">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm whitespace-nowrap"
                >
                  Sign out everywhere
                </button>
                <p className="float-left text-gray-500 text-sm whitespace-nowrap">
                  You'll also be signed out on this device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
