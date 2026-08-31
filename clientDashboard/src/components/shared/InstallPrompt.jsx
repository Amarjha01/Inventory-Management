import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running as an installed PWA
    const standalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    const fullscreen = window.matchMedia(
      "(display-mode: fullscreen)"
    ).matches;

    const iosStandalone = window.navigator.standalone === true;

    if (standalone || fullscreen || iosStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="install-btn"
        aria-label="Install App"
      >
        <span className="install-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 3V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 21H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span className="install-content">
          <span className="install-title">Install App</span>
          <span className="install-subtitle">
            Get the best experience
          </span>
        </span>

        <span className="install-arrow">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <style>{`
        .install-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-width: 190px;
          padding: 10px 14px 10px 10px;
          border: 1px solid rgba(30, 34, 95, 0.15);
          border-radius: 14px;
          background: #ffffff;
          color: #1e225f;
          box-shadow:
            0 4px 12px rgba(30, 34, 95, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
          font-family: inherit;
          text-align: left;
          outline: none;
        }

        .install-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(30, 34, 95, 0.3);
          background: #fafaff;
          box-shadow:
            0 8px 20px rgba(30, 34, 95, 0.14),
            0 2px 5px rgba(0, 0, 0, 0.06);
        }

        .install-btn:active {
          transform: translateY(0);
          box-shadow:
            0 3px 8px rgba(30, 34, 95, 0.1);
        }

        .install-btn:focus-visible {
          box-shadow:
            0 0 0 3px rgba(30, 34, 95, 0.18),
            0 6px 16px rgba(30, 34, 95, 0.12);
        }

        .install-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #1e225f;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(30, 34, 95, 0.2);
        }

        .install-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .install-title {
          color: #1e225f;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.2;
        }

        .install-subtitle {
          color: #73758c;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.3;
          white-space: nowrap;
        }

        .install-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #1e225f;
          opacity: 0.65;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .install-btn:hover .install-arrow {
          transform: translateX(3px);
          opacity: 1;
        }

        @media (max-width: 480px) {
          .install-btn {
            min-width: 170px;
            padding: 8px 11px 8px 8px;
            gap: 9px;
            border-radius: 12px;
          }

          .install-icon {
            width: 38px;
            height: 38px;
            border-radius: 9px;
          }

          .install-title {
            font-size: 13px;
          }

          .install-subtitle {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default InstallPrompt;
