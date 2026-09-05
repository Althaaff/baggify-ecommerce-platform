import { useEffect, useMemo, useState } from "react";
import AddToBagButton from "../../components/cart/AddToBag.jsx";
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";
import img4 from "../../assets/4.png";
import Accordion from "../../components/common/Accordion/Accordion.jsx";
import BagCollection from "../../components/products/BagCollection.jsx";
import ExploreLineUp from "../../components/products/ExploreLineup.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useNewArrivalProducts } from "../../hooks/useNewArrivals.jsx";
import { productService } from "../../services/productsService.js";
import { Loader } from "lucide-react";

const FALLBACK_PRODUCT_IMAGES = [
  "https://www.furjaden.com/cdn/shop/files/Website1_3113d602-93bc-4d6d-821b-ca88ffa14127.jpg?v=1725977380&width=1500",
  "https://www.furjaden.com/cdn/shop/files/Website2_d5dc29f1-3ce6-4549-bf2a-ce114930baea.jpg?v=1725977769&width=1500",
];

const ADD_IMAGES = [
  "https://www.furjaden.com/cdn/shop/files/BM99_Features_New.jpg?v=1724591279&width=550",
  "https://www.furjaden.com/cdn/shop/files/Discount_Web_Banner-03.jpg?v=1748262263&width=450",
];

const { getProductDetails } = productService;

