import { useSearchParams } from "react-router-dom";
import FilterOptions from "../../components/search/FilterOptions";
import SortOptions from "../../components/search/SortOptions";
import { useEffect, useState } from "react";
import { FilteredProducts } from "../../components/products/FilteredProducts";
import { productService } from "../../services/productsService";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Get the search query from URL
  const query = searchParams.get("q") || "";
  // Search page state
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState("manual");
  const [availability, setAvailability] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getAllProducts } = productService;

  const hasValidQuery = query.trim() !== "";

  // Centralized function to update URL parameters
  const updateSearchURL = (newSortBy, newAvailability, newPriceRange) => {
    // dont url when query is empty :
    if (!hasValidQuery) return;

    const params = new URLSearchParams();

    // Keep the search query
    params.set("q", query);

    // Always include sort_by
    if (newSortBy) params.set("sort_by", newSortBy || "manual");

    // Add availability filters (if any)
    if (newAvailability && newAvailability.length > 0) {
      newAvailability.forEach((val) => {
        params.append("filter.v.availability", val);
      });
    }

    // Always include price params, even if empty
    params.set("filter.v.price.gte", newPriceRange.min ?? "");
    params.set("filter.v.price.lte", newPriceRange.max ?? "");

    // Update the URL
    setSearchParams(params);
  };

  // when URL changes sync search term with query
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // reset state when query becomes empty :
  useEffect(() => {
    if (!hasValidQuery) {
      setProducts([]);
      setTotalResults(0);
      setSortBy("manual");
      setAvailability([]);
      setPriceRange({ min: null, max: null });
      setError("");
    }
  }, [hasValidQuery]);

  // Parse URL on mount to restore state
  useEffect(() => {
    if (!hasValidQuery) return;

    const urlSortBy = searchParams.get("sort_by");
    const urlAvailability = searchParams.getAll("filter.v.availability");
    const urlMinPrice = searchParams.get("filter.v.price.gte");
    const urlMaxPrice = searchParams.get("filter.v.price.lte");

    if (urlSortBy) setSortBy(urlSortBy);
    if (urlAvailability.length > 0) setAvailability(urlAvailability);
    if (urlMinPrice !== null || urlMaxPrice !== null) {
      setPriceRange({
        min: urlMinPrice ? parseInt(urlMinPrice) : null,
        max: urlMaxPrice ? parseInt(urlMaxPrice) : null,
      });
    }
  }, [searchParams, hasValidQuery]);

  // Handlers for child components
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateSearchURL(newSort, availability, priceRange);
  };

  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability);
    updateSearchURL(sortBy, newAvailability, priceRange);
  };

  const handlePriceRangeChange = (newPriceRange) => {
    const updatedRange = {
      min: newPriceRange.min !== undefined ? newPriceRange.min : null,
      max: newPriceRange.max !== undefined ? newPriceRange.max : null,
    };

    setPriceRange(updatedRange);
    updateSearchURL(sortBy, availability, updatedRange);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSortBy("manual");
    setAvailability([]);
    setPriceRange({ min: null, max: null });

    const params = new URLSearchParams();
    params.set("q", query);
    params.set("sort_by", "manual");
    params.set("filter.v.price.gte", "");
    params.set("filter.v.price.lte", "");

    setSearchParams(params);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

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

      console.log("sortBy", sortBy);

      // sort options :
      if (sortBy && sortBy !== "manual") {
        params.sortBy = sortBy;
      }

      if (query && query.trim() !== "") {
        params.search = query.trim();
      }

      const response = await getAllProducts(params);

      if (response.success) {
        setProducts(response.data.products);
        setTotalResults(response.data.products.length);
      } else {
        setError(response.data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");

      if (error.response) {
        setError(error.response.data.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    if (hasValidQuery) {
      // Only fetch if there's a valid search query
      fetchProducts();
    }
  }, [query, availability, priceRange, sortBy]);

  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      const params = new URLSearchParams();
      params.set("q", trimmedSearch);

      setSearchParams(params);
    } else {
      // empty search clear all paramaters
      setSearchParams({});
    }
  };

  return (
    <div className="bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="flex flex-col gap-3 items-center justify-between py-10">
          {/* Only show result count if there is a valid query */}
          {hasValidQuery ? (
            <h2 className="text-black text-4xl font-semibold">
              {totalResults} {totalResults === 1 ? "result" : "results"} for "
              {query}"
            </h2>
          ) : (
            <div className="text-black text-4xl font-semibold font-sans">
              Search our site
            </div>
          )}

          <div className="flex items-center justify-center w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="py-3 px-4 focus:outline-none border-[1px] border-gray-700 w-full"
            />
          </div>
        </div>

        {/* only render components when there is a valid search query */}
        {hasValidQuery && (
          <>
            <div className="bg-gray-500 h-[1px]"></div>

            <div className="py-3">
              <div className="flex items-center justify-between gap-4">
                <FilterOptions
                  availability={availability}
                  priceRange={priceRange}
                  onAvailabilityChange={handleAvailabilityChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={handleClearFilters}
                  totalResults={totalResults}
                />

                <SortOptions
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>

            {/* Products Grid */}
            <FilteredProducts
              params={searchParams}
              products={products}
              loading={loading}
              error={error}
              query={query}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
