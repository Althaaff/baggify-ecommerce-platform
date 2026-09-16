import { useState } from "react";
import { X } from "lucide-react";
import Drawer from "../common/Drawer";

// Sort Drawer Example
const options = [
  { id: "best-selling", label: "Best selling" },
  { id: "a-z", label: "Alphabetically, A-Z" },
  { id: "z-a", label: "Alphabetically, Z-A" },
  { id: "price-low-high", label: "Price, low to high" },
  { id: "price-high-low", label: "Price, high to low" },
  { id: "date-old-new", label: "Date, old to new" },
  { id: "date-new-old", label: "Date, new to old" },
];

const SortDrawer = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("best-selling");

  return (
    <>
      {/* Button for mobile */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-black text-white rounded-md md:hidden"
      >
        Open Sort Drawer
      </button>

      <Drawer isOpen={open} onClose={() => setOpen(false)} position="right">
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
                checked={selected === id}
                className="w-4 h-4 text-black"
                onChange={() => {
                  setSelected(id);
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </form>
      </Drawer>
    </>
  );
};

export default SortDrawer;
