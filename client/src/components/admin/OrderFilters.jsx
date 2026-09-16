import { Search, X } from "lucide-react";
import React, { useState } from "react";

const ORDER_STATUSES = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["all", "pending", "paid", "failed", "refunded"];

const OrderFilters = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    onFilterChange({ search: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onFilterChange({ search: "" });
  };

  const handleReset = () => {
    setSearchInput("");

    onFilterChange({
      status: "all",
      paymentStatus: "all",
      search: "",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Search Order
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by order number..."
              className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Order Status Filter */}
      <div className="min-w-[150px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Order Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Status Filter */}
      <div className="min-w-[150px]">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Payment Status
        </label>
        <select
          value={filters.paymentStatus}
          onChange={(e) => onFilterChange({ paymentStatus: e.target.value })}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PAYMENT_STATUSES.map((s) => {
            return (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            );
          })}
        </select>
      </div>

      {/* Start Date */}
      <div className="min-w-[150px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          From Date
        </label>{" "}
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange({ startDate: e.target.value })}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="min-w-[150px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          To Date
        </label>{" "}
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange({ endDate: e.target.value })}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sort */}
      <div className="min-w-[130px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Sort Order
        </label>
        <select
          value={filters.sortOrder}
          onChange={(e) => onFilterChange({ sortOrder: e.target.value })}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default OrderFilters;
