import { Link, useParams } from "react-router-dom";
import { ProductSkeleton } from "./ProductSkeleton";

export const FilteredProducts = ({ params, loading, error, products = [] }) => {
  const { categorySlug } = useParams();

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/&/g, "and") // replace &
      .replace(/\//g, "-") // replace /
      .replace(/\s+/g, "-") // replace spaces
      .replace(/[^\w-]+/g, ""); // remove non-word chars
  };

  const createProductSlug = (productName, productId) => {
    return `${slugify(productName)}-${productId}`;
  };

  const getProductLink = (product) => {
    const productSlug = createProductSlug(product?.name, product?._id);
    if (params) {
      console.log("params", params);
      return `/products/${slugify(productSlug)}`;
    } else {
      return `/collections/${categorySlug}/products/${slugify(productSlug)}`;
    }
  };

  if (loading) {
    return <ProductSkeleton count={8} />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">{error}</div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products found matching your selection.
      </div>
    );
  }

  return (
    <div className="mx-auto py-5 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14 justify-items-center">
        {products.map((product, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center hover:border hover:border-black transition-all cursor-pointer"
            >
              <Link to={getProductLink(product)}>
                <div className="p-3">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name || "Product"}
                      className="w-full h-84 object-cover object-center rounded-lg"
                    />
                  ) : (
                    <img
                      src="/placeholder.jpg"
                      alt="No image available"
                      className="w-full h-64 object-cover object-center rounded-lg"
                    />
                  )}
                </div>
              </Link>
              <div className="text-center p-2">
                <h3 className="text-xl font-medium text-gray-900">
                  {product.name}
                </h3>
                <div className="mt-1">
                  <span className="text-xl text-gray-500 line-through font-sans mt-1">
                    ₹{product.price}
                  </span>
                  <span className="text-xl font-semibold text-red-600 ml-2 mt-1">
                    ₹{product.discountPrice}
                  </span>
                </div>
                <span className="mt-2">{product.colors.length} colors</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
