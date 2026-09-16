import { Package } from "lucide-react";

const ProductCard = ({ product, onClick }) => {
  const imageUrl = product?.images[0].url || product.image || "";

  return (
    <button
      onClick={() => onClick?.(product)}
      className="text-left hover:shadow-lg transition-shadow bg-white rounded-lg p-3 border border-gray-200"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product?.name || "Product"}
          className="w-full h-50 rounded mb-2 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
          <Package className="text-gray-400" size={32} />
        </div>
      )}

      <h4 className="font-medium text-sm line-clamp-2 mb-1 text-black font-sans">
        {product?.name}
      </h4>

      <div className="flex items-center gap-2 mt-1">
        {product?.discountedPrice ? (
          <>
            <span className="text-red-600 font-semibold text-sm">
              ${product.discountPrice}
            </span>
            <span className="text-gray-400 text-xs line-through">
              ${product.price}
            </span>
          </>
        ) : (
          <span className="font-semibold text-sm">${product.price}</span>
        )}
      </div>
    </button>
  );
};

const SearchResults = ({ products = [], searchTerm = "", onProductLink }) => {
  if (searchTerm && products.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg">No products found for "{searchTerm}"</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-500">
          {" "}
          Products ({products.length} results)
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products?.map((p) => (
          <ProductCard
            key={p?._id || p?.name}
            product={p}
            onClick={onProductLink}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
