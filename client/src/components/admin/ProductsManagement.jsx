import {
  Package,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  Tag,
  Edit2,
  X,
  Upload,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import EditProduct from "./EditProduct.jsx";
import {
  categoryService,
  productService,
  uploadService,
} from "../../services/productsService.js";

const ProductsManagement = () => {
  const { getProductDetails } = productService;

  // Data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Ui States
  const [activeTab, setActiveTab] = useState("categories");
  const [loading, setLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // for pagination :
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // category modal :
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: false,
    parentCategory: null,
    image: null,
    imageId: null,
    imagePreview: "",
  });

  // product modal (edit product):
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // derived values :
  const activeCategories = categories.filter((c) => c.isActive).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Parent categories only — for the "select parent" dropdown in modal
  // Filter out the category being edited so it can't be its own parent
  const parentCategories = categories.filter(
    (c) => !c.parentCategory && c._id !== editingCategoryId,
  );

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // auto clear messages after 3 seconds :
  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error]);

  // prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isCategoryModalOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCategoryModalOpen]);

  // initial fetches :
  useEffect(() => {
    fetchCategories();
  }, []);

  // fetch products :
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const categoryParams = {
        isActive: true,
        parent: "none",
      };

      const response = await categoryService.getAllCategories(categoryParams);

      if (response.success) {
        const parentCats = response.data;

        const flat = [];

        parentCats.forEach((parent) => {
          flat.push(parent);

          (parent.subcategories || []).forEach((sub) => {
            flat.push({
              ...sub,
              parentCategory: { _id: parent?._id, name: parent.name },
            });
          });
        });

        setCategories(flat);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const productParams = {
        page,
        limit: 10,
      };

      const response = await productService.getAllProducts(productParams);

      if (response.success) {
        setProducts(response.data.products);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // category modal helpers :
  const openAddCategoryModal = () => {
    setIsCategoryEditing(false);
    setEditingCategoryId(null);

    setCategoryForm({
      name: "",
      description: "",
      isActive: true,
      parentCategory: null,
      image: null,
      imageId: null,
      imagePreview: "",
    });

    setError("");
    setSuccess("");
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category) => {
    console.log("edit category", category);
    setEditingCategoryId(category?._id);
    setIsCategoryEditing(true);
    setCategoryForm({
      name: category?.name,
      description: category?.description || "",
      isActive: category?.isActive,
      parentCategory: category?.parentCategory?._id || "",
      image: category?.image,
      imageId: category?.imageId,
      imagePreview: category?.image || "", // showing existing image as preview
    });

    setError("");
    setSuccess("");
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setIsCategoryEditing(false);
    setEditingCategoryId(null);

    setCategoryForm({
      name: "",
      description: "",
      isActive: true,
      parentCategory: null,
      image: null,
      imageId: null,
      imagePreview: "",
    });

    setError("");
    setSuccess("");
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // clear existing error message :
    setError("");

    const tempPreview = URL.createObjectURL(file);

    setCategoryForm((prev) => ({
      ...prev,
      imagePreview: tempPreview,
    }));

    try {
      setIsImageUploading(true);
      const response = await uploadService.uploadCategoryImage(file);
      console.log("response", response);

      if (response?.success) {
        const uploadedImage = response.data?.image;
        console.log("uploadedImage", uploadedImage);

        setCategoryForm((prev) => ({
          ...prev,
          image: uploadedImage?.url,
          imageId: uploadedImage?.public_id,
          imagePreview: uploadedImage?.url,
        }));
      }
    } catch (error) {
      console.error("Image upload faield:", error);
      setError(error?.response?.data?.message || "Failed to upload image");

      // reset if upload failed :
      setCategoryForm((prev) => ({
        ...prev,
        imagePreview: "",
      }));
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name.trim()) {
      setError("Category name is required");
      return;
    }

    if (isImageUploading) {
      setError("Please wait for the image upload to complete");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        isActive: categoryForm.isActive,
        image: categoryForm.image || null,
        imageId: categoryForm.imageId || null,
        parentCategory: categoryForm.parentCategory || null,
      };

      if (isCategoryEditing) {
        const response = await categoryService.updateCategory(
          payload,
          editingCategoryId,
        );

        if (response?.success) {
          setSuccess("Category updated successfully!");
          await fetchCategories();

          setTimeout(() => {
            closeCategoryModal();
          }, 1500);
        }
      } else {
        const response = await categoryService.createCategory(payload);
        if (response?.success) {
          setSuccess("Category Created Successfully");
          await fetchCategories();
          setTimeout(() => closeCategoryModal(), 1500);
        }
      }
    } catch (error) {
      console.log("categoryData", error);
      setError(
        error?.response?.data.message ||
          `Failed to ${isCategoryEditing ? "update" : "create"} category `,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`))
      return;

    // otimistic update of delete category
    const previousCategories = categories;
    setCategories((prev) => prev.filter((c) => c._id !== categoryId));
    try {
      await categoryService.deleteCategory(categoryId);
      setSuccess("Category deleted successfully");
    } catch (error) {
      // rollback on failure
      setCategories(previousCategories);
      setError(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleToggleCategoryStatus = async (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);

    if (!category) return;

    const newStatus = !category.isActive;

    // optimistic update :
    setCategories((prev) =>
      prev.map((c) =>
        c._id === categoryId ? { ...c, isActive: newStatus } : c,
      ),
    );

    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("isActive", newStatus);
      await categoryService.updateCategory(formData, categoryId);
    } catch (error) {
      console.error(error);
      // rollback on failure
      setCategories((prev) =>
        prev.map((c) =>
          c._id === categoryId ? { ...c, isActive: !newStatus } : c,
        ),
      );
      setError("Failed to toggle category status");
    }
  };

  const handleCategoryInputChange = (event) => {
    setCategoryForm({
      ...categoryForm,
      parentCategory: event.target.value,
    });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsEditProductOpen(true);
  };

  const handleEditProduct = async (product) => {
    try {
      setError("");
      const response = await getProductDetails(product._id);

      if (response.success) {
        setEditingProduct(response.data);
        setIsEditProductOpen(true);
      } else {
        setError("Failed to load product details");
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      setError("Failed to load product details");
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (
      !window.confirm(`Are you sure you want to delete this "${productName}"?`)
    )
      return;

    // optimistic Ui updates :
    const previousProducts = products;
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    try {
      await productService.deleteProduct(productId);
      setSuccess("Product deleted successfully!");
    } catch (error) {
      // rollback
      setProducts(previousProducts);
      setError(error.response?.data?.message || "Failed to delete product!");
    }
  };

  // prevent scrolling :
  useEffect(() => {
    document.body.style.overflow = isCategoryModalOpen ? "hidden" : "unset";

    // cleanup :
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCategoryModalOpen]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen w-[90vh] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl w-full mx-auto">
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your products and categories
          </p>
        </div>

        <div className="bg-white rounded-t-xl p-6 shadow-sm border border-gray-200 border-b-0">
          <div className="flex border-gray-200 border-b">
            <button
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                activeTab === "categories"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => {
                setActiveTab("categories");
                setSearchTerm("");
              }}
            >
              <Tag size={20} />
              Categories
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("products");
                setSearchTerm("");
              }}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                activeTab === "products"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Package size={20} />
              All Products
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                {products.length}
              </span>
            </button>
          </div>
        </div>
        {/* start refactoring from here  */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {activeTab === "categories" ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Total Categories</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {categories.length}
                      </p>
                    </div>
                    <div className="h-12 w-px bg-gray-200" />
                    <div>
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-green-600">
                        {activeCategories}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {products.length}
                      </p>
                    </div>
                    <div className="h-12 w-px bg-gray-200" />
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{totalValue.toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={
                  activeTab === "categories"
                    ? openAddCategoryModal
                    : handleAddProduct
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
              >
                <Plus size={20} />
                Add {activeTab === "categories" ? "Category" : "Product"}
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {activeTab === "categories" && (
            <div className="overflow-x-auto">
              {loading && categories.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-blue-600" size={32} />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No categories found</p>
                  <p className="text-sm mt-1">
                    Create your first category to get started
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                {category.name.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-gray-900">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                            {category.slug}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          {category.parentCategory ? (
                            <div>
                              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full">
                                Subcategory
                              </span>

                              <p className="text-xs text-gray-500 mt-1">
                                Under: {category.parentCategory?.name || "—"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full">
                              Parent
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {category.description || "No description"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleToggleCategoryStatus(category._id)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                              category.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditCategoryModal(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Delete category"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCategory(
                                  category._id,
                                  category.name,
                                )
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete category"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "products" && (
            <>
              <div className="overflow-x-auto">
                {loading && products.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="animate-spin text-blue-600" size={32} />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No products found</p>
                    <p className="text-sm mt-1">
                      Add your first product to get started
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => {
                        return (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {product.images?.[0]?.url ? (
                                  <img
                                    src={product.images[0]?.url}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    {product.name?.charAt(0)}
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600 font-mono">
                                {product.sku}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-gray-900">
                                ₹{product.price}
                              </span>
                            </td>
                            <td className="px-6 py-4 w-full">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  product.stock < 20
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {product.stock} units
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {product.category?.name || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                  title="Edit product"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product._id,
                                      product?.name,
                                    )
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete product"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 border-t">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-gray-300 text-black font-bold hover:bg-gray-400"
                  }`}
                >
                  <ChevronLeft />
                </button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-gray-300 text-black font-bold"
                  }`}
                >
                  <ChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-100 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCategoryEditing ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {isCategoryEditing
                    ? "Update the category details below"
                    : "Fill in the category details below"}
                </p>
              </div>

              <button
                onClick={closeCategoryModal}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* inline error inside modal */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Handbags, Backpacks"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-semibold text-gray-700
                       mb-2"
                >
                  Parent Category (Optional)
                </label>

                <select
                  value={categoryForm.parentCategory}
                  onChange={handleCategoryInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">None (Top Level Category)</option>
                  {parentCategories.map((cat) => {
                    return (
                      <option value={cat._id} key={cat._id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select a parent to create a subcategory
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of this category..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  disabled={loading}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {categoryForm.description.length}/500 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Category Image
                </label>

                {isImageUploading ? (
                  <div className="mb-4 w-full h-48 rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center bg-gray-50">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    <span className="mt-2 text-sm text-gray-500 font-medium">
                      Uploading image...
                    </span>
                  </div>
                ) : (
                  categoryForm.imagePreview && (
                    <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={categoryForm.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryForm((prev) => ({
                            ...prev,
                            image: null,
                            imageId: null,
                            imagePreview: "",
                          }))
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        disabled={loading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )
                )}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />

                    <p className="text-sm text-gray-600 font-medium">
                      {isCategoryEditing
                        ? "Click to change image"
                        : "Click to upload category image"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  checked={categoryForm.isActive}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      isActive: e.target.checked,
                    })
                  }
                  disabled={loading}
                />
                <div>
                  <label
                    htmlFor="isActive"
                    className="text-gray-700 font-semibold text-sm"
                  >
                    Active Category
                  </label>

                  <p className="text-xs text-gray-500">
                    Only active categories will be visible on the website
                  </p>
                </div>
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {success}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={closeCategoryModal}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCategorySubmit}
                  disabled={loading || isImageUploading}
                  className="flex-1 px-6 py-3 font-semibold text-sm md:text-md rounded-lg flex items-center justify-center gap-2 transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-100"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      {isCategoryEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : isCategoryEditing ? (
                    "Update Category"
                  ) : (
                    "Add Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <EditProduct
        isModalOpen={isEditProductOpen}
        closeModal={() => {
          setIsEditProductOpen(false);
          setEditingProduct(null);
        }}
        initialData={editingProduct}
        isEditingMode={editingProduct !== null}
        onSuccess={() => fetchProducts(currentPage)}
        editableProduct={() => setEditingProduct(null)}
      />
    </div>
  );
};

export default ProductsManagement;
