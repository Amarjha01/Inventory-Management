import React from "react";

const NotificationSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        {/* Icon placeholder */}
        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />

        {/* Content placeholder */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="w-full">
              {/* Tag / Category placeholder */}
              <div className="h-2.5 w-20 rounded bg-slate-200" />
              {/* Title placeholder */}
              <div className="mt-2 h-4 w-48 rounded bg-slate-200" />
              {/* Date placeholder */}
              <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
            </div>

            {/* Menu button placeholder */}
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Divider placeholder */}
      <div className="my-4 h-px bg-slate-100" />

      {/* Message placeholder lines */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
