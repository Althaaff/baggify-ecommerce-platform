import { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import "rc-slider/assets/index.css"; // imported default styles

const PriceRange = ({
  priceRange: priceRangeFromParent,
  onPriceRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const highestPrice = 10000;
  // Track if user has interacted with price filter
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use local state for the slider values, initialized from parent props
  const [localPriceRange, setLocalPriceRange] = useState([
    priceRangeFromParent?.min !== null ? priceRangeFromParent.min : 0,
    priceRangeFromParent?.max !== null
      ? priceRangeFromParent.max
      : highestPrice,
  ]);

  // Sync local state when parent props change (URL updates, etc.)
  useEffect(() => {
    if (priceRangeFromParent) {
      // reset to defaults when parent sends null values (clear filter)
      if (
        priceRangeFromParent.min === null &&
        priceRangeFromParent.max === null
      ) {
        setLocalPriceRange([0, highestPrice]);
        setHasInteracted(false);
      }
      // update to specific values when parent has valid range
      else if (
        priceRangeFromParent.min !== null &&
        priceRangeFromParent.max !== null
      ) {
        setLocalPriceRange([
          priceRangeFromParent.min,
          priceRangeFromParent.max,
        ]);

        setHasInteracted(false);
      }
    }
  }, [priceRangeFromParent]);

  const updateParent = (minValue, maxValue) => {
    if (onPriceRangeChange) {
      if (!hasInteracted) setHasInteracted(true);

      // if user never interacted — send null to clear URL params
      if (!hasInteracted && minValue === 0 && maxValue === highestPrice) {
        onPriceRangeChange({ min: null, max: null });
      } else {
        onPriceRangeChange({ min: minValue, max: maxValue });
      }
    }
  };

  const handleSliderChange = (value) => {
    setLocalPriceRange(value);
    // Update parent immediately for smooth slider experience
    updateParent(value[0], value[1]);
  };

  const handleMinInputChange = (e) => {
    let newValue = e.target.value;

    if (newValue === "") {
      const newRange = [0, localPriceRange[1]];
      setLocalPriceRange(newRange);
      updateParent(0, localPriceRange[1]);
    } else {
      const newMin = parseInt(newValue, 10);

      if (!isNaN(newMin)) {
        let finalMin = newMin;

        if (newMin < 0) {
          finalMin = 0;
        } else if (newMin >= localPriceRange[1]) {
          finalMin = localPriceRange[1];
        }

        const newRange = [finalMin, localPriceRange[1]];
        setLocalPriceRange(newRange);
        updateParent(finalMin, localPriceRange[1]);
      }
    }
  };

  const handleMaxInputChange = (e) => {
    let newValue = e.target.value;

    if (newValue === "") {
      const newRange = [localPriceRange[0], highestPrice];
      setLocalPriceRange(newRange);
      updateParent(localPriceRange[0], highestPrice);
    } else {
      const newMax = parseInt(newValue, 10);

      if (!isNaN(newMax)) {
        let finalMax = newMax;

        if (newMax > highestPrice) {
          finalMax = highestPrice;
        } else if (newMax <= localPriceRange[0]) {
          finalMax = localPriceRange[0];
        }

        const newRange = [localPriceRange[0], finalMax];
        setLocalPriceRange(newRange);
        updateParent(localPriceRange[0], finalMax);
      }
    }
  };

  useEffect(() => {
    const handlerClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    // add event listener when component mounts
    document.addEventListener("mousedown", handlerClickOutside);

    // remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handlerClickOutside); // Fixed: was adding instead of removing
    };
  }, []);

  return (
    <div className="relative inline-block w-full max-w-md" ref={wrapperRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-between items-center gap-2 px-4 py-3 border border-black hover:border-black text-black bg-white w-full"
        >
          Price{" "}
          <span className="bg-black px-1 text-white hidden md:block">₹</span>{" "}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-[18rem] bg-white border-black border rounded-md shadow-lg z-10 p-4">
          <div className="text-gray-700 mb-2">
            The highest price is ₹ {highestPrice}.00
          </div>
          <hr />

          <div className="flex items-center gap-4 mb-4 pt-3 p-3">
            {/* Min Price */}
            <div className="flex-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                ₹
              </span>
              <input
                type="text"
                value={localPriceRange[0]}
                placeholder="0"
                onChange={handleMinInputChange}
                className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-md"
                min="0"
                max={localPriceRange[1]}
              />
            </div>

            <span className="text-gray-700">-</span>

            {/* Max Price */}
            <div className="flex-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                ₹
              </span>
              <input
                type="text"
                value={localPriceRange[1]}
                onChange={handleMaxInputChange}
                className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-md"
                min={localPriceRange[0]}
                max={highestPrice}
              />
            </div>
          </div>

          <Slider
            range
            allowCross={false}
            pushable={1}
            step={1}
            min={0}
            max={highestPrice}
            value={localPriceRange}
            onChange={handleSliderChange}
            className="custom-slider"
            handleStyle={[
              {
                borderColor: "#3182ce",
                backgroundColor: "#3182ce",
                opacity: 1,
                width: "14px",
                height: "14px",
                marginTop: "-4px",
              },
              {
                borderColor: "#3182ce",
                backgroundColor: "#3182ce",
                opacity: 1,
                width: "14px",
                height: "14px",
                marginTop: "-4px",
              },
            ]}
            trackStyle={{ backgroundColor: "#3182ce" }}
            railStyle={{ backgroundColor: "#e5e7eb" }}
          />
        </div>
      )}
    </div>
  );
};

export default PriceRange;
