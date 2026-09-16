import { ChevronUp, SlidersHorizontal } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import PriceRange from "../products/PriceRange.jsx";
import Availability from "../products/Availability.jsx";
import Drawer from "../common/Drawer.jsx";

const FilterOptions = ({
  availability = [], // default empty array
  priceRange = { min: null, max: null }, // default object
  onAvailabilityChange, // required callback
  onPriceRangeChange, // required callback
  onClearFilters,
  resultCount = 0,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleClearFilters = () => {
    onAvailabilityChange([]);
    onPriceRangeChange({ min: null, max: null });

    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <>
      <div className="py-7 hidden md:block">
        {/* Filter Button */}
        <div className="flex items-center justify-between gap-2 cursor-pointer ">
          <div className="flex items-center gap-3">
            <SlidersHorizontal />
            <h2 className="font-sans font-normal">Filter</h2>
            <button
              className="text-black transition-all"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              {filtersOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            <span className="font-normal font-sans text-sm text-gray-600">
              {resultCount} Results
            </span>
          </div>
        </div>
        {/* Render Availability and PriceRange below when Filter is open */}
        {filtersOpen && (
          <div className="flex flex-col justify-between items-start gap-5 mt-3">
            <div className="flex items-center justify-between gap-6">
              <Availability
                availability={availability}
                onAvailabilityChange={onAvailabilityChange}
              />

              <PriceRange
                priceRange={priceRange}
                onPriceRangeChange={onPriceRangeChange}
              />
            </div>

            {/* Active Filters Display */}
            <div className="flex items-center flex-wrap gap-2">
              {/* In Stock Filter */}
              {availability.includes("1") && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <span>In Stock</span>
                  <button
                    onClick={() =>
                      onAvailabilityChange(
                        availability.filter((item) => item !== "1"),
                      )
                    }
                    className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Out of Stock Filter */}
              {availability.includes("0") && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  <span>Out of Stock</span>
                  <button
                    onClick={() =>
                      onAvailabilityChange(
                        availability.filter((item) => item !== "0"),
                      )
                    }
                    className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Price Range Filter */}
              {/* {priceRange.min !== null &&
                priceRange.max !== null &&
                (priceRange.min > 0 || priceRange.max < 10000) && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <span>
                      ₹{priceRange.min} - ₹{priceRange.max}
                    </span>
                    <button
                      onClick={() => onPriceRangeChange({ min: 0, max: 10000 })}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )} */}

              {priceRange.min !== null &&
                priceRange.max !== null &&
                (priceRange.min > 0 || priceRange.max < 10000) && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <span>
                      ₹{priceRange.min} - ₹{priceRange.max}
                    </span>
                    <button
                      onClick={() => onPriceRangeChange({ min: 0, max: 10000 })}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

              {/* Clear All Filters Button */}
              {(availability.length > 0 ||
                (priceRange.min !== null && priceRange.min > 0) ||
                (priceRange.max !== null && priceRange.max < 10000)) && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-black-600 hover:text-gray-800 font-medium underline transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* for mobile screens (drawer) */}
      <div className="w-full md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 bg-white text-black float-left text-center px-6 py-2 border border-black text-[18px] w-auto max-w-full"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filter
        </button>

        {/* mobile screens */}
        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          position="right"
          title={"Filter"}
        >
          <div className="flex flex-col items-start justify-between gap-4 h-full px-2">
            <div className="flex flex-col justify-between items-center gap-2  w-full md:w-auto">
              <Availability
                availability={availability}
                onAvailabilityChange={onAvailabilityChange}
              />

              <PriceRange
                priceRange={priceRange}
                onPriceRangeChange={onPriceRangeChange}
              />
            </div>

            <button
              onClick={() => setDrawerOpen(false)}
              className="bg-black p-4 w-full text-white text-center rounded-sm relative bottom-4"
            >
              Done
            </button>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default FilterOptions;
