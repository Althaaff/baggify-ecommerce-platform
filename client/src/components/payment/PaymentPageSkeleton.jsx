import React from "react";

const PaymentPageSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="w-full bg-amber-50/50 border border-amber-200/60 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-6 w-56 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-72 bg-slate-200/70 rounded-md"></div>
        </div>
        <div className="h-5 w-48 bg-slate-200 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="h-7 w-64 bg-slate-200 rounded-md"></div>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-28 bg-slate-200 rounded"></div>
                    <div className="h-3.5 w-48 bg-slate-200/70 rounded"></div>
                  </div>
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded"></div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-36 bg-slate-200 rounded"></div>
                    <div className="h-3.5 w-56 bg-slate-200/70 rounded"></div>
                  </div>
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-5 w-32 bg-slate-200 rounded-full"></div>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <div className="h-5 w-36 bg-slate-200 rounded"></div>
                <div className="h-4 w-24 bg-slate-200/70 rounded"></div>
                <div className="h-4 w-52 bg-slate-200/70 rounded"></div>
                <div className="h-4 w-16 bg-slate-200/70 rounded"></div>
              </div>

              <div className="space-y-2 text-right">
                <div className="h-3 w-28 bg-slate-200 rounded ml-auto"></div>
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-6">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
              <div className="h-5 w-32 bg-slate-700 rounded"></div>
              <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
            </div>

            <div className="px-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-3.5 w-20 bg-slate-200/70 rounded"></div>
                </div>
                <div className="h-5 w-16 bg-slate-200 rounded"></div>
              </div>

              <div className="border-t border-dashed border-slate-200 my-4"></div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-slate-200 rounded"></div>
                  <div className="h-4 w-20 bg-emerald-100 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  <div className="h-4 w-12 bg-emerald-100 rounded"></div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-28 bg-slate-200 rounded"></div>
                  <div className="h-7 w-24 bg-slate-200 rounded"></div>
                </div>
                <div className="h-3 w-32 bg-slate-200/60 rounded ml-auto"></div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 flex items-center space-x-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-emerald-200 shrink-0"></div>
                <div className="h-4 w-full bg-emerald-200/60 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPageSkeleton;
