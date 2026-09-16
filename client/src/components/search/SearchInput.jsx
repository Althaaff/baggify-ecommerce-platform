import { Search, X } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
  onKeyDown,
  onClear,
  placeholder,
  autoFocus = true,
}) => {
  return (
    <div className="p-4">
      {/* Add w-full here ↓ */}
      <div className="flex items-center gap-3 w-full">
        <Search size={20} className="text-gray-400" />

        {/* And potentially here ↓ */}
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full border-none text-black text-[20px] focus:outline-none p-4"
            placeholder={placeholder}
            autoFocus={autoFocus}
          />
          {value && (
            <button
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="w-full h-[2px] bg-black mt-1"></div>
    </div>
  );
};

export default SearchInput;
