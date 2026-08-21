import { useState } from "react";
import {
  MdNotifications,
  MdNotificationsOff,
} from "react-icons/md";

import Button from "../ui/Button";

import {
  enablePushNotifications,
  unsubscribeFromPushNotifications,
} from "../../../services/notification.service";

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

      // Tell parent that notification was successfully enabled
      onChange(true);
    } catch (error) {
      console.error("Enable notification error:", error);

      setError(
        error.message ||
          "Failed to enable notifications."
      );

      // Make sure parent remains disabled
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

      // Tell parent that notification was successfully disabled
      onChange(false);
    } catch (error) {
      console.error("Disable notification error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to disable notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">

        {/* Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            enabled
              ? "bg-teal-50 text-teal-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {enabled ? (
            <MdNotifications size={26} />
          ) : (
            <MdNotificationsOff size={26} />
          )}
        </div>

        {/* Information */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              Browser Notifications
            </h3>

            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                enabled
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {enabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Receive important requirement updates
            directly in your browser.
          </p>
        </div>

        {/* Action */}
        {enabled ? (
          <Button
            onClick={handleDisable}
            disabled={loading}
          >
            {loading ? "Disabling..." : "Disable"}
          </Button>
        ) : (
          <Button
            onClick={handleEnable}
            disabled={loading}
          >
            {loading ? "Enabling..." : "Enable"}
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;