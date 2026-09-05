import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getCurrentUser } from "../../utils/getUser";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

const ProfileModal = ({ isOpen, editProfileOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { email } = getCurrentUser();
  const { updateProfile } = authService;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: email,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load saved data when component mounts

  useEffect(() => {
    if (editProfileOpen) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: email || "",
      }));
    }
  }, [editProfileOpen]);

  // validate form :
  const validateForm = (formData) => {
    const errors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.firstName)) {
      errors.firstName = "First name can only contain letters and spaces";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.lastName)) {
      errors.lastName = "Last name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleSave = async (e) => {
    // handle save logic:
    e.preventDefault();

    // validate form :
    const validation = validateForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await updateProfile(formData);

      if (response.success) {
        const { user } = response.data;
        console.log("user", user);

        updateUser(user);

        // update local form state smoothly using the clean object
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName,
          lastName: user.lastName,
        }));
      }
    } catch (err) {
      toast.error("Profile update failed");
      console.error("profile update error", err);
    } finally {
      setLoading(false);
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // clear error when user starts typing :
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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
              Edit Profile
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
            {/* Name Fields */}
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-sky-700"
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <span className="text-red-400 text-xs font-sans ml-2">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-sky-700"
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <span className="text-red-400 text-xs font-sans">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-2">
                <input
                  type="email"
                  name="email"
                  disabled={true}
                  value={email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-400 border border-gray-300 rounded-lg focus:outline-sky-700 "
                  placeholder="Email"
                />
                {errors.email && (
                  <span className="text-red-400 text-xs font-sans">
                    {errors.email}
                  </span>
                )}
              </div>
              {/* Helper Text */}
              <p className="text-xs text-gray-500 mb-4 pl-2 font-sans font-normal">
                Email can't be edited
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 border border-gray-300 text-white bg-black rounded-lg transition-colors font-semibold"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
