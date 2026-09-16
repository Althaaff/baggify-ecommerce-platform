import { Trash2, Upload, X, Plus, Tag as TagIcon, Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
  categoryService,
  productService,
  uploadService,
} from "../../services/productsService.js";
import useDebounce from "../../hooks/useDebounce.jsx";
import toast from "react-hot-toast";

const AddProductForm = ({
  isModalOpen,
  closeModal,
  initialData,
  isEditingMode,
  onSuccess,
  editableProduct,
}) => {
  const { getAllProducts } = productService;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state with ALL model fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    images: [],
    sizes: [],
    colorName: "",
    colorVariants: [],
    colors: [],
    stock: "",
    sku: "",
    isFeatured: false,
    isNewArrival: false,
    tags: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [currentSize, setCurrentSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // variant search state :
  const [variantSearchQuery, setVariantSearchQuery] = useState("");
  const [variantSearchResult, setVariantSearchResult] = useState([]);
  const [isSearchVariants, setIsSearchVariants] = useState(false);

  // debounce search variant query:
  const debouncedSearchQuery = useDebounce(variantSearchQuery);

  // Predefined options for bags
  const commonSizes = ["Small", "Medium", "Large", "XL", "One Size"];
  const commonColors = [
    "Black",
    "Brown",
    "Navy",
    "Beige",
    "Red",
    "Grey",
    "White",
  ];

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        colorName: initialData?.colorName || "",
        colorVariants: initialData?.colorVariants || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        brand: "",
        images: [],
        sizes: [],
        colors: [],
        colorName: "",
        colorVariants: [],
        stock: "",
        sku: "",
        isFeatured: false,
        isNewArrival: false,
        tags: [],
      });
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const categoryParams = {
        isActive: true,
        parent: "none",
      };
      const response = await categoryService.getAllCategories(categoryParams);

      if (response.success) {
        setCategories(response.data);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);

      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError(err.response.data.message || "Failed to load categories");
      } else if (err.request) {
        // Request made but no response received
        setError("No response from server. Please check your connection.");
      } else {
        // Something else happened
        setError("Failed to load categories");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (editableProduct) {
      editableProduct();
    }

    setFormData({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      brand: "",
      images: [],
      sizes: [],
      colors: [],
      colorName: "",
      colorVariants: [],
      stock: "",
      sku: "",
      isFeatured: false,
      isNewArrival: false,
      tags: [],
    });
    setImageFiles([]);
    setVariantSearchQuery("");
    setVariantSearchResult([]);
    setError("");
    setSuccess("");
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantSearch = async (query) => {
    setVariantSearchQuery(query);
  };

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setVariantSearchResult([]);
      return;
    }

    const fetchVariants = async () => {
      try {
        setIsSearchVariants(true);

        const response = await getAllProducts({ search: debouncedSearchQuery });
        const results = response?.data?.products || [];

        const filtered = results.filter((prod) => prod?._id !== formData?._id);
        setVariantSearchResult(filtered);
      } catch (error) {
        console.error("Variant search error:", error);
      } finally {
        setIsSearchVariants(false);
      }
    };

    fetchVariants();
  }, [debouncedSearchQuery, formData?._id]);

  const handleAddVariantProduct = (selectedProduct) => {
    const currentVariants = formData.colorVariants || [];
    const exists = currentVariants.some(
      (item) =>
        (typeof item === "object" ? item?._id : item) === selectedProduct?._id,
    );

    if (!exists) {
      setFormData((prev) => ({
        ...prev,
        colorVariants: [...currentVariants, selectedProduct],
      }));
    }

    setVariantSearchQuery("");
    setVariantSearchResult([]);
  };

  const handleRemoveVariantProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      colorVariants: (prev.colorVariants || []).filter(
        (item) => (typeof item === "object" ? item?._id : item) !== productId,
      ),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const invalid = files.find((file) => !file.type.startsWith("image/"));

    if (invalid) {
      setError("Please upload only image files");
      return;
    }
    // clear error
    setError("");

    try {
      setIsUploadingImages(true);

      const uploadedImages = await uploadImages(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...(uploadedImages || [])],
      }));
    } catch (error) {
      setIsUploadingImages(false);
      setError(error?.response?.data?.message || "Image upload failed");
    } finally {
      setIsUploadingImages(false);

      // allows selecting the same file again
      e.target.value = "";
    }
  };

  const removeImage = async (imgIndex) => {
    // removing image from local react state:
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imgIndex),
    }));

    if (onSuccess) {
      onSuccess();
    }
  };

  // Add size
  const addSize = (size) => {
    const sizeToAdd = size || customSize.trim();
    if (sizeToAdd && !formData.sizes.includes(sizeToAdd)) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeToAdd],
      }));
      setCurrentSize("");
      setCustomSize("");
    }
  };

  const removeSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  // Add color
  const addColor = (color) => {
    const colorToAdd = color || customColor.trim();

    if (colorToAdd && !formData.colors.includes(colorToAdd)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorToAdd],
      }));
      setCurrentColor("");
      setCustomColor("");
    }
  };

  const removeColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // upload images :
  const uploadImages = async (files) => {
    // if no files uploaded dont hit API
    if (!files || files.length === 0) return [];
    try {
      const response = await uploadService.uploadMultipleImages(files);

      if (response.success) {
        const imagesData = response.data.images;

        return imagesData || [];
      }
    } catch (error) {
      console.error("Image upload failed:", error.message);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Validation
      if (!formData.name.trim()) {
        setError("Product name is required");
        setLoading(false);
        return;
      }
      if (!formData.category) {
        setError("Please select a category");
        setLoading(false);
        return;
      }
      if (formData.images.length === 0 && imageFiles.length === 0) {
        setError("At least one image is required");
        setLoading(false);
        return;
      }

      const newUploadedUrls = await uploadImages(imageFiles);

      const existingDbImages = formData.images.filter(
        (img) => typeof img === "object" && img.url,
      );

      const finalImages = [...newUploadedUrls, ...existingDbImages];

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : undefined,
        category: formData.category?._id || formData.category,
        brand: formData.brand.trim(),
        stock: Number(formData.stock),
        sku: formData.sku.toUpperCase(),
        sizes: formData.sizes,
        colors: formData.colors,
        colorName: formData.colorName.trim(),
        colorVariants: (formData.colorVariants || []).map((v) =>
          typeof v === "object" ? v?._id : v,
        ),
        tags: formData.tags,
        images: finalImages,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
      };

      const isEditing = !!formData?._id;
      console.log("isEditing", isEditing);

      const response = isEditing
        ? await productService.updateProduct(formData?._id, payload)
        : await productService.createProduct(payload);

      console.log("response", response);

      if (response?.success) {
        onSuccess?.();

        setSuccess(
          isEditing
            ? "Product Updated Successfully"
            : "Product Created Successfully",
        );
        if (isEditing) {
          toast.success("Product Updated Successfully");
        } else {
          toast.success("Product Created Successfully");
        }

        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (!isModalOpen) {
    return null;
  }

  const ImageSkeleton = () => (
    <div className="w-full h-32 rounded-lg border-2 border-gray-200 bg-gray-100 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
        Uploading...
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-all">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-8 sm:py-6 flex justify-between items-center z-10 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {isEditingMode ? "Update Product" : "Add Product"}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Complete all product details
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            <X size={22} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-8 sm:py-6 overflow-y-auto flex-1 space-y-6 sm:space-y-8">
          {/* error/success messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <Info size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <Info size={18} className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Leather Handbag"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed product description..."
                  rows="4"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="BAG-001-BLK"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Baggify"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category?._id || formData.category || ""}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                  disabled={loading}
                >
                  <option value="">
                    {loading ? "Loading..." : "Select Category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                  Must be less than regular price
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Product Variants
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                  Sizes
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={currentSize}
                      onChange={(e) => setCurrentSize(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">Select size</option>
                      {commonSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => addSize(currentSize)}
                      className="px-3.5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-shrink-0 flex items-center justify-center"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder="Or enter custom size..."
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addSize(customSize))
                      }
                      className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 text-xs font-semibold flex-shrink-0"
                      type="button"
                      onClick={() => addSize()}
                    >
                      <Plus size={16} />
                      Custom
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1.5"
                    >
                      {size}
                      <button
                        onClick={() => removeSize(size)}
                        className="hover:text-blue-900"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                  Colors
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={currentColor}
                      onChange={(e) => setCurrentColor(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">Select color</option>
                      {commonColors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => addColor(currentColor)}
                      className="px-3.5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-shrink-0 flex items-center justify-center"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addColor())
                      }
                      placeholder="Or enter custom color..."
                      className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 text-xs font-semibold flex-shrink-0"
                      onClick={() => addColor()}
                    >
                      <Plus size={16} />
                      Custom
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.colors.map((color) => (
                    <span
                      key={color}
                      className="px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1.5"
                    >
                      {color}
                      <button
                        onClick={() => removeColor(color)}
                        className="hover:text-purple-900"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      This Product's Color / Variant Name
                    </label>
                    <input
                      type="text"
                      name="colorName"
                      value={formData.colorName || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., Forest Green"
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                      Label displayed on PDP swatch hover.
                    </p>
                  </div>

                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Link Other Product Color Variants
                    </label>

                    <input
                      type="text"
                      value={variantSearchQuery}
                      onChange={(e) => handleVariantSearch(e.target.value)}
                      placeholder="Search by SKU or Name..."
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />

                    {variantSearchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto z-30">
                        {isSearchVariants ? (
                          <div className="p-3 text-center text-xs text-gray-500">
                            Searching variants...
                          </div>
                        ) : variantSearchResult.length > 0 ? (
                          variantSearchResult.map((prod) => (
                            <div
                              key={prod?._id}
                              onClick={() => handleAddVariantProduct(prod)}
                              className="flex items-center gap-3 p-2.5 sm:p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                            >
                              <img
                                src={
                                  typeof prod.images[0] === "object"
                                    ? prod.images[0]?.url
                                    : prod.images[0]
                                }
                                alt={prod.name}
                                className="w-9 h-9 object-cover rounded border flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                  {prod.name}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate">
                                  SKU: {prod.sku} | Color:{" "}
                                  {prod.colorName || "N/A"}
                                </p>
                              </div>
                              <Plus
                                size={16}
                                className="text-blue-600 flex-shrink-0"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-xs text-gray-500">
                            No matching products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Linked Variant Products (
                    {formData.colorVariants?.length || 0})
                  </label>

                  {formData.colorVariants &&
                  formData.colorVariants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.colorVariants.map((item, idx) => {
                        const isObj = typeof item === "object";
                        const id = isObj ? item?._id : item;
                        const name = isObj ? item.name : `Product ID: ${id}`;
                        const colorName = isObj ? item.colorName : "";
                        const imgSrc = isObj
                          ? typeof item.images[0] === "object"
                            ? item.images[0]?.url
                            : item.images[0]
                          : "";

                        return (
                          <div
                            key={id || idx}
                            className="flex items-center justify-between p-2.5 border border-purple-200 bg-purple-50/50 rounded-lg gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={name}
                                  className="w-9 h-9 object-cover rounded border border-gray-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 flex-shrink-0">
                                  N/A
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                  {name}
                                </p>
                                <span className="inline-block text-[10px] font-medium text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                  Variant: {colorName || "Unnamed"}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveVariantProduct(id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3.5 border-2 border-dashed border-gray-200 rounded-lg text-center text-xs text-gray-400">
                      No linked color variant products added yet. Use the search
                      bar above to link options.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Tags & Marketing
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="e.g., waterproof, leather..."
                    className="flex-1 min-w-0 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-xs font-semibold flex-shrink-0"
                  >
                    <TagIcon size={16} />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-800 rounded-full text-xs font-medium flex items-center gap-1.5"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-green-900"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Featured Product
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    New Arrival
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Product Images *
            </h3>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                {formData.images.map((img, index) => {
                  const imgSrc = typeof img === "object" ? img?.url : img;
                  return (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={imgSrc}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1.5 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all p-4 text-center">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-7 h-7 sm:w-9 sm:h-9 text-gray-400 mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {isUploadingImages
                    ? "Uploading..."
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm px-4 py-3 sm:px-8 sm:py-4 flex gap-3 flex-shrink-0 z-10">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditingMode
              ? loading
                ? "Updating..."
                : "Update Product"
              : loading
                ? "Creating..."
                : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
