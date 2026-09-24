import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutStep from "../../components/checkout/CheckoutStep.jsx";
import { LogIn, Plus } from "lucide-react";
import { useAddresses } from "../../hooks/useAddresses.jsx";
import AddressModal from "../../components/account/AddressModal.jsx";
import useCart from "../../hooks/useCart.jsx";
import OrderSummary from "../../components/checkout/OrderSummary.jsx";
import { getCurrentUser } from "../../utils/getUser.js";
import { authService } from "../../services/authService.js";

const CheckOutPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { addresses, loadAddresses, addressLoading } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const { items } = useCart();
  const currentUser = getCurrentUser();
  const { logoutUser } = authService;
  const navigate = useNavigate();

  console.log("currentUser", currentUser);

  const totals = items?.reduce(
    (acc, item) => {
      const hasDiscount = item?.discount > 0;
      const mrp = hasDiscount ? item?.originalPrice : item.price;

      acc.totalMRP += mrp * item.quantity;
      acc.totalPaid += item.price * item.quantity;
      return acc;
    },
    { totalMRP: 0, totalPaid: 0 },
  );

  const totalSavings = totals.totalMRP - totals.totalPaid;
  const itemCount = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const handleAddNew = () => {
    setEditingAddressId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (addressId) => {
    setEditingAddressId(addressId);
    setIsModalOpen(true);
  };

  // re-fetch address from backend
  const handleAddressSaved = () => {
    loadAddresses();
  };

  // handle login redirect :
  const handleLoginRedirect = () => {
    // pass current path so login page knows where to return :
    navigate("/login", { state: { from: location.pathname } });
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses?.find((address) => address?.isDefault);

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress?._id);
      } else {
        setSelectedAddressId(addresses[0]?._id);
      }
    }
  }, [addresses]);

  const selectedAddress = addresses?.find(
    (address) => address?._id === selectedAddressId,
  );

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      logoutUser(() => navigate("/login"));
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoggingOut(false);
      navigate("/");
    }
  };

  if (!addresses && addresses.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-lg shadow-sm border border-gray-100 max-w-md mx-auto my-8">
        <p className="text-gray-500 text-sm font-medium">
          No saved addresses found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-20 font-sans antialiased">
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
            to={"/"}
          >
            Baggify
          </Link>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row items-start justify-center gap-6 pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="w-full lg:flex-1 space-y-4">
          <CheckoutStep
            number={"1"}
            title={"Login"}
            isActive={activeStep === 1}
            isCompleted={activeStep > 1}
            summary={
              currentUser ? (
                <span className="font-medium text-gray-900">
                  {currentUser.email}
                </span>
              ) : (
                <span className="text-gray-500 italic">
                  Authentication required
                </span>
              )
            }
            onEdit={() => setActiveStep(1)}
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-2">
              <div className="w-full md:w-1/2 space-y-4">
                {currentUser ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Logged in as:{" "}
                        <span className="font-semibold text-gray-900">
                          {currentUser.email}
                        </span>
                      </p>

                      <button
                        onClick={handleLogout}
                        type="button"
                        className="mt-2 text-xs text-red-600 font-semibold hover:underline focus:outline-none"
                      >
                        Logout & Sign in to another account
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveStep(2)}
                      type="button"
                      className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e55813] text-white font-bold py-3.5 px-10 rounded-md shadow-sm uppercase text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb641b]"
                    >
                      Continue Checkout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-800">
                      Please sign in to your account to complete your delivery
                      details and place the order.
                    </div>

                    <button
                      onClick={handleLoginRedirect}
                      type="button"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-md shadow-sm uppercase text-sm transition-all focus:outline-none"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In to Continue
                    </button>
                  </div>
                )}
              </div>

              <div className="hidden md:block border-l border-gray-100 pl-6 text-xs text-gray-500 space-y-2.5">
                <p className="font-semibold text-gray-700 uppercase tracking-wider text-[11px]">
                  Advantages of our secure login
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Easily
                  Track Orders, Hassle free Returns
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Get
                  Relevant Alerts and Recommendation
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>{" "}
                  Wishlist, Reviews, Ratings and more.
                </p>
              </div>
            </div>
          </CheckoutStep>

          <CheckoutStep
            number={"2"}
            title={"Delivery Address"}
            isActive={activeStep === 2}
            isCompleted={activeStep > 2}
            summary={
              selectedAddress
                ? `${selectedAddress?.firstName} ${selectedAddress.lastName}, ${selectedAddress.pinCode}`
                : ""
            }
            onEdit={() => setActiveStep(2)}
          >
            {addressLoading && addresses.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm flex items-center justify-center">
                Loading your address details...
              </div>
            )}
            <div className="flex flex-col w-full">
              <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100 pr-1 custom-scrollbar">
                {addresses &&
                  addresses.length > 0 &&
                  addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr?._id;
                    return (
                      <div
                        key={addr?._id}
                        className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                          isSelected
                            ? "bg-gray-100/80 border border-gray-300"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery_address"
                          className="w-4 h-4 mt-1 accent-black cursor-pointer"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr?._id)}
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <p className="font-bold text-sm text-gray-900">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <span className="bg-gray-200 text-[10px] px-2 py-0.5 rounded font-bold text-gray-700 uppercase tracking-wide">
                              {addr.apartment || "HOME"}
                            </span>
                            <p className="font-bold text-sm text-gray-900 sm:ml-2">
                              {addr.phoneNumber}
                            </p>
                          </div>

                          <p className="text-sm mt-1.5 text-gray-600 leading-relaxed">
                            {addr.address}, {addr.city}, {addr.country} -{" "}
                            <span className="font-semibold text-gray-900">
                              {addr.pinCode}
                            </span>
                          </p>

                          {isSelected && (
                            <button
                              onClick={() => setActiveStep(3)}
                              className="mt-4 w-full sm:w-auto bg-[#fb641b] hover:bg-[#e55813] text-white font-bold py-3 px-8 rounded-md shadow-sm uppercase text-sm transition-all"
                            >
                              Deliver Here
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleEdit(addr?._id)}
                          className="text-black font-bold text-xs uppercase hover:underline transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 text-black hover:text-gray-700 font-bold text-sm p-4 mt-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Plus size={18} /> Add a new address
              </button>
            </div>
          </CheckoutStep>

          <div
            className={`${activeStep === 3 ? "sticky top-[72px] z-20" : ""}`}
          >
            <CheckoutStep
              number={"3"}
              title={"Order Summary"}
              isActive={activeStep === 3}
              isCompleted={activeStep > 3}
              onEdit={() => setActiveStep(3)}
            >
              <OrderSummary
                orderItems={items}
                deliveryAddress={selectedAddress}
                totalSavings={totalSavings}
              />
            </CheckoutStep>
          </div>
        </div>

        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingAddressId={editingAddressId}
          addresses={addresses}
          onAddressSaved={handleAddressSaved}
        />

        <aside className="w-full lg:w-[22rem] xl:w-[24rem] lg:sticky lg:top-[72px] self-start">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden font-sans">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-gray-500 font-bold uppercase text-xs tracking-wider">
                Price Details
              </h2>
            </div>

            <div className="px-6 py-5 bg-white space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 border-b border-dotted border-gray-300 cursor-help">
                  {`Price (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
                </span>
                <span className="text-gray-900 font-medium">
                  ₹{totals.totalMRP.toLocaleString()}
                </span>
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="flex justify-between items-center text-base">
                <span className="text-gray-900 font-bold">Total Payable</span>
                <span className="text-gray-900 font-bold text-xl">
                  ₹{totals?.totalPaid.toLocaleString()}
                </span>
              </div>
            </div>

            {totalSavings > 0 && (
              <div className="px-6 py-3.5 bg-emerald-50 border-t border-b border-emerald-100">
                <p className="text-emerald-700 font-semibold text-xs sm:text-sm">
                  Your Total Savings on this order ₹
                  {totalSavings?.toLocaleString()}
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center gap-3">
              <div className="flex-shrink-0 text-gray-600">
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Safe and Secure Payments. Easy returns.
                <br />
                100% Authentic products.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CheckOutPage;
