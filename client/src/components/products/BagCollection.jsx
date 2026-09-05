import { useEffect, useRef, useState } from "react";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const primaryImage = product?.images?.[0]?.url || "/placeholder.jpg";
  const [activeImage, setActiveImage] = useState(primaryImage);

  // fallback check if images array changes
  useEffect(() => {
    setActiveImage(product?.images?.[0]?.url || "/placeholder.jpg");
  }, [product]);

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 p-3 transition-all duration-300 hover:-translate-y-1">
      <Link
        to={`/products/${product._id}`}
        className="relative block w-full aspect-square overflow-hidden  bg-gray-50 mb-4"
      >
        <img
          src={activeImage}
          alt={product?.name || "Product image"}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product?.colors?.length > 1 && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full shadow-sm">
            {product.colors.length} colors
          </span>
        )}
      </Link>

      {/* product details */}
      <div className="flex flex-col flex-grow px-1">
        <Link
          to={`/products/${product._id}`}
          className="text-base font-semibold text-gray-900 hover:text-black line-clamp-1 mb-1"
        >
          {product?.name}
        </Link>

        <div className="flex items-baseline justify-between mb-3">
          <p className="text-sm text-gray-500 font-medium">
            Starting from{" "}
            <span className="text-base font-bold text-gray-900">
              ₹{product?.price}
            </span>
          </p>
          {product?.sizes?.length > 0 && (
            <span className="text-xs text-gray-400">
              {product.sizes.length} sizes available
            </span>
          )}
        </div>

        {/* if product has > 1 image show those images*/}
        {product?.images?.length > 1 && (
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Variants</span>
            <div className="flex items-center p-4 gap-1.5 overflow-x-auto no-scrollbar py-1">
              {product.images.slice(0, 4).map((img, idx) => (
                <button
                  key={img?._id || idx}
                  onMouseEnter={() => setActiveImage(img?.url)}
                  onClick={() => setActiveImage(img?.url)}
                  className={`relative w-7 h-7 rounded-md overflow-hidden border transition-all ${
                    activeImage === img?.url
                      ? "border-black ring-1 ring-black scale-105"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image variant ${idx + 1}`}
                >
                  <img
                    src={img?.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {product.images.length > 4 && (
                <span className="text-[10px] text-gray-400 font-medium ml-0.5">
                  +{product.images.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BagCollection = ({ products = [], title = "Collection", buttonText }) => {
  const scrollRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanPrev(scrollLeft > 5);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {buttonText && (
            <Link
              to="/collections/new-launches"
              className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-gray-600 mt-2 group"
            >
              {buttonText}
              <GoArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={!canPrev}
            onClick={() => handleScroll("prev")}
            aria-label="Previous products"
            className={`p-3 rounded-full border transition-all ${
              canPrev
                ? "border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400 active:scale-95"
                : "border-gray-100 text-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            <GoArrowLeft className="w-5 h-5" />
          </button>
          <button
            disabled={!canNext}
            onClick={() => handleScroll("next")}
            aria-label="Next products"
            className={`p-3 rounded-full border transition-all ${
              canNext
                ? "border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400 active:scale-95"
                : "border-gray-100 text-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            <GoArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BagCollection;
