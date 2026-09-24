import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import { themes } from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";
import { storage } from "../../../utils/storage";


const Requirements = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState();
  const [stats, setStats] = useState({}); // Initialized as an object so dynamic access works safely



  // =========================================================
  // STATUS TABS
  // =========================================================
  
  const statusTabs = [
    {
      value: "Submitted",
      label: "Submitted",
    },
    {
      value: "Out For Delivery",
      label: "Out For Delivery",
    },
    {
      value: "Received",
      label: "Received",
    },
  ];

  useEffect(() => {
    setActive(storage.getActiveTab || "Submitted")
    setStats(storage.getStats() || {});
  }, []);

  return (
    <ThemeProvider theme={themes.REQUIREMENTS} className="min-h-full pb-24">
      <PageHeader
        title={`${active} Requirements`}
        subtitle="Manage kitchen material requests"
        imageUrl={"/ui/REQUIREMENTS.png"}
      />
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-gray-100 p-1">
        {statusTabs.map((tab) => {
          // FIXED: Check if this specific tab matches the active state string
          const isActive = active === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                setActive(tab.value);
                storage.setActiveTab(tab.value)
                navigate(`/store/requirements/${tab.value.trim()}`);
              }}
              className={`
                rounded-xl
                px-2
                py-3
                text-sm
                font-semibold
                transition-all
                ${
                  isActive
                    ? "bg-white text-(--theme-text) shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-center">{tab.label}</span>

                <span
                  className={`
                    text-xs
                    ${isActive ? "text-(--theme-text)" : "text-gray-400"}
                  `}
                >
                  {/* Dynamic stats lookup using tab.value or active */}
                  {stats?.[tab.value] ?? 0}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <Outlet />
    </ThemeProvider>
  );
};

export default Requirements;