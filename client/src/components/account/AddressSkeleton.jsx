const AddressSkeleton = () => {
  return (
    <div className="grid gap-4 w-full">
      {[1, 2].map((index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-6 bg-white shadow-xs animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-2" />

              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                <div className="h-4 bg-gray-100 rounded-md w-1/4" />
                <div className="h-4 bg-gray-100 rounded-md w-2/3" />
                <div className="h-4 bg-gray-100 rounded-md w-1/5" />
                <div className="h-4 bg-gray-100 rounded-md w-1/3 mt-2" />
              </div>

              <div className="h-3 bg-gray-200 rounded-md w-24 mt-4" />
            </div>

            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="h-3 bg-gray-100 rounded-md w-28" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressSkeleton;