const ProductDetailsPage = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: newArrivalProducts } = useNewArrivalProducts();

  const extractIdFromSlug = (slug) => {
    if (!slug) return null;

    const parts = slug.split("-");
    const lastPart = parts[parts.length - 1];

    // check is it valid mongodb object Id
    if (
      lastPart &&
      lastPart.length === 24 &&
      /^[a-f0-9]{24}$/i.test(lastPart)
    ) {
      return lastPart;
    }

    return lastPart && /^[a-f0-9]{24}$/i.test(lastPart) ? lastPart : slug;
  };

  // helper to generate SEO friendly URLs for variant navigation :
  const createProductSlug = (item) => {
    if (!item) return "";

    const cleanName = item?.name
      ? item.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : "product";

    return `${cleanName}-${item._id}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // extract id from slug
        const productId = extractIdFromSlug(productSlug);

        if (!productId) {
          throw new Error("Invalid product URL");
        }

        const response = await getProductDetails(productId);

        if (response.success) {
          setProduct(response.data);
        } else {
          setError("Failed to load product");
        }
      } catch (err) {
        console.error(err);
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const imageUrls = useMemo(() => {
    return product?.images?.length
      ? product?.images.map((img) => img.url)
      : FALLBACK_PRODUCT_IMAGES;
  }, [product?.images]);

  useEffect(() => {
    // reset selected image when images change
    setSelectedImage(0);
  }, [productSlug]);

  const productColors = useMemo(() => product?.colors || [], [product?.colors]);

  useEffect(() => {
    setSelectedColor(productColors[0] || "");
  }, [productColors]);

  const formatINR = (amount) =>
    typeof amount === "number"
      ? amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })
      : "";

  const price = typeof product?.price === "number" ? product.price : "";
  const discountPrice =
    typeof product?.discountPrice === "number" ? product.discountPrice : "";

  const hasDiscount =
    typeof price === "number" &&
    typeof discountPrice === "number" &&
    discountPrice < price;

  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;

  const displayName = [product?.name, selectedColor || productColors[0]]
    .filter(Boolean)
    .join(" | ");

  const info = [
    {
      img: img1,
      content: `You are currently viewing: ${selectedColor || "Default"}`,
    },
    { img: img2, content: "No1 Backpack Brand on AMAZON India" },
    { img: img3, content: "Delivered In 3-5 Days Across India" },
    { img: img4, content: "Over 1 Million Happy Customers" },
  ];

  const accordionData = [
    {
      title: "Description",
      content:
        product?.description ||
        "Meet India’s first official Paddle & Pickleball Bag—designed for players who take their game (and their gear) seriously. With a structured, high-performance build, this bag keeps your essentials protected, separated, and always within reach. A dedicated padded racket compartment prevents scratches and shock damage, while separate zones for shoes, water bottles, and sweaty gear keep things clean and organized.",
    },
    {
      title: "Warranty",
      content:
        "We believe in the quality of our gear as much as we believe in your sense of adventure. If your gear doesn’t meet your high standards, neither does it meet ours. We’ll make it right, so you can focus on the journey ahead.",
    },
    {
      title: "Return Policy",
      content:
        "We know that sometimes, even the best adventures hit a snag. If your new backpack or suitcase isn’t quite the right fit for your journey, don’t fret! Our Great Return Adventure is here to make sure you find exactly what you’re looking for with minimal hassle and maximum excitement.",
    },
  ];

  const handleVariantClick = (variant) => {
    const slug = createProductSlug(variant);

    navigate(`/products/${slug}`);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader className="animate-spin" color="gray" size={50} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-red-600 font-medium">
          {error || "Product not found"}
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 md:px-12 w-full py-8">
      <div className="flex flex-col lg:flex-row gap-8 justify-between max-w-7xl mx-auto">
        <div className="hidden md:flex flex-col gap-3 items-center">
          {imageUrls.map((imgSrc, index) => (
            <button
              key={`thumb-${index}`}
              className={`w-20 h-20 border transition-all rounded overflow-hidden ${
                selectedImage === index
                  ? "border-black ring-1 ring-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={imgSrc} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col items-center gap-6">
          <div className="w-full max-w-lg aspect-square bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden border border-gray-100">
            <img
              src={imageUrls[selectedImage]}
              alt={displayName}
              className="w-full h-full object-contain p-4"
            />
          </div>

          <div className="w-full max-w-lg hidden md:block">
            <Accordion data={accordionData} />
          </div>
        </div>
        <div className="w-full lg:w-[420px] flex flex-col gap-6">
          <div>
            {hasDiscount && (
              <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded mb-2">
                {discountPercent}% OFF
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {displayName}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-gray-900">
                    {formatINR(discountPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatINR(price)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {formatINR(price)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              (Inclusive Of All Taxes)
            </p>
          </div>
          <hr className="border-gray-200" />

          {/* Product Variant section */}
          {Array.isArray(product?.colorVariants) &&
            product.colorVariants.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  Available Variants ({product.colorVariants.length + 1})
                </span>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 p-1.5 pr-3 border-2 border-black rounded-md bg-gray-50 cursor-default">
                    <img
                      src={
                        product?.images[0]?.url || FALLBACK_PRODUCT_IMAGES[0]
                      }
                      alt={product?.name}
                      className="w-10 h-10 object-cover rounded"
                    />

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-black truncate max-w-[120px]">
                        {product.colors?.[0] || product.name}
                      </span>
                      <span className="text-[10px] text-green-700 font-medium">
                        Selected
                      </span>
                    </div>
                  </div>

                  {/* Linked Variants Navigation Buttons */}
                  {product.colorVariants.map((variant) => {
                    if (typeof variant !== "object" || !variant?._id)
                      return null;
                    return (
                      <button
                        key={variant._id}
                        onClick={() => handleVariantClick(variant)}
                        className="flex items-center gap-2 p-1.5 pr-3 border border-gray-300 hover:border-black rounded-md transition-all text-left group"
                      >
                        <img
                          src={
                            variant.images?.[0].url ||
                            FALLBACK_PRODUCT_IMAGES[0]
                          }
                          alt={variant.name}
                          className="w-10 h-10 object-cover rounded opacity-90 group-hover:opacity-100"
                        />

                        <div className="flex flex-col ">
                          <span className="text-xs font-medium text-gray-700 group-hover:text-black truncate max-w-[120px]">
                            {variant.colors?.[0] || variant.name}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {formatINR(variant.discountPrice || variant.price)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Banner Images */}
          <div className="flex flex-col gap-2 rounded-lg overflow-hidden">
            <img
              src={ADD_IMAGES[0]}
              alt="Feature Banner 1"
              className="w-full h-auto object-cover rounded"
            />
            <img
              src={ADD_IMAGES[1]}
              alt="Feature Banner 2"
              className="w-full h-auto object-cover rounded"
            />
          </div>

          {/* Color Section */}
          {productColors?.length > 0 && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-900">
                  Color: <span className="text-gray-600">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2">
                  {imageUrls.slice(0, 5).map((img, index) => (
                    <button
                      key={`color-thumb-${index}`}
                      className={`w-12 h-12 border rounded p-0.5 transition-all ${
                        selectedImage === index
                          ? "border-black ring-1 ring-black"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900">
              Quantity
            </label>
            <div className="inline-flex border border-gray-300 rounded overflow-hidden w-fit">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
              >
                -
              </button>
              <div className="px-4 py-1 flex items-center justify-center font-medium text-gray-900 min-w-[40px]">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <AddToBagButton
              product={product}
              quantity={quantity}
              isAddedToCart={isAddedToCart}
              onSuccess={() => {
                setIsAddedToCart(true);
                setTimeout(() => {
                  setIsAddedToCart(false);
                }, 3000);
              }}
            />
          </div>

          {/* Selling Highlights */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white divide-y divide-gray-100">
            {info.map(({ img, content }, index) => (
              <div
                key={`info-${index}`}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <img src={img} alt="" className="w-6 h-6 object-contain" />
                <p className="text-xs font-medium text-gray-700">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile accordion view */}
      <div className="md:hidden mt-8 max-w-lg mx-auto">
        <Accordion data={accordionData} />
      </div>
      {/* Recommendations */}
      <div className="mt-16">
        <BagCollection
          products={newArrivalProducts}
          title={"Products That Match Your Vibe"}
        />
      </div>
      <ExploreLineUp title={"Keep The Vibe Going—See More!"} />
    </div>
  );
};

export default ProductDetailsPage;
