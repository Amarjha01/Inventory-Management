import { useState } from "react";
import {
  MdNotifications,
  MdPhoneAndroid,
} from "react-icons/md";

import {
  enablePushNotifications,
  unsubscribeFromPushNotifications,
} from "../../../services/notification.service";

const Toggle = ({ enabled, loading, onClick }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onClick}
      disabled={loading}
      className={`
        relative
        h-7
        w-12
        shrink-0
        rounded-full
        transition-all
        duration-200
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-200
        ${
          enabled
            ? "bg-emerald-500"
            : "bg-gray-300"
        }
        ${
          loading
            ? "cursor-wait opacity-60"
            : "cursor-pointer"
        }
      `}
    >
      <span
        className={`
          absolute
          top-1
          h-5
          w-5
          rounded-full
          bg-white
          shadow-md
          transition-all
          duration-200
          ease-in-out
          ${
            enabled
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
};


const NotificationSettings = ({
  enabled,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEnable = async () => {
    try {
      setLoading(true);
      setError("");

      await enablePushNotifications();

      onChange(true);
    } catch (error) {
      console.error(
        "Enable notification error:",
        error
      );

      setError(
        error.message ||
          "Failed to enable notifications."
      );

      onChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setLoading(true);
      setError("");

      await unsubscribeFromPushNotifications();

      onChange(false);
    } catch (error) {
      console.error(
        "Disable notification error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to disable notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (enabled) {
      handleDisable();
    } else {
      handleEnable();
    }
  };

  return (
    <div>
      {/* Browser Notifications */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <MdNotifications size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Browser Notifications
          </h3>

          <p className="mt-0.5 text-xs leading-5 text-gray-500">
            Receive important requirement updates
            directly in your browser.
          </p>
        </div>

        <Toggle
          enabled={enabled}
          loading={loading}
          onClick={handleToggle}
        />
      </div>

      {/* Push Notifications */}
      {/* <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <MdPhoneAndroid size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Push Notifications
          </h3>

          <p className="mt-0.5 text-xs leading-5 text-gray-500">
            Receive updates when you're using the
            app.
          </p>
        </div>

        <Toggle
          enabled={enabled}
          loading={loading}
          onClick={handleToggle}
        />
      </div> */}

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
