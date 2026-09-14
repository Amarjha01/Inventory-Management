import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { MdDashboard, MdAddRoad, MdHistory, MdPerson } from "react-icons/md";

import { FaTruckMoving } from "react-icons/fa";

import { storage } from "../../utils/storage.js";

const TripNavigation = () => {
  const location = useLocation();

  const user = storage.getUser();

  const menus = [
    {
      title: "Home",
      icon: MdDashboard,
      path: "/trip",
    },
    {
      title: "New Trip",
      icon: MdAddRoad,
      path: "/trip/create",
    },
    {
      title: "History",
      icon: MdHistory,
      path: "/trip/history",
    },
    {
      title: "Profile",
      icon: MdPerson,
      path: "/trip/profile",
    },
  ];

  const isActive = (path) => {
    if (path === "/trip") {
      return location.pathname === "/trip";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* HEADER */}

      <header
        className="
                    sticky
                    top-2
                    mx-3
                    z-40
                    rounded-4xl
                    bg-white/70
                    backdrop-blur-xl
                    shadow-sm
                    border
                    border-white/60
                "
      >
        <div
          className="
                        flex
                        h-16
                        items-center
                        justify-between
                        px-4
                        sm:px-5
                    "
        >
          {/* LEFT */}

          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/ESF_Logo.png"
              alt="ESF"
              className="
                                h-10
                                w-10
                                object-contain
                                shrink-0
                            "
            />

            <div className="h-8 w-px bg-gray-200" />

            <div className="min-w-0">
              <p
                className="
                                    text-[10px]
                                    sm:text-xs
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
                                    truncate
                                "
              >
                Driver Portal
              </h2>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Driver"}
              </p>

              <p className="text-[11px] text-gray-500 capitalize">
                {user?.role || "Driver"}
              </p>
            </div>

            <div
              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-[#1f225f]/10
                                text-[#1f225f]
                                font-bold
                                text-sm
                            "
            >
              {user?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
          </div>
        </div>
      </header>

      {/* BOTTOM NAVIGATION */}

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
                        max-w-xl
                        items-stretch
                        px-2
                    "
        >
          {menus.map((menu) => {
            const active = isActive(menu.path);

            const Icon = menu.icon;

            return (
              <Link
                key={menu.path}
                to={menu.path}
                className="
                                    relative
                                    flex
                                    flex-1
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-1
                                    rounded-xl
                                "
              >
                {active && (
                  <motion.div
                    layoutId="trip-active-tab"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                    className="
                                            absolute
                                            inset-x-3
                                            top-1
                                            h-1
                                            rounded-full
                                            bg-[#1f225f]
                                        "
                  />
                )}

                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className={`
                                        flex
                                        h-8
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        transition-all
                                        duration-200

                                        ${
                                          active
                                            ? "bg-[#1f225f]/10 text-[#1f225f]"
                                            : "bg-transparent text-gray-500"
                                        }
                                    `}
                >
                  <Icon size={22} />
                </motion.div>

                <span
                  className={`
                                        text-[10px]
                                        leading-none

                                        ${
                                          active
                                            ? "font-semibold text-[#1f225f]"
                                            : "font-medium text-gray-500"
                                        }
                                    `}
                >
                  {menu.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default TripNavigation;
