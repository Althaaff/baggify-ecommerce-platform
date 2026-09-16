import { TrendingUp, Tag, Package, SearchIcon } from "lucide-react";

const getIconForType = (type) => {
  switch (type) {
    case "popular":
      return <TrendingUp size={16} className="text-orange-500" />;
    case "tag":
      return <Tag size={16} className="text-blue-500" />;
    case "product":
      return <Package size={16} className="text-green-500" />;
    case "category":
      return <Package size={16} className="text-purple-500" />;
    default:
      return <SearchIcon size={16} className="text-gray-400" />;
  }
};

const SearchFilters = ({
  suggestions = [],
  selectedIndex = -1,
  onSuggestionClick,
}) => {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return null;

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">
        Search suggestions
      </h3>
      <div className="space-y-1">
        {suggestions.map((s, index) => (
          <button
            key={`${s?.value ?? ""}-${index}`}
            onClick={() => onSuggestionClick(s)}
            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-3 transition-colors ${
              index === selectedIndex ? "bg-gray-100" : ""
            }`}
          >
            {getIconForType(s?.type)}
            <span className="flex-1 font-medium text-gray-800">
              {s?.value ?? ""}
            </span>
            {s?.type === "popular" && (
              <span className="text-xs text-orange-500 font-semibold">
                Popular
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilters;
