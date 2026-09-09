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
import { VscVmPending } from "react-icons/vsc";
import { RiImageDownloadFill } from "react-icons/ri";

import { storage } from "../../../utils/storage";

const MainStoreNavbar = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const user = storage.getUser();

  /*
  |--------------------------------------------------------------------------
  | Menus
  |--------------------------------------------------------------------------
  */

  const primaryMenus = [
    {
      title: "Requirements",
      icon: MdAssignment,
      path: "/store/requirements",
    },
    {
      title: "Pending",
      icon: VscVmPending,
      path: "/store/pending",
    },
    {
      title: "Inventory",
      icon: MdInventory,
      path: "/store/inventory",
    },
    {
      title: "Users",
      icon: FaUsers,
      path: "/store/users",
    },
  ];

  const moreMenus = [
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
    {
      title: "Drivers",
      icon: MdPeople,
      path: "/store/drivers",
    },
    {
      title: "Reports",
      icon: MdAssessment,
      path: "/store/reports",
    },
    {
      title: "Downloads",
      icon: RiImageDownloadFill,
      path: "/store/downloads",
    },
    {
      title: "Settings",
      icon: MdSettings,
      path: "/store/settings",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Role permissions
  |--------------------------------------------------------------------------
  */

  const fullAccessRoles = ["Admin", "Store Supervisor"];

  const restrictedRoles = ["district coordinator", "Chief Coordinator"];

  /*
  |--------------------------------------------------------------------------
  | Current user role
  |--------------------------------------------------------------------------
  */

  const userRole = user?.role?.trim();

  const hasFullAccess = fullAccessRoles.includes(userRole);

  const hasRestrictedAccess = restrictedRoles.includes(userRole);

  /*
  |--------------------------------------------------------------------------
  | Restricted menu paths
  |--------------------------------------------------------------------------
  |
  | These are the ONLY menus available to:
  |
  | - district coordinator
  | - Chief Coordinator
  |
  */

  const restrictedPaths = [
    "/store/requirements",
    "/store/pending",
    "/store/inventory",
    "/store/reports",
    "/store/downloads",
    "/store/settings",
  ];

  /*
  |--------------------------------------------------------------------------
  | Visible Primary Menus
  |--------------------------------------------------------------------------
  */

  const visiblePrimaryMenus = primaryMenus.filter((menu) => {
    // Admin + Store Supervisor
    // Can see everything
    if (hasFullAccess) {
      return true;
    }

    // District Coordinator +
    // Chief Coordinator
    if (hasRestrictedAccess) {
      return restrictedPaths.includes(menu.path);
    }

    // Unknown roles see nothing
    return false;
  });

  /*
  |--------------------------------------------------------------------------
  | Visible More Menus
  |--------------------------------------------------------------------------
  */

  const visibleMoreMenus = moreMenus.filter((menu) => {
    // Admin + Store Supervisor
    // Can see everything
    if (hasFullAccess) {
      return true;
    }

    // District Coordinator +
    // Chief Coordinator
    if (hasRestrictedAccess) {
      return restrictedPaths.includes(menu.path);
    }

    // Unknown roles see nothing
    return false;
  });

  /*
  |--------------------------------------------------------------------------
  | More active state
  |--------------------------------------------------------------------------
  */

  const isMoreActive = visibleMoreMenus.some(
    (menu) => location.pathname === menu.path,
  );

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* ==========================================================
          HEADER
      ========================================================== */}

      <header
        className="
          sticky
          top-2
          mx-3
          z-40
          bg-white/30
          backdrop-blur
          shadow-sm
          rounded-4xl
        "
      >
        <div
          className="
            flex
            h-16
            items-center
            justify-between
            px-5
          "
        >
          {/* ======================================================
              STORE INFO
          ====================================================== */}

          <div className="flex items-center gap-3">
            {/* Desktop Logo */}

            <img
              src="/ESF_full_logo.avif"
              alt="ESF Logo"
              className="
                h-10
                w-auto
                object-contain
                hidden
                sm:block
              "
            />

            {/* Mobile Logo */}

            <img
              src="/ESF_Logo.png"
              alt="ESF Logo"
              className="
                h-10
                w-auto
                object-contain
                sm:hidden
              "
            />

            <div
              className="
                h-8
                w-px
                bg-gray-200
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  text-[#1d215c]
                "
              >
                Ekta Shakti Foundation
              </p>

              <h2
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                Main Store Hajipur Industrial Area
              </h2>

              <p
                className="
                  hidden
                  md:block
                  text-[10px]
                  text-gray-500
                "
              >
                Plot Number B67-68 Jandaha Road
              </p>
            </div>
          </div>

          {/* ======================================================
              USER INFO
          ====================================================== */}

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                {user?.name}
              </p>

              <p
                className="
                  text-xs
                  text-green-900
                  capitalize
                "
              >
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================================
          BOTTOM NAVIGATION
      ========================================================== */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-40
          border-t
          border-gray-200
          bg-white/95
          backdrop-blur-xl
          shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
          pb-[env(safe-area-inset-bottom)]
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[68px]
            max-w-2xl
            items-stretch
            px-2
          "
        >
          {/* ======================================================
              PRIMARY MENUS
          ====================================================== */}

          {visiblePrimaryMenus.map((menu) => {
            const active = location.pathname === menu.path;

            const Icon = menu.icon;

            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`
                    flex
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    rounded-xl
                    transition-all
                    duration-200

                    ${
                      active
                        ? "text-[#1f225f]"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
              >
                {/* Icon */}

                <div
                  className={`
                      flex
                      h-8
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      transition-all

                      ${active ? "bg-[#1f225f]/10" : "bg-transparent"}
                    `}
                >
                  <Icon size={22} />
                </div>

                {/* Label */}

                <span
                  className={`
                      text-[10px]
                      leading-none

                      ${active ? "font-semibold text-[#1f225f]" : "font-medium"}
                    `}
                >
                  {menu.title}
                </span>
              </Link>
            );
          })}

          {/* ======================================================
              MORE BUTTON
          ====================================================== */}

          {visibleMoreMenus.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`
                flex
                flex-1
                flex-col
                items-center
                justify-center
                gap-1
                rounded-xl
                transition-all
                duration-200

                ${isMoreActive || moreOpen ? "text-[#1f225f]" : "text-gray-500"}
              `}
            >
              <div
                className={`
                  flex
                  h-8
                  w-12
                  items-center
                  justify-center
                  rounded-full

                  ${
                    isMoreActive || moreOpen
                      ? "bg-[#1f225f]/10"
                      : "bg-transparent"
                  }
                `}
              >
                {moreOpen ? <MdClose size={23} /> : <MdMoreHoriz size={23} />}
              </div>

              <span
                className={`
                  text-[10px]
                  leading-none

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
          )}
        </div>
      </nav>

      {/* ==========================================================
          MORE MENU
      ========================================================== */}

      <AnimatePresence>
        {moreOpen && visibleMoreMenus.length > 0 && (
          <>
            {/* ==================================================
                  BACKDROP
              ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setMoreOpen(false)}
              className="
                  fixed
                  inset-0
                  z-30
                  bg-black/20
                  backdrop-blur-[2px]
                "
            />

            {/* ==================================================
                  BOTTOM SHEET
              ================================================== */}

            <motion.div
              initial={{
                y: 30,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 30,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                  fixed
                  bottom-19
                  left-3
                  right-3
                  z-40
                  mx-auto
                  max-w-2xl
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white/30
                  p-2
                  shadow-2xl
                  backdrop-blur-xl
                "
            >
              {/* ==================================================
                    TITLE
                ================================================== */}

              <div className="px-3 py-2">
                <p
                  className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-400
                    "
                >
                  More
                </p>
              </div>

              {/* ==================================================
                    MORE ITEMS
                ================================================== */}

              <div className="grid grid-cols-2 gap-1">
                {visibleMoreMenus.map((menu) => {
                  const active = location.pathname === menu.path;

                  const Icon = menu.icon;

                  return (
                    <Link
                      key={menu.path}
                      to={menu.path}
                      onClick={() => setMoreOpen(false)}
                      className={`
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            transition-colors

                            ${
                              active
                                ? "bg-teal-50 text-[#1f225f]"
                                : "text-gray-600 hover:bg-gray-50"
                            }
                          `}
                    >
                      {/* Icon */}

                      <div
                        className={`
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
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

                      {/* Label */}

                      <span
                        className={`
                              text-sm

                              ${active ? "font-semibold" : "font-medium"}
                            `}
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
