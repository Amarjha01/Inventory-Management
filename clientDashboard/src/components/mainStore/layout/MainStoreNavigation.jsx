import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  MdAssignment,
  MdInventory,
  MdPeople,
  MdSettings,
  MdAssessment,
  MdMoreHoriz,
  MdClose,
} from "react-icons/md";

import { FaTruckMoving, FaUsers } from "react-icons/fa";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { storage } from "../../../utils/storage";
const user = storage.getUser();
const MainStoreNavbar = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const primaryMenus = [
    {
      title: "Requirements",
      icon: MdAssignment,
      path: "/store/requirements",
    },
    {
      title: "Inventory",
      icon: MdInventory,
      path: "/store/inventory",
    },
    {
      title: "Vehicles",
      icon: FaTruckMoving,
      path: "/store/vehicles",
    },
    {
      title: "Kitchens",
      icon: HiOutlineBuildingStorefront,
      path: "/store/kitchens",
    },
  ];

  const moreMenus = [
    {
      title: "Drivers",
      icon: MdPeople,
      path: "/store/drivers",
    },
    {
      title: "Users",
      icon: FaUsers,
      path: "/store/users",
    },
    {
      title: "Reports",
      icon: MdAssessment,
      path: "/store/reports",
    },
    {
      title: "Settings",
      icon: MdSettings,
      path: "/store/settings",
    },
  ];

  const isMoreActive = moreMenus.some(
    (menu) => location.pathname === menu.path
  );

  return (
    <>
       <header className="sticky top-2 mx-3 z-40  bg-white/30 backdrop-blur shadow-sm rounded-4xl">
        <div className="flex h-16 items-center justify-between px-5">

          <div className="flex items-center gap-3">
            <img
              src="/ESF_full_logo.avif"
              alt="ESF Logo"
              className="h-10 w-auto object-contain hidden sm:block"
            />
            <img
              src="/ESF_Logo.png"
              alt="ESF Logo"
              className="h-10 w-auto object-contain sm:hidden"
            />

            <div className=" h-8 w-px bg-gray-200" />

            <div>
               <p className="text-xs font-semibold text-[#1d215c]">
                Ekta Shakti Foundation
              </p>
              
              <h2 className="text-sm font-bold text-gray-900">Main Store Hajipur Industrial Area</h2>

              <p className="hidden md:block text-[10px] text-gray-500">
                Plot Number B67-68 Jandaha Road
              </p>
            </div>
          </div>

         <div className="flex items-center gap-3">
          <div className="text-right ">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>

            <p className="text-xs text-green-900 capitalize">{user?.role}</p>
          </div>

          {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-semibold text-white shadow-md">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div> */}
        </div>
        </div>
      </header>
      {/* Bottom Navigation */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-40
          border-t border-gray-200
          bg-white/95 backdrop-blur-xl
          shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
          pb-[env(safe-area-inset-bottom)]
        "
      >
        <div className="mx-auto flex h-[68px] max-w-2xl items-stretch px-2">
          {/* Primary menus */}
          {primaryMenus.map((menu) => {
            const active = location.pathname === menu.path;
            const Icon = menu.icon;

            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`
                  flex flex-1 flex-col items-center justify-center
                  gap-1 rounded-xl
                  transition-all duration-200
                  ${
                    active
                      ? "text-[#1f225f]"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <div
                  className={`
                    flex h-8 w-12 items-center justify-center rounded-full
                    transition-all
                    ${
                      active
                        ? "bg-[#1f225f]/10"
                        : "bg-transparent"
                    }
                  `}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`
                    text-[10px] leading-none
                    ${
                      active
                        ? "font-semibold text-[#1f225f]"
                        : "font-medium"
                    }
                  `}
                >
                  {menu.title}
                </span>
              </Link>
            );
          })}

          {/* More */}
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className={`
              flex flex-1 flex-col items-center justify-center
              gap-1 rounded-xl
              transition-all duration-200
              ${
                isMoreActive || moreOpen
                  ? "text-[#1f225f]"
                  : "text-gray-500"
              }
            `}
          >
            <div
              className={`
                flex h-8 w-12 items-center justify-center rounded-full
                ${
                  isMoreActive || moreOpen
                    ? "bg-[#1f225f]/10"
                    : "bg-transparent"
                }
              `}
            >
              {moreOpen ? (
                <MdClose size={23} />
              ) : (
                <MdMoreHoriz size={23} />
              )}
            </div>

            <span
              className={`
                text-[10px] leading-none
                ${
                  isMoreActive || moreOpen
                    ? "font-semibold text-[#1f225f]"
                    : "font-medium"
                }
              `}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Menu */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="
                fixed inset-0 z-30
                bg-black/20 backdrop-blur-[2px]
              "
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                fixed bottom-19 left-3 right-3 z-40
                mx-auto max-w-2xl
                overflow-hidden
                rounded-2xl
                border border-gray-100
                bg-white/30
                p-2
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <div className="px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  More
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1">
                {moreMenus.map((menu) => {
                  const active = location.pathname === menu.path;
                  const Icon = menu.icon;

                  return (
                    <Link
                      key={menu.path}
                      to={menu.path}
                      onClick={() => setMoreOpen(false)}
                      className={`
                        flex items-center gap-3
                        rounded-xl px-4 py-3
                        transition-colors
                        ${
                          active
                            ? "bg-teal-50 text-[#1f225f]"
                            : "text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex h-9 w-9 items-center justify-center
                          rounded-lg
                          ${
                            active
                              ? "bg-[#1f225f]/20 text-[#1f225f]"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        <Icon size={19} />
                      </div>

                      <span
                        className={`text-sm ${
                          active ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {menu.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainStoreNavbar;