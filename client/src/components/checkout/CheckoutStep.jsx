import { Check } from "lucide-react";

const CheckoutStep = ({
  number,
  title,
  isActive,
  isCompleted,
  summary,
  onEdit,
  children,
}) => {
  return (
    <div className="w-full max-w-full mx-auto mb-3 bg-white border border-gray-200 shadow-sm font-sans overflow-hidden">
      <div
        className={`${
          isActive ? "bg-[#2874f0] text-white" : "bg-white text-gray-700"
        } p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-200`}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`${
              isActive
                ? "bg-white text-[#2874f0]"
                : "bg-gray-100 text-[#2874f0]"
            } font-bold px-2 py-0.5 rounded-sm text-xs shrink-0 mt-0.5`}
          >
            {number}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2
                className={`${
                  isActive ? "text-white" : "text-gray-500"
                } font-bold tracking-tight uppercase text-xs sm:text-sm`}
              >
                {title}
              </h2>

              {!isActive && isCompleted && (
                <Check className="text-[#2874f0] shrink-0" size={16} />
              )}
            </div>

            {!isActive && isCompleted && summary && (
              <p className="text-gray-800 text-xs sm:text-sm font-medium mt-0.5 truncate block">
                {summary}
              </p>
            )}
          </div>
        </div>

        {!isActive && isCompleted && (
          <button
            onClick={onEdit}
            className="w-full sm:w-auto text-[#2874f0] bg-white border border-[#2874f0]/30 hover:border-[#2874f0] px-4 py-1.5 text-xs font-bold uppercase rounded-sm transition-all duration-150 shrink-0 text-center shadow-xs"
          >
            Change
          </button>
        )}
      </div>

      {isActive && (
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default CheckoutStep;
