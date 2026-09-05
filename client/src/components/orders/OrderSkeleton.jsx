import React from "react";

export const OrderSkeletonCard = () => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden mb-6 shadow-sm animate-pulse">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-8 sm:gap-12">
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-24" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-24" />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-16" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-6 bg-gray-200 rounded-full w-24" />
          <div className="h-4 bg-gray-300 rounded w-20" />
        </div>
      </div>

      <div className="p-6">
        <div className="w-full bg-gray-50/80 border border-gray-100 rounded-md py-3 px-4 mb-6">
          <div className="h-4 bg-gray-200 rounded w-52" />
        </div>

        <div className="flex items-start justify-between gap-4 py-2">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0" />

            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-300 rounded w-48 sm:w-64" />
              <div className="h-3 bg-gray-200 rounded w-28" />
            </div>
          </div>

          <div className="h-4 bg-gray-300 rounded w-16" />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <div className="h-9 bg-gray-200 rounded-md w-28" />
          <div className="h-9 bg-gray-300 rounded-md w-28" />
        </div>
      </div>
    </div>
  );
};

export const OrderSkeleton = ({ count = 2 }) => {
  return (
    <div className="w-full py-6">
      {Array.from({ length: count }).map((_, index) => (
        <OrderSkeletonCard key={index} />
      ))}
    </div>
  );
};

export default OrderSkeleton;
