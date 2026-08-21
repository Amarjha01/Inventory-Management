import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  MdMenu,
  MdClose,
  MdAssignment,
  MdInventory,
  MdPeople,
  MdSettings,
  MdAssessment,
} from "react-icons/md";

import { FaTruckMoving, FaUsers } from "react-icons/fa";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { storage } from "../../../utils/storage";
const MainStoreNavbar = () => {
    const user = storage.getUser();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menus = [
    {
      title: "Requirements",
      icon: <MdAssignment size={22} />,
      path: "/store/requirements",
    },
    {
      title: "Inventory",
      icon: <MdInventory size={22} />,
      path: "/store/inventory",
    },
    {
      title: "Vehicles",
      icon: <FaTruckMoving size={22} />,
      path: "/store/vehicles",
    },
    {
      title: "Drivers",
      icon: <MdPeople size={22} />,
      path: "/store/drivers",
    },
    {
      title: "Users",
      icon: <FaUsers size={22} />,
      path: "/store/users",
    },
    {
      title: "Kitchens",
      icon: <HiOutlineBuildingStorefront size={22} />,
      path: "/store/kitchens",
    },
     {
    title: "Reports",
    icon: <MdAssessment size={20} />,
    path: "/store/reports",
},
    {
      title: "Settings",
      icon: <MdSettings size={22} />,
      path: "/store/settings",
    },
   
  ];

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="flex h-16 items-center justify-between px-5">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
          >
            <MdMenu size={28} />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/ESF_full_logo.avif"
              alt="ESF Logo"
              className="h-10 w-auto object-contain hidden sm:block"
            />

            <div className="hidden sm:block h-8 w-px bg-gray-200" />

            <div>
               <p className="text-xs font-semibold text-teal-700">
                Ekta Shakti Foundation
              </p>
              
              <h2 className="text-sm font-bold text-gray-900">Main Store Hajipur Industrial Area</h2>

              <p className="hidden md:block text-[10px] text-gray-500">
                Plot Number B6768 Jandaha Road
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

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl"
            >
              {/* Sidebar Header */}
              <div className="flex h-16 items-center justify-between border-b px-5">
                <div className="flex items-center gap-3">
                  <img src="/ESF_full_logo.avif" alt="ESF" className="h-8" />

                  <h2 className="font-bold text-gray-800">Store</h2>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* Menu */}
              <nav className="mt-4 px-3 space-y-1">
                {menus.map((menu) => {
                  const active = location.pathname === menu.path;

                  return (
                    <Link
                      key={menu.path}
                      to={menu.path}
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center gap-4 rounded-xl px-4 py-3
                        transition-all
                        ${
                          active
                            ? "bg-teal-50 text-teal-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                    >
                      <span
                        className={active ? "text-teal-600" : "text-gray-500"}
                      >
                        {menu.icon}
                      </span>

                      <span>{menu.title}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-700">
                  Ekta Shakti Foundation
                </p>

                <p className="mt-1 text-[11px] text-gray-500">
                  Main Store Management
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainStoreNavbar;
