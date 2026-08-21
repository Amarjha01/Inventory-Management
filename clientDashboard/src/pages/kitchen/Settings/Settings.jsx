import { useEffect, useState } from "react";

import Card from "../../../components/shared/ui/Card";
import NotificationSettings from "../../../components/shared/notifications/NotificationSettings";
import api from "../../../api/axios";
import { storage } from "../../../utils/storage";
import DashboardLayout from "../../../layouts/DashboardLayout";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(false);

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const settings = storage.getNotificationSettings();

    setNotificationsEnabled(
      settings?.notificationsEnabled ?? false
    );
  }, []);

  const handleNotificationChange = (enabled) => {
    console.log("Notification setting changed:", enabled);

    setNotificationsEnabled(enabled);

    storage.setNotificationSettings({
      notificationsEnabled: enabled,
    });

    setMessage({
      type: "success",
      text: enabled
        ? "Notifications enabled."
        : "Notifications disabled.",
    });

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleSendNotification = async () => {
    try {
      setSending(true);
      setMessage(null);

      await api.post("/notifications/test");

      setMessage({
        type: "success",
        text: "Test notification sent successfully.",
      });
    } catch (error) {
      console.error("Notification test failed:", error);

      setMessage({
        type: "error",
        text: "Failed to send test notification.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your application and notification preferences.
        </p>
      </div>

      <Card>
        <div className="space-y-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔔</span>

                <h2 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Manage notifications for your account.
              </p>
            </div>

            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                notificationsEnabled
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  notificationsEnabled
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />

              {notificationsEnabled
                ? "Enabled"
                : "Disabled"}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          <NotificationSettings
            enabled={notificationsEnabled}
            onChange={handleNotificationChange}
          />

          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? "✓ " : "⚠ "}
              {message.text}
            </div>
          )}

          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Test notification
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Send a test notification to this device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendNotification}
                disabled={sending || !notificationsEnabled}
                className="h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {sending
                  ? "Sending..."
                  : "Send Test Notification"}
              </button>
            </div>
          </div>

        </div>
      </Card>
    </div>
    </DashboardLayout>
  );
};

export default Settings;