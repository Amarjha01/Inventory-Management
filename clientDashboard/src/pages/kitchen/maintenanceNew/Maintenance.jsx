import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiTool,
  FiUsers,
  FiShoppingBag,
} from "react-icons/fi";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import { themes } from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";

const tabs = [
  {
    path: "service",
    label: "Service",
    hindiLabel: "सर्विस",
    icon: FiTool,
  },
  {
    path: "visitor",
    label: "Visitor",
    hindiLabel: "विजिटर",
    icon: FiUsers,
  },
  {
    path: "purchase",
    label: "Purchase Record",
    hindiLabel: "परचेज रिकॉर्ड",
    icon: FiShoppingBag,
  },
];

const Maintenance = () => {
  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <ThemeProvider
      theme={themes.MAINTENANCE}
      className="min-h-full pb-24"
    >
      <PageHeader
            title="Maintenance"
            subtitle="Manage Service | Visitors | Purchase Records"
            imageUrl={'/ui/MAINTENANCE.png'}
          />
      <div className="shrink-0 border-b border-slate-200 bg-white">

        <div className="px-4 pt-4 sm:px-6 sm:pt-5">

          {/* =================================================
              TABS
          ================================================= */}
          <div className="flex items-end gap-1 overflow-x-auto">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) => `
                    group relative flex shrink-0 items-center gap-2
                    px-4 py-3
                    transition-all duration-200
                    sm:px-5

                    ${
                      isActive
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-700"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={16}
                        className={`
                          transition-colors
                          ${
                            isActive
                              ? "text-slate-900"
                              : "text-slate-400 group-hover:text-slate-600"
                          }
                        `}
                      />

                      <div className="flex flex-col">
                        <span className="text-xs font-semibold sm:text-sm">
                          {tab.label}
                        </span>

                        <span
                          className={`
                            text-[9px] sm:text-[10px]
                            ${
                              isActive
                                ? "text-slate-400"
                                : "text-slate-300"
                            }
                          `}
                        >
                          {tab.hindiLabel}
                        </span>
                      </div>

                      {/* Active indicator */}
                      <span
                        className={`
                          absolute bottom-0 left-2 right-2 h-0.5
                          rounded-full
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-slate-900 opacity-100"
                              : "bg-transparent opacity-0"
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>
        </div>
      </div>

      {/* =====================================================
          CHILD PAGE
          
          Service.jsx
          Visitor.jsx
          Purchase.jsx
          
          will render here through React Router <Outlet />
      ===================================================== */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
        </ThemeProvider>
    </div>
  );
};

export default Maintenance;