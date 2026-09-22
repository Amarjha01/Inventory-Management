import React from "react";
import { FiBell } from "react-icons/fi";

const NotificationEmpty = () => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FiBell size={24} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        No notifications
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        You're all caught up. New notifications will appear here.
      </p>
    </div>
  );
};

export default NotificationEmpty;
