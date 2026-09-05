import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilterOptions from "../../components/search/FilterOptions.jsx";
import SortOptions from "../../components/search/SortOptions.jsx";
import { FilteredProducts } from "../../components/products/FilteredProducts.jsx";
import ExploreLineUp from "../../components/products/ExploreLineup.jsx";
import {
  categoryService,
  productService,
} from "../../services/productsService.js";
import { ReviewSlider } from "../../components/products/ReviewSlider.jsx";
import { CategoryHeaderSkeleton } from "../../components/products/ProductSkeleton.jsx";

const CollectionPage = () => {
  const [sortBy, setSortBy] = useState("");
  const [availability, setAvailability] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const { categorySlug } = useParams();
  const [categories, setCategories] = useState([]);

  const { getAllProducts } = productService;

  // fetch categories in initial render
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoryService.getAllCategories();

        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.log("fetch categories", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // fetch changes when filter or slug changes
  useEffect(() => {
    fetchProducts();
  }, [availability, priceRange, sortBy, categorySlug]);

  const category = categories?.find((cat) => cat.slug === categorySlug);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      const specialCollection = {
        "new-launches": {
          collection: "new-launches",
          limit: 20,
        },
      };

      const collection = specialCollection[categorySlug];

      if (collection) {
        Object.assign(params, collection);
      } else {
        params.category = categorySlug;
      }

      const hasInStock = availability.includes("1");
      const hasOutOfStock = availability.includes("0");

      if (hasInStock && !hasOutOfStock) {
        params.in_stock = "true";
      } else if (hasOutOfStock && !hasInStock) {
        params.in_stock = "false";
      }

      if (priceRange.min !== null && priceRange.min > 0) {
        params.minPrice = priceRange.min;
      }

      if (priceRange.max !== null && priceRange.max < 10000) {
        params.maxPrice = priceRange.max;
      }

      if (sortBy && sortBy !== "manual") {
        params.sortBy = sortBy;
      }

      const response = await getAllProducts(params);

      if (response.success) {
        setProducts(response.data.products);
        setTotalResults(response.data.pagination.totalProducts);
      } else {
        setError(response.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (newSortBy, newAvailability, newPriceRange) => {
    const params = new URLSearchParams();
    params.set("sort_by", newSortBy || "manual");

    if (newAvailability && newAvailability.length > 0) {
      newAvailability.forEach((val) => {
        params.append("filter.v.availability", val);
      });
    }

    params.set("filter.v.price.gte", newPriceRange.min ?? "");
    params.set("filter.v.price.lte", newPriceRange.max ?? "");

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newURL);
  };

  const parseURLParams = () => {
    const params = new URLSearchParams(window.location.search);
    const urlSortBy = params.get("sort_by");
    const urlAvailability = params.getAll("filter.v.availability");
    const urlMinPrice = params.get("filter.v.price.gte");
    const urlMaxPrice = params.get("filter.v.price.lte");

    if (urlSortBy) setSortBy(urlSortBy);
    if (urlAvailability.length > 0) setAvailability(urlAvailability);

    if (urlMinPrice !== null || urlMaxPrice !== null) {
      setPriceRange({
        min: urlMinPrice ? parseInt(urlMinPrice) : null,
        max: urlMaxPrice ? parseInt(urlMaxPrice) : null,
      });
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateURL(newSort, availability, priceRange);
  };

  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability);
    updateURL(sortBy, newAvailability, priceRange);
  };

  const handlePriceRangeChange = (newPriceRange) => {
    const updatedRange = {
      min: newPriceRange.min !== undefined ? newPriceRange.min : null,
      max: newPriceRange.max !== undefined ? newPriceRange.max : null,
    };
    setPriceRange(updatedRange);
    updateURL(sortBy, availability, updatedRange);
  };

  useEffect(() => {
    parseURLParams();
  }, []);

  const handleClearFilters = () => {
    setSortBy("manual");
    setAvailability([]);
    setPriceRange({ min: null, max: null });

    const params = new URLSearchParams();
    params.set("sort_by", "manual");
    params.set("filter.v.price.gte", "");
    params.set("filter.v.price.lte", "");

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newURL);
  };

  return (
    <>
      {categoriesLoading || !category ? (
        <CategoryHeaderSkeleton />
      ) : (
        <div
          className="w-full h-[100vh] flex items-start justify-start bg-cover bg-center bg-no-repeat relative text-white"
          style={{ backgroundImage: `url(${category.image})` }}
        >
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className="p-6 sm:p-12 z-10 w-full max-w-7xl">
            <h1 className="text-5xl ibm-plex-serif-bold-italic tracking-tight drop-shadow-md">
              {category.name}
            </h1>
          </div>
        </div>
      )}

      <div className="bg-white min-h-screen px-8 w-full mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start md:px-4 mx-auto sticky top-0 z-10 w-full bg-white/90 py-4">
            <FilterOptions
              availability={availability}
              priceRange={priceRange}
              onAvailabilityChange={handleAvailabilityChange}
              onPriceRangeChange={handlePriceRangeChange}
              onClearFilters={handleClearFilters}
              totalResults={totalResults}
              resultCount={products.length}
            />

            <SortOptions
              sortBy={sortBy}
              setSortBy={setSortBy}
              onSortChange={handleSortChange}
            />
          </div>

          <FilteredProducts
            sortBy={sortBy}
            availability={availability}
            priceRange={priceRange}
            loading={loading}
            error={error}
            products={products}
          />
        </div>

        <ExploreLineUp title={"Keep The Vibe Going—See More!"} />
        <ReviewSlider />
      </div>
    </>
  );
};

export default CollectionPage;
