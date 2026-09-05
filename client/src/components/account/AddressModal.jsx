import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useCountryCodes from "../../hooks/useCountryCodes.jsx";
import useCountryStates from "../../hooks/useCountryStates.jsx";
import { createAddress, updateAddress } from "../../services/addressService.js";

const AddressModal = ({
  isOpen,
  onClose,
  editingAddressId = null,
  addresses,
  onAddressSaved,
}) => {
  console.log("editingAddressIds", editingAddressId);
  const { countries } = useCountryCodes();
  const { states, fetchStates } = useCountryStates();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const dropdownRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "India",
    state: "",
    pinCode: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // clear error when user starts typing:
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const addressData = {
        ...formData,
        isDefault: isDefaultAddress,
      };

      // if form is in editing mode :
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressData);
        onAddressSaved?.();
      } else {
        await createAddress(addressData);
        onAddressSaved?.();
      }

      // reset form after update or add (addresses)
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        country: "",
        state: "",
        pinCode: "",
        phoneNumber: "",
      });

      setIsDefaultAddress(false);
      onClose();

      // optionally: show the success message :
      alert(
        editingAddressId
          ? "Address Updated Successfully!"
          : "Address Saved Successfully!",
      );
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default country to India on initial load
  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const defaultCountry = countries.find(
        (country) => country.name === "India",
      );
      setSelectedCountry(defaultCountry || countries);

      setFormData((prev) => ({
        ...prev,
        country: defaultCountry?.name,
        // optionally reset state when country changes
        state: "",
      }));
    }
  }, [countries, selectedCountry]);

  useEffect(() => {
    if (selectedCountry) {
      console.log("selectedCountry", selectedCountry);
      fetchStates(selectedCountry.code);
      setSelectedState("");
    }
  }, [selectedCountry, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset errors when modal opens or when switching between add/edit modes
  // useEffect(() => {
  //   if (isOpen) {
  //     setErrors({});
  //     setFormData({
  //       firstName: "",
  //       lastName: "",
  //       address: "",
  //       apartment: "",
  //       city: "",
  //       country: "India",
  //       pinCode: "",
  //       phoneNumber: "",
  //     });
  //   }
  // }, [isOpen, editingAddressId]);

  // // Load address data if editing
  // useEffect(() => {
  //   if (editingAddressId && addresses.length > 0) {
  //     console.log("edit mode ?", editingAddressId);
  //     console.log("editing address ", addresses);
  //     const addressToEdit = addresses.find(
  //       (address) => address._id === editingAddressId,
  //     );
  //     console.log("addressToEdit", addressToEdit);
  //     setFormData({
  //       firstName: addressToEdit.firstName || "",
  //       lastName: addressToEdit.lastName || "",
  //       address: addressToEdit.address || "",
  //       apartment: addressToEdit.apartment || "",
  //       city: addressToEdit.city || "",
  //       country: addressToEdit.country || "",
  //       state: addressToEdit.state || "",
  //       pinCode: addressToEdit.pinCode || "",
  //       phoneNumber: addressToEdit.phoneNumber || "",
  //     });

  //     setIsDefaultAddress(addressToEdit.isDefault || false);
  //     setSelectedState(addressToEdit.state);
  //     setErrors({});
  //   }
  // }, [editingAddressId, addresses]);

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});

    if (editingAddressId && addresses.length > 0) {
      const addressToEdit = addresses?.find(
        (address) => address?._id === editingAddressId,
      );

      if (addressToEdit) {
        setFormData({
          firstName: addressToEdit.firstName || "",
          lastName: addressToEdit.lastName || "",
          address: addressToEdit.address || "",
          apartment: addressToEdit.apartment || "",
          city: addressToEdit.city || "",
          country: addressToEdit.country || "India",
          state: addressToEdit.state || "",
          pinCode: addressToEdit.pinCode || "",
          phoneNumber: addressToEdit.phoneNumber || "",
        });

        setIsDefaultAddress(addressToEdit?.isDefault || false);
        setSelectedState(addressToEdit?.state || "");

        const matchingCountry = countries?.find((country) => {
          return country?.name === addressToEdit?.country;
        });

        if (matchingCountry) {
          setSelectedCountry(matchingCountry);
        }
      }
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        country: "India",
        state: "",
        pinCode: "",
        phoneNumber: "",
      });

      setIsDefaultAddress(false);
      setSelectedState("");
    }
  }, [isOpen, editingAddressId, addresses, countries]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    const value = typeof country === "string" ? country : country.name;

    setFormData((prev) => ({
      ...prev,
      country: value,
      // optionally reset state when country changes
      state: "",
    }));

    setIsDropDownOpen(false);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, state: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // PIN code validation
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      newErrors.pinCode = "PIN code must be 6 digits";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    console.log("error state", Object.keys(newErrors).length);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {" "}
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 pt-4 pl-6">
              {editingAddressId ? "Edit Address" : "Add Address"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-3"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-start gap-2 transition-all duration-500 mb-4">
              <input
                type="checkbox"
                className="w-5 h-4 transition-all duration-500 ease-in-out"
                checked={isDefaultAddress}
                onChange={(e) => setIsDefaultAddress(e.target.checked)}
              />{" "}
              <p>This is my default address</p>
            </div>
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="relative w-full">
                <select
                  className={`w-full h-full appearance-none px-4 pr-10 py-4 placeholder:text-gray-600 bg-white border border-gray-300 rounded-lg focus:outline-sky-700 ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`} // Fixed: className for React
                  value={selectedCountry?.name || ""} // Bind to selected name (add useState for selectedCountry)
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const selectedCountryObj = countries
                      .filter(
                        (country, index, self) =>
                          index ===
                          self.findIndex((c) => c.code === country.code), // keep first occurrence
                      )

                      .find((country) => country.name === selectedName);

                    console.log("selectedCountryObj :", selectedCountryObj);
                    if (selectedCountryObj) {
                      handleCountrySelect(selectedCountryObj); // Now passes full object
                    }
                  }}
                >
                  <option value="" disabled>
                    Choose a Country...
                  </option>
                  {countries.map((country) => (
                    <>
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    </>
                  ))}
                </select>

                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {errors.country && (
                  <p className="text-red-600 text-sm mt-1">{errors.country}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 py-4">
              {" "}
              {/* Name */}
              <div className="">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 placeholder:text-gray-600 border rounded-lg focus:outline-sky-700 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="First name"
                />{" "}
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 placeholder:text-gray-600 border border-gray-300 rounded-lg focus:outline-sky-700"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-2 w-full flex flex-col items-center justify-between gap-4">
              <div className="w-full">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 placeholder:text-gray-600 border rounded-lg focus:outline-sky-700 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Address"
                />

                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className="w-full px-4 py-4 placeholder:text-gray-600 border border-gray-300 rounded-lg focus:outline-sky-700"
                placeholder="Apartment, suite, etc (optional)"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 py-2">
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 placeholder:text-gray-600 border rounded-lg focus:outline-sky-700 ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <select
                  name="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  disabled={!selectedCountry || states.length === 0}
                  className={`w-full appearance-none rounded-lg border bg-white px-4 py-4 pr-10 text-gray-800 shadow-sm transition-all duration-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 hover:border-gray-400 cursor-pointer ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <option value="" disabled>
                    Choose a state...
                  </option>
                  {states.map((state) => (
                    <option
                      key={state.name}
                      value={state.name}
                      className="py-2"
                    >
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 placeholder:text-gray-600 border rounded-lg focus:outline-sky-700 ${
                    errors.pinCode ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="PIN code"
                />{" "}
                {errors.pinCode && (
                  <p className="text-red-600 text-sm mt-1">{errors.pinCode}</p>
                )}
              </div>
            </div>

            <div className="w-full pb-3 relative">
              <div className="flex flex-col md:flex-row border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-sky-200">
                <button
                  onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                  className="inline-flex justify-between items-center gap-2 px-4 py-4 bg-gray-50 border-r rounded-l-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <img src={selectedCountry?.flag} className="w-6 h-4" />
                    <span className="font-semibold">
                      {selectedCountry?.code}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {isDropDownOpen && (
                  <ul className="absolute left-0 bottom-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {countries
                      .filter(
                        (country, i, self) =>
                          i === self.findIndex((c) => c.code === country.code),
                      )
                      .map((country) => (
                        <li key={country.code}>
                          <button
                            onClick={() => handleCountrySelect(country)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100"
                          >
                            <img src={country.flag} className="w-6 h-4" />
                            <span className="font-semibold">
                              {country.code}
                            </span>
                            <span className="flex-1">{country.name}</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                )}

                {/* RIGHT: Phone Input */}
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="flex-1 flex-shrink px-4 py-4 outline-none rounded-r-lg placeholder:text-gray-600"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className={`px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressModal;
