import { useEffect, useRef, useState } from "react";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import Drawer from "../common/Drawer";

const options = [
  { id: "manual", label: "Featured" },
  { id: "best-selling", label: "Best selling" },
  { id: "a-z", label: "Alphabetically, A-Z" },
  { id: "z-a", label: "Alphabetically, Z-A" },
  { id: "price-low-high", label: "Price, low to high" },
  { id: "price-high-low", label: "Price, high to low" },
  { id: "date-old-new", label: "Date, old to new" },
  { id: "date-new-old", label: "Date, new to old" },
];

const SortOptions = ({ sortBy = "", setSortBy, onSortChange }) => {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropDownRef = useRef(null);

  const handleSortChange = (newSort) => {
    onSortChange(newSort);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!sortBy) setSortBy("manual");
  }, []);

  return (
    // md screens :
    <>
      <div className="relative py-4 hidden md:block" ref={dropDownRef}>
        <div className="flex items-center justify-center gap-1">
          <span className="font-medium text-gray-700">Sort:</span>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="inline-flex justify-between items-center gap-4 px-3 py-2 text-black focus:outline-none"
          >
            {options.find((option) => option.id === sortBy)?.label}
            {open ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {open && (
          <div className="absolute left-0 mt-2 bg-white border border-black rounded-md z-10 max-h-48 overflow-y-auto">
            <form className="p-2">
              {options.map(({ id, label }) => (
                <label
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                  key={id}
                >
                  <input
                    type="radio"
                    name="sort"
                    value={id}
                    checked={sortBy === id}
                    className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    onChange={() => {
                      setOpen(false);
                      handleSortChange(id);
                    }}
                  />
                  <span className="text-sm text-gray-900 truncate">
                    {label}
                  </span>
                </label>
              ))}
            </form>
          </div>
        )}
      </div>

      {/* mobile screens */}
      <div className="w-full md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 bg-white text-black float-right text-center px-6 py-2 border border-black text-[18px] w-auto max-w-full"
        >
          <ArrowDownUp /> Sort
        </button>

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          position="right"
          title={"Sort"}
        >
          <div className="flex flex-col items-start justify-between gap-4 h-full px-2">
            <form className="space-y-3">
              {options.map(({ id, label }) => (
                <label
                  key={id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={id}
                    checked={sortBy === id}
                    className="w-4 h-4 text-black"
                    onChange={() => {
                      handleSortChange(id);
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </form>

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

export default SortOptions;
