import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBell,
  FiChevronDown,
  FiChevronRight,
  FiInfo,
  FiLogOut,
  FiHeadphones,
  FiShield,
  FiUser,
  FiSend,
  FiAlertCircle,
} from "react-icons/fi";
import { MdAutoAwesomeMosaic, MdNotificationsActive } from "react-icons/md";

import Card from "../../../components/shared/ui/Card";
import NotificationSettings from "../../../components/shared/notifications/NotificationSettings";
import api from "../../../api/axios";
import { storage } from "../../../utils/storage";
import DashboardLayout from "../../../layouts/DashboardLayout";
import KitchenInfo from "../../../components/kitchen/requirement/KitchenInfo";
import { logout } from "../../../services/auth.service";
import toast from "react-hot-toast";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import {themes} from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";
import InstallPrompt from "../../../components/shared/InstallPrompt";
const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(true);

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const settings = storage.getNotificationSettings();

    setNotificationsEnabled(
      settings?.notificationsEnabled ?? false
    );
  }, []);

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

  const handleSendNotification = async () => {
    try {
      setSending(true);
      setMessage(null);

      const res = await api.post("/notifications/test");
        console.log(res);

      setMessage({
        type: "success",
        text: "Test notification sent successfully.",
      });
    } catch (error) {
      console.error("Notification test failed:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to send test notification.",
      });
    } finally {
      setSending(false);
    }
  };

  const settingsItems = [
    
    // {
    //   icon: FiShield,
    //   title: "Privacy",
    //   description: "Manage your privacy settings.",
    // },
    {
      icon: FiInfo,
      title: "About App",
      description: "Version 1.0.0",
    },
  ];
  const handleLogOut = async()=>{
    const logOut = await logout();
    toast.success(logOut.message);
    storage.logout();
    window.location.href = "/login"
  }
  return (
    <DashboardLayout>
      <ThemeProvider
      theme={themes.SETTINGS}
      className="min-h-full pb-24"
    >
      <div className="mx-auto w-full max-w-2xl pb-24">
     <PageHeader
            title="Settings"
            subtitle="Manage your preferences and account settings."
            imageUrl={'/ui/type/SETTING.png'}
          />
        {/* Notifications */}
        <Card className="mt-4 overflow-hidden !p-0">
          {/* Notification Header */}
          <button
            type="button"
            onClick={() =>
              setNotificationsOpen((previous) => !previous)
            }
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className=" flex
    h-11
    w-11
    items-center
    justify-center
    rounded-xl
    bg-(--theme-primary-light)
    text-(--theme-primary)">
                <FiBell size={22} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-(--theme-text)">
                  Notifications
                </h2>

                <p className="mt-0.5 text-xs text-(--theme-text-secondary)">
                  Manage how you receive updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
  className={`
    rounded-full
    px-3
    py-1
    text-[11px]
    font-semibold

    ${
      notificationsEnabled
        ? "bg-green-50 text-green-600"
        : "bg-gray-100 text-gray-500"
    }
  `}
>
  {notificationsEnabled
    ? "● Enabled"
    : "● Disabled"}
</span>

              <FiChevronDown
  size={18}
  className={`
    text-(--theme-text-secondary)
    transition-transform
    ${notificationsOpen ? "" : "-rotate-90"}
  `}
/>
            </div>
          </button>

          {notificationsOpen && (
            <div className="border-t border-(--theme-border)">
              <NotificationSettings
                enabled={notificationsEnabled}
                onChange={handleNotificationChange}
              />

              {/* Message */}
              {message && (
  <div
    className={`
      mx-4
      mb-4
      rounded-xl
      border
      px-4
      py-3
      text-xs
      font-medium

      ${
        message.type === "success"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }
    `}
  >
    {message.type === "success" ? "✓ " : "⚠ "}
    {message.text}
  </div>
)}

              {/* Test notification */}
             <div
  className="
    mx-4
    mb-4
    rounded-2xl
    border
    border-(--theme-border)
    bg-(--theme-surface-alt)
    p-4
  "
>
  <div className="flex items-center justify-between gap-4">

    <div>
      <h3
        className="
          text-sm
          font-semibold
          text-(--theme-text)
        "
      >
        Test Notification
      </h3>

      <p
        className="
          mt-1
          text-xs
          leading-5
          text-(--theme-text-secondary)
        "
      >
        Send a test notification to this device.
      </p>
    </div>

    <button
      type="button"
      onClick={handleSendNotification}
      disabled={
        sending || !notificationsEnabled
      }
      className="
        flex
        shrink-0
        items-center
        gap-2
        rounded-xl
        border
        border-(--theme-primary)
        bg-(--theme-surface)
        px-4
        py-2.5
        text-xs
        font-semibold
        text-(--theme-primary)
        transition

        hover:bg-(--theme-primary-light)

        disabled:cursor-not-allowed
        disabled:border-gray-300
        disabled:text-gray-400
      "
    >
      <FiSend size={15} />

      {sending
        ? "Sending..."
        : "Send Test"}
    </button>

  </div>
</div>
            </div>
          )}
        </Card>

                  {/* Account */}
<div className="mt-4">
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
    <button
      type="button"
      onClick={() =>
        setAccountOpen((previous) => !previous)
      }
      className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-(--theme-surface-alt)"
    >
      <div
  className="
    flex
    h-11
    w-11
    shrink-0
    items-center
    justify-center
    rounded-xl
    bg-(--theme-primary-light)
    text-(--theme-primary)
  "
>
  <FiUser size={21} />
</div>

      <div className="min-w-0 flex-1">
       <h3 className="text-sm font-semibold text-(--theme-text)">
  Account
</h3>

<p className="mt-0.5 text-xs text-(--theme-text-secondary)">
  View and manage your account details.
</p>
      </div>

      <FiChevronDown
        size={19}
        className={`shrink-0 text-gray-500 transition-transform ${
          accountOpen ? "" : "-rotate-90"
        }`}
      />
    </button>

    {accountOpen && (
      <div className="border-t
    border-(--theme-border)
    bg-(--theme-surface-alt)
    p-3">
        <KitchenInfo />
      </div>
    )}
  </div>
</div>

    
        {/* Other Settings */}
        <div className="mt-4 space-y-2">
          {settingsItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                className="
    flex
    w-full
    items-center
    gap-3
    rounded-2xl
    border
    border-(--theme-border)
    bg-(--theme-surface)
    p-4
    text-left
    shadow-sm
    transition

    hover:bg-(--theme-surface-alt)
  "
              >
                <div className="
    flex
    h-11
    w-11
    shrink-0
    items-center
    justify-center
    rounded-xl
    bg-(--theme-primary-light)
    text-(--theme-primary)
  ">
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-(--theme-text)">
  {item.title}
</h3>

<p className="mt-0.5 text-xs text-(--theme-text-secondary)">
  {item.description}
</p>
                </div>

                <FiChevronRight
  size={19}
  className="shrink-0 text-(--theme-text-secondary)"
/>
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogOut}
          type="button"
          className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-red-200 bg-red-50/30 p-4 text-left transition hover:bg-red-50"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <FiLogOut size={21} />
          </div>

          <div className="flex-1">
            <h3  className="text-sm font-semibold text-red-600">
              Logout
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Sign out from your account
            </p>
          </div>

          <FiChevronRight
            size={19}
            className="text-red-400"
          />
        </button>

        <div className="mt-4">


        </div>
      </div>
      <InstallPrompt />
      </ThemeProvider>
    </DashboardLayout>
  );
};

export default Settings;
