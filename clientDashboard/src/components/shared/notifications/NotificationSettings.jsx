import { useState } from "react";

import {
  MdNotifications,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
} from "react-icons/md";

import {
  enablePushNotifications,
  unsubscribeFromPushNotifications,
} from "../../../services/notification.service";


// ==================================================
// TOGGLE
// ==================================================

const Toggle = ({
  enabled,
  loading,
  onClick,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={
        enabled
          ? "Disable browser notifications"
          : "Enable browser notifications"
      }
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
        focus:outline-none
        focus:ring-4
        focus:ring-teal-500/10

        ${
          enabled
            ? "bg-teal-600"
            : "bg-gray-300"
        }

        ${
          loading
            ? "cursor-wait opacity-60"
            : "cursor-pointer"
        }
      `}
    >

      {/* Knob */}

      <span
        className={`
          absolute
          top-1
          h-5
          w-5
          rounded-full
          bg-white
          shadow-sm
          transition-all
          duration-200

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


// ==================================================
// NOTIFICATION SETTINGS
// ==================================================

const NotificationSettings = ({
  enabled,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // ENABLE
  // ==================================================

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


  // ==================================================
  // DISABLE
  // ==================================================

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


  // ==================================================
  // TOGGLE
  // ==================================================

  const handleToggle = () => {
    if (loading) return;

    if (enabled) {
      handleDisable();
    } else {
      handleEnable();
    }
  };


  return (
    <div className="space-y-4">

      {/* =========================================
          BROWSER NOTIFICATIONS
      ========================================== */}

      <div className="
        rounded-2xl
        border
        border-gray-100
        bg-gray-50/70
        p-4
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

          {/* Icon */}

          <div className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl

            ${
              enabled
                ? "bg-teal-50 text-teal-600"
                : "bg-gray-100 text-gray-400"
            }
          `}>

            <MdNotifications size={23} />

          </div>


          {/* Content */}

          <div className="min-w-0 flex-1">

            <div className="
              flex
              flex-wrap
              items-center
              gap-2
            ">

              <h3 className="
                text-sm
                font-semibold
                text-gray-900
              ">
                Browser Notifications
              </h3>

              {/* Status */}

              <span className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2
                py-0.5
                text-[10px]
                font-semibold

                ${
                  enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }
              `}>

                <span className={`
                  h-1.5
                  w-1.5
                  rounded-full

                  ${
                    enabled
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }
                `} />

                {enabled
                  ? "Enabled"
                  : "Disabled"}

              </span>

            </div>


            <p className="
              mt-1
              text-xs
              leading-5
              text-gray-500
            ">
              Receive important requirement updates
              directly in your browser.
            </p>

          </div>


          {/* Toggle */}

          <Toggle
            enabled={enabled}
            loading={loading}
            onClick={handleToggle}
          />

        </div>


        {/* Loading */}

        {loading && (
          <div className="
            mt-3
            flex
            items-center
            gap-2
            border-t
            border-gray-200
            pt-3
            text-[11px]
            text-gray-500
          ">

            <span className="
              h-3
              w-3
              animate-spin
              rounded-full
              border-2
              border-gray-300
              border-t-teal-600"
            />

            {enabled
              ? "Disabling notifications..."
              : "Enabling notifications..."}

          </div>
        )}

      </div>


      {/* =========================================
          ENABLED INFORMATION
      ========================================== */}

      {enabled && !loading && !error && (

        <div className="
          flex
          items-start
          gap-3
          rounded-xl
          border
          border-green-100
          bg-green-50
          px-3.5
          py-3
        ">

          <MdCheckCircle
            size={18}
            className="
              mt-0.5
              shrink-0
              text-green-600
            "
          />

          <div>

            <p className="
              text-xs
              font-semibold
              text-green-800
            ">
              Notifications are active
            </p>

            <p className="
              mt-0.5
              text-[11px]
              leading-4
              text-green-700
            ">
              You'll receive important updates
              from the store directly in this browser.
            </p>

          </div>

        </div>

      )}


      {/* =========================================
          DISABLED INFORMATION
      ========================================== */}

      {!enabled && !loading && !error && (

        <div className="
          flex
          items-start
          gap-3
          rounded-xl
          border
          border-blue-100
          bg-blue-50
          px-3.5
          py-3
        ">

          <MdInfoOutline
            size={18}
            className="
              mt-0.5
              shrink-0
              text-blue-600
            "
          />

          <div>

            <p className="
              text-xs
              font-semibold
              text-blue-800
            ">
              Notifications are disabled
            </p>

            <p className="
              mt-0.5
              text-[11px]
              leading-4
              text-blue-700
            ">
              Enable them to receive requirement
              and delivery updates.
            </p>

          </div>

        </div>

      )}


      {/* =========================================
          ERROR
      ========================================== */}

      {error && (

        <div className="
          flex
          items-start
          gap-3
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-3.5
          py-3
        ">

          <MdErrorOutline
            size={18}
            className="
              mt-0.5
              shrink-0
              text-red-600
            "
          />

          <div>

            <p className="
              text-xs
              font-semibold
              text-red-800
            ">
              Notification update failed
            </p>

            <p className="
              mt-0.5
              text-[11px]
              leading-4
              text-red-600
            ">
              {error}
            </p>

          </div>

        </div>

      )}

    </div>
  );
};

export default NotificationSettings;