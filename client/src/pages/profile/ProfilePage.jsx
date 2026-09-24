import { Edit2, Plus, Info, Star, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import ProfileModal from "../../components/account/ProfileModal.jsx";
import AddressModal from "../../components/account/AddressModal.jsx";
import Layout from "../../components/layout/Layout.jsx";
import { getCurrentUser } from "../../utils/getUser.js";
import {
  deleteAddress,
  setDefaultAddress,
} from "../../services/addressService.js";
import { useAddresses } from "../../hooks/useAddresses.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import AddressSkeleton from "../../components/account/AddressSkeleton.jsx";

const ProfilePage = () => {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const { addresses, addressLoading, loadAddresses } = useAddresses();
  const { email } = getCurrentUser();
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // user from hook :
  const { user } = useAuth();

  const handleEdit = (id) => {
    setEditingAddressId(id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        setAddressError(null);

        await deleteAddress(id);
        await loadAddresses();
        console.log("Address deleted successfully!");
      } catch (error) {
        console.error("Error deleting address:", error);
        setAddressError("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      await loadAddresses();
      console.log("Default address updated in IndexedDB");
    } catch (error) {
      console.error("Error setting default:", error);
      alert("Failed to set default address");
    }
  };

  const handleCloseModal = () => {
    setEditingAddressId(null);
    setShowModal(false);
  };

  return (
    <>
      <Layout>
        <div className={`min-h-screen bg-gray-50 p-8`}>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-gray-900 mb-8 text-2xl font-bold">Profile</h1>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="" className="text-sm text-black font-medium">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : "Name"}
                  </label>
                  <button
                    onClick={() => setEditProfileOpen(true)}
                    className="text-blue-900 font-bold"
                  >
                    <Edit2
                      size={12}
                      style={{ font: "bolder" }}
                      onClick={() => setEditProfileOpen(true)}
                    />
                  </button>
                </div>
              </div>

              <div className="mb-12">
                <label htmlFor="" className="text-sm text-gray-600  block mb-2">
                  Email
                </label>
                <p className="text-gray-900">{email}</p>
              </div>

              <div>
                <div className="flex items-center justify-start gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Addresses
                  </h2>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                </div>

                {addressError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{addressError}</p>
                  </div>
                )}

                {addressLoading ? (
                  <AddressSkeleton />
                ) : addresses.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                    <Info size={20} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">No addresses added</span>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map((address) => {
                      console.log("default address :", address);
                      return (
                        <div
                          className={`border rounded-lg p-6 transition-all ${
                            address.isDefault
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-300 hover:shadow-md"
                          }`}
                          key={address._id}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start gap-2 mb-3">
                                <h3 className="text-lg font-semibold text-black">
                                  {address.firstName} {address.lastName}
                                </h3>
                                {address.isDefault && (
                                  <span className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                    <Star size={12} fill="white" />
                                    Default
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 text-gray-700">
                                <p>{address.address}</p>
                                {address.apartment && (
                                  <p>{address.apartment}</p>
                                )}
                                <p>
                                  {address.city}, {address.state} -{" "}
                                  {address.pinCode}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.country}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                  📞 {address.phoneNumber}
                                </p>
                              </div>

                              {!address.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(address._id)}
                                  className="text-sm text-blue-600 hover:underline mt-3"
                                >
                                  Set as default
                                </button>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(address._id)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit address"
                              >
                                <Edit size={20} />
                              </button>
                              <button
                                onClick={() => handleDelete(address._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete address"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                            Added:{" "}
                            {new Date(address.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ProfileModal
          isOpen={editProfileOpen}
          editProfileOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
        />

        <AddressModal
          isOpen={showModal}
          onClose={handleCloseModal}
          editingAddressId={editingAddressId}
          addresses={addresses}
          onAddressSaved={() => loadAddresses()}
        />
      </Layout>
    </>
  );
};

export default ProfilePage;
