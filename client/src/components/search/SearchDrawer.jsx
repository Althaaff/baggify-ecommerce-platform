import SearchInput from "./SearchInput.jsx";
import SearchFilters from "./SearchFilters.jsx";
import SearchResults from "./SearchResults.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import { Package, Search, Tag, TrendingUp } from "lucide-react";
import { searchService } from "../../services/searchService.js";

const SearchDrawer = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const { getSuggestions, trackSearchService } = searchService;

  // fetch suggestions with debounce :
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setProducts([]);
      setSelectedIndex(-1);
      return;
    }

    // clear previous timer :
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    // set new timer ( 3000 delay ):
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions();
    }, 400);

    // cleanup function :
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await getSuggestions(searchTerm);

      if (response?.success) {
        setSuggestions(response.data?.suggestions || []);
        setProducts(response.data?.products || []);
      } else {
        setSuggestions([]);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const trackSearch = async (query) => {
    try {
      await trackSearchService({ query: query, resultCount: products.length });
    } catch (error) {
      console.error("Error tracking search:", error);
    }
  };

  const handleSearch = async (query) => {
    const q = (query && searchTerm).trim();
    if (!q) return;

    // track the search :
    trackSearch(q);

    // navigate to search result :
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onClose?.();
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion?.type === "category" && suggestion?.slug) {
      navigate(`/collections/${suggestion.slug}`);
      onClose?.();
      return;
    }
    setSearchTerm(suggestion.value || "");
    handleSearch(suggestion.value || "");
  };

  const handleProductClick = (product) => {
    const slug = product?.name?.toLowerCase().replace(/\s+/g, "-");
    if (!slug) return;
    navigate(`/products/${slug}-${product?._id}`);
    onClose?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch(searchTerm);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setProducts([]);
    setSelectedIndex(-1);
  };

  const hasResults = suggestions.length > 0 || products.length > 0;
  const showNoResultsMessage =
    searchTerm.trim().length > 0 && !hasResults && !loading;

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onKeyDown={handleKeyDown}
            onClear={handleClear}
            placeholder="What are you looking for ?"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 mx-auto mb-2" />
              Searching...
            </div>
          )}

          {/* initial empty state */}
          {!loading && searchTerm.length < 2 && (
            <div className="p-8 text-center text-gray-400">
              <p className="text-lg">Start typing to search...</p>
            </div>
          )}

          <div className="mt-8 z-10">
            <SearchFilters
              suggestions={suggestions}
              selectedIndex={selectedIndex}
              onSuggestionClick={handleSuggestionClick}
            />
            <SearchResults
              products={products}
              searchTerm={searchTerm}
              onProductLink={handleProductClick}
            />
            {/* for no results */}
            {showNoResultsMessage && (
              <div className="p-8 text-center text-gray-500">
                <p className="font-medium">
                  No results found for "{searchTerm}"
                </p>
                <span className="text-sm mt-2">Try different keywords!</span>
              </div>
            )}
          </div>

          {!loading && searchTerm.length >= 2 && (
            <>
              <div className="p-4 w-full">
                <h2 className="text-gray-500 mb-2">Collections</h2>

                <div className="w-full h-[1px] bg-gray-500"></div>

                <div className="flex flex-col items-start justify-between gap-2 py-5">
                  <span className="hover:underline text-gray-800">
                    Travel Duffles
                  </span>
                  <span className="hover:underline text-gray-800">
                    Your Bag Your Story
                  </span>
                  <span className="hover:underline text-gray-800">
                    ReversoFlex PU Bags
                  </span>
                </div>
              </div>

              <div className="p-4 w-full">
                <h2 className="text-gray-500 mb-2">Pages</h2>

                <div className="w-full h-[1px] bg-gray-500"></div>

                <div className="flex flex-col items-start justify-between gap-2 py-5">
                  <span className="hover:underline text-gray-800">
                    Product Warranty - Bags
                  </span>
                  <span className="hover:underline text-gray-800">
                    Additional Details - Imported Bags
                  </span>
                  <span className="hover:underline text-gray-800">
                    Contact Us
                  </span>
                </div>
              </div>

              <div className="p-4 w-full">
                <button className="p-4 bg-black text-white font-sans font-normal w-full rounded-md hover:scale-105 transition-transform duration-500 ease-in">
                  View All Results
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchDrawer;
