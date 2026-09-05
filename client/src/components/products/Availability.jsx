import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "rc-slider/assets/index.css"; // imported default styles

const Availability = ({ availability, onAvailabilityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Handle click outside to close the popup :
  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log("runs");
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    // add event listener when component mounts :
    document.addEventListener("mousedown", handleClickOutside);

    // remove event listener when component mounts :
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckBoxChange = (value, checked) => {
    let newAvailability;

    if (checked) {
      newAvailability = [...availability, value];
      console.log("newAvailability", newAvailability);
    } else {
      newAvailability = availability.filter((item) => item !== value);
    }

    onAvailabilityChange(newAvailability);
  };

  return (
    <div className="relative inline-block w-full max-w-md" ref={wrapperRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex gap-2 justify-between items-center px-4 py-3 border border-black hover:border-black text-black bg-white w-full"
        >
          {" "}
          Availability
          {isOpen ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-[18rem] bg-white border border-black rounded-md z-10 p-4">
          <div className="text-gray-700 mb-2">0 Selected</div>
          <hr />
          <div className="flex flex-col items-start gap-4 mb-2 pt-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.includes("1")}
                  onChange={(e) => handleCheckBoxChange("1", e.target.checked)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">In stock (40)</span>
              </label>

              <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.includes("0")}
                  onChange={(e) => handleCheckBoxChange("0", e.target.checked)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Out of stock (30)</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
