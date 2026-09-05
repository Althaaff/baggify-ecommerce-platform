import React from "react";

export const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm animate-pulse flex flex-col"
        >
          <div className="w-full aspect-square bg-gray-200 rounded-md mb-4" />

          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />

          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded-md w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;

export const CategoryHeaderSkeleton = () => (
  <div className="w-full h-[100vh] bg-gray-200 animate-pulse flex items-start justify-start relative p-6 sm:p-12">
    <div className="h-12 bg-gray-300 rounded-md w-64 mt-8" />
  </div>
);
