import { useEffect, useState } from "react";

import Card from "../../../components/shared/ui/Card";
import NotificationSettings from "../../../components/shared/notifications/NotificationSettings";
import api from "../../../api/axios";
import { storage } from "../../../utils/storage";
import PageHeader from "../../../components/shared/ui/PageHeader";
import { themes } from "../../../components/shared/ui/Theme";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import InstallPrompt from "../../../components/shared/InstallPrompt";
const Settings = () => {
  // ----------------------------------------
  // Admin's own notification setting
  // ----------------------------------------

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(false);

  const [message, setMessage] = useState(null);

  // ----------------------------------------
  // Admin notification form
  // ----------------------------------------

  const [audience, setAudience] = useState("kitchen");

  const [kitchenId, setKitchenId] = useState("");
  const [districtId, setDistrictId] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");

  const [sending, setSending] = useState(false);

  // ----------------------------------------
  // Data
  // ----------------------------------------

  const [kitchens, setKitchens] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [loadingKitchens, setLoadingKitchens] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // ----------------------------------------
  // Load saved notification preference
  // ----------------------------------------

  useEffect(() => {
    const settings = storage.getNotificationSettings();

    setNotificationsEnabled(
      settings?.notificationsEnabled ?? false,
    );
  }, []);

  // ----------------------------------------
  // Load kitchens
  // ----------------------------------------

  useEffect(() => {
    const loadKitchens = async () => {
      try {
        setLoadingKitchens(true);

        const { data } = await api.get("/kitchens");

        setKitchens(data?.data || data || []);
      } catch (error) {
        console.error("Failed to load kitchens:", error);
      } finally {
        setLoadingKitchens(false);
      }
    };

    loadKitchens();
  }, []);

  // ----------------------------------------
  // Load districts
  // ----------------------------------------

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setLoadingDistricts(true);

        const { data } = await api.get("/districts");

        setDistricts(data?.data || data || []);
      } catch (error) {
        console.error("Failed to load districts:", error);
      } finally {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, []);

  // ----------------------------------------
  // Logout
  // ----------------------------------------

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?",
    );

    if (!confirmed) {
      return;
    }

    try {
      /*
       * Clear authentication data.
       *
       * If your storage utility has a dedicated logout/clearAuth
       * method, you can use that instead.
       */
      if (typeof storage.clearAuth === "function") {
        storage.clearAuth();
      } else {
        /*
         * Fallback: remove common auth keys.
         *
         * Keep/add the exact keys used by your application here.
         */
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }

      /*
       * Redirect to login page.
       */
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);

      /*
       * Even if storage cleanup fails, redirect the user.
       */
      window.location.href = "/login";
    }
  };

  // ----------------------------------------
  // Admin's notification setting
  // ----------------------------------------

  const handleNotificationChange = (enabled) => {
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

  // ----------------------------------------
  // Send admin notification
  // ----------------------------------------

  const handleSendNotification = async () => {
    if (!title.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a notification title.",
      });

      return;
    }

    if (!body.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a notification message.",
      });

      return;
    }

    if (audience === "kitchen" && !kitchenId) {
      setMessage({
        type: "error",
        text: "Please select a kitchen.",
      });

      return;
    }

    if (audience === "district" && !districtId) {
      setMessage({
        type: "error",
        text: "Please select a district.",
      });

      return;
    }

    try {
      setSending(true);
      setMessage(null);

      await api.post("/notifications/admin/send", {
        audience,

        kitchenId:
          audience === "kitchen"
            ? kitchenId
            : undefined,

        districtId:
          audience === "district"
            ? districtId
            : undefined,

        title: title.trim(),

        body: body.trim(),

        data: {
          url: url.trim() || "/",
        },
      });

      setMessage({
        type: "success",
        text: "Notification sent successfully.",
      });

      // Reset message fields
      setTitle("");
      setBody("");
      setUrl("/");
      setKitchenId("");
      setDistrictId("");
    } catch (error) {
      console.error(
        "Failed to send notification:",
        error,
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to send notification.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
       <ThemeProvider
      theme={themes.SETTINGS}
      className="min-h-full pb-24"
    >
      {/* ----------------------------------------
          PAGE HEADER
      ----------------------------------------- */}
      <PageHeader 
      title={"Settings"} 
      subtitle={"Manage notifications and administrator preferences."} 
      imageUrl={'/ui/type/SETTING.png'}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* ----------------------------------------
            LOGOUT BUTTON
        ----------------------------------------- */}

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-300"
        >
          <span>↪</span>
          Logout
        </button>
      </div>

      {/* ----------------------------------------
          ADMIN DEVICE NOTIFICATIONS
      ----------------------------------------- */}

      <Card>
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔔</span>

                <h2 className="text-lg font-semibold text-gray-900">
                  My Notifications
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Manage notifications for this admin device.
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
        </div>
      </Card>

      {/* ----------------------------------------
          SEND NOTIFICATION
      ----------------------------------------- */}

      <Card>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📢</span>

              <h2 className="text-lg font-semibold text-gray-900">
                Send Notification
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Send a custom notification to kitchens or users.
            </p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Audience */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Send To
            </label>

            <select
              value={audience}
              onChange={(e) => {
                setAudience(e.target.value);
                setKitchenId("");
                setDistrictId("");
              }}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="kitchen">
                Specific Kitchen
              </option>

              <option value="all_users">
                All Users
              </option>
            </select>
          </div>

          {/* Specific Kitchen */}

          {audience === "kitchen" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select Kitchen
              </label>

              <select
                value={kitchenId}
                onChange={(e) =>
                  setKitchenId(e.target.value)
                }
                disabled={loadingKitchens}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">
                  {loadingKitchens
                    ? "Loading kitchens..."
                    : "Select kitchen"}
                </option>

                {kitchens.map((kitchen) => (
                  <option
                    key={kitchen._id}
                    value={kitchen._id}
                  >
                    {kitchen.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* District */}

          {audience === "district" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select District
              </label>

              <select
                value={districtId}
                onChange={(e) =>
                  setDistrictId(e.target.value)
                }
                disabled={loadingDistricts}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">
                  {loadingDistricts
                    ? "Loading districts..."
                    : "Select district"}
                </option>

                {districts.map((district) => (
                  <option
                    key={district._id}
                    value={district._id}
                  >
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Notification Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. New Requirement Update"
              maxLength={100}
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Body */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Message
            </label>

            <textarea
              value={body}
              onChange={(e) =>
                setBody(e.target.value)
              }
              placeholder="Enter notification message..."
              rows={4}
              maxLength={300}
              className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {body.length}/300
            </p>
          </div>

          {/* URL */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Open URL
            </label>

            <input
              type="text"
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              placeholder="/requirements"
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Preview */}

          {(title || body) && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Preview
              </p>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  🔔
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {title || "Notification title"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {body ||
                      "Notification message will appear here."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message */}

          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success"
                ? "✓ "
                : "⚠ "}

              {message.text}
            </div>
          )}

          {/* Send */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSendNotification}
              disabled={sending}
              className="h-11 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {sending
                ? "Sending..."
                : "📢 Send Notification"}
            </button>
          </div>
        </div>
      </Card>
      <InstallPrompt />
      </ThemeProvider>
    </div>
  );
};

export default Settings;
