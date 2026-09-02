import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFileText, FiPackage, FiFilter } from "react-icons/fi";

import Card from "../../../components/shared/ui/Card";
import Loader from "../../../components/shared/ui/Loader";

import { getAllKitchenRequirements } from "../../../services/requirement.service";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import { themes } from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";
import { enablePushNotifications } from "../../../services/notification.service";

const REQUIREMENTS_STATE_KEY = "requirements-page-state";

const Requirements = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(() => {
    try {
      const saved = sessionStorage.getItem(REQUIREMENTS_STATE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        return parsed.search || "";
      }
    } catch (error) {
      console.error("Failed to restore search state:", error);
    }

    return "";
  });

  const [activeStatus, setActiveStatus] = useState(() => {
    try {
      const saved = sessionStorage.getItem(REQUIREMENTS_STATE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        return parsed.activeStatus || "Submitted";
      }
    } catch (error) {
      console.error("Failed to restore requirements state:", error);
    }

    return "Submitted";
  });

  const [dateFilter, setDateFilter] = useState(() => {
    try {
      const saved = localStorage.getItem(REQUIREMENTS_STATE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        return parsed.dateFilter || "All";
      }
    } catch (error) {
      console.error("Failed to restore date filter:", error);
    }

    return "All";
  });

  useEffect(() => {
    if (loading) return;

    const saved = sessionStorage.getItem(REQUIREMENTS_STATE_KEY);

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (typeof parsed.scrollY !== "number") return;

      // Wait for the DOM to render the requirement cards
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parsed.scrollY,
            behavior: "instant",
          });
        });
      });
    } catch (error) {
      console.error("Failed to restore scroll position:", error);
    }
  }, [loading]);

  useEffect(() => {
    enablePushNotifications();
    const load = async () => {
      try {
        const data = await getAllKitchenRequirements();

        setRequirements(data || []);
      } catch (error) {
        console.error(error);
        setRequirements([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

  // =========================================================
  // STATUS COUNTS
  // =========================================================

  const statusCounts = useMemo(() => {
    return {
      Submitted: requirements.filter((item) => item.status === "Submitted")
        .length,

      "Out For Delivery": requirements.filter(
        (item) => item.status === "Out For Delivery",
      ).length,

      Received: requirements.filter((item) => item.status === "Received")
        .length,
    };
  }, [requirements]);

  // =========================================================
  // FILTER REQUIREMENTS
  // =========================================================

  const filteredRequirements = useMemo(() => {
    let result = requirements.filter((item) => item.status === activeStatus);

    // =========================================
    // DATE FILTER
    // =========================================

    if (dateFilter !== "All") {
      const now = new Date();

      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      const startOfYesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );

      if (dateFilter === "Today") {
        result = result.filter((item) => {
          const createdAt = new Date(item.dispatch.dispatchedAt || item.createdAt);

          return createdAt >= startOfToday;
        });
      }

      if (dateFilter === "Yesterday") {
        result = result.filter((item) => {
          const createdAt = new Date(item.dispatch.dispatchedAt || item.createdAt);

          return createdAt >= startOfYesterday && createdAt < startOfToday;
        });
      }

      if (dateFilter === "Older") {
        result = result.filter((item) => {
          const createdAt = new Date(item.dispatch.dispatchedAt || item.createdAt);

          return createdAt < startOfYesterday;
        });
      }
    }

    // =========================================
    // SEARCH
    // =========================================

    if (search.trim()) {
      const searchValue = search.trim().toLowerCase();

      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchValue),
      );
    }

    return result;
  }, [requirements, activeStatus, dateFilter, search]);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const statusStyle = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-700";

      case "Out For Delivery":
        return "bg-purple-100 text-purple-700";

      case "Received":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <ThemeProvider theme={themes.REQUIREMENTS} className="min-h-full pb-24">
        <PageHeader
          title="Requirements"
          subtitle="Manage kitchen material requests"
          imageUrl={"/ui/REQUIREMENTS.png"}
        />
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        ></motion.div>

        {/* =====================================================
          STATUS TABS
      ====================================================== */}

        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-gray-100 p-1">
          {statusTabs.map((tab) => {
            const active = activeStatus === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveStatus(tab.value);
                  setSearch("");

                  const existing = sessionStorage.getItem(
                    REQUIREMENTS_STATE_KEY,
                  );

                  const saved = existing ? JSON.parse(existing) : {};

                  sessionStorage.setItem(
                    REQUIREMENTS_STATE_KEY,
                    JSON.stringify({
                      ...saved,
                      activeStatus: tab.value,
                      search: "",
                      scrollY: 0,
                    }),
                  );

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className={`
                rounded-xl
                px-2
                py-3
                text-sm
                font-semibold
                transition-all
                ${
                  active
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
                    ${active ? "text-(--theme-text)" : "text-gray-400"}
                  `}
                  >
                    {statusCounts[tab.value] || 0}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* =====================================================
          SEARCH
      ====================================================== */}

        <div className="flex gap-2">
          {/* SEARCH */}
          <div className="relative flex-1">
            <FiSearch
              className="
        absolute
        left-3
        top-1/2
        -translate-y-1/2
        text-gray-400
      "
            />

            <input
              value={search}
              onChange={(e) => {
                const value = e.target.value;

                setSearch(value);

                try {
                  const saved = JSON.parse(
                    localStorage.getItem(REQUIREMENTS_STATE_KEY) || "{}",
                  );

                  localStorage.setItem(
                    REQUIREMENTS_STATE_KEY,
                    JSON.stringify({
                      ...saved,
                      search: value,
                    }),
                  );
                } catch (error) {
                  console.error(error);
                }
              }}
              placeholder={`Search ${activeStatus.toLowerCase()} requirement...`}
              className="
        w-full
        rounded-xl
        border
        border-gray-200
        bg-white
        py-3
        pl-10
        pr-4
        outline-none
        focus:border-teal-500
        focus:ring-4
        focus:ring-teal-500/10
      "
            />
          </div>

          {/* FILTER BUTTON */}
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`
      flex
      shrink-0
      items-center
      gap-2
      rounded-xl
      border
      px-4
      py-3
      text-sm
      font-semibold
      transition-all
      ${
        dateFilter !== "All"
          ? "border-(--theme-text) bg-(--theme-text)/10 text-(--theme-text)"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }
    `}
          >
            <FiFilter />

            <span className="hidden sm:inline">Filter</span>

            {dateFilter !== "All" && (
              <span className="rounded-full bg-(--theme-text) px-2 py-0.5 text-xs text-white">
                1
              </span>
            )}
          </button>
        </div>

        {/* =====================================================
          EMPTY
      ====================================================== */}

        {filteredRequirements.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed bg-gray-50 py-14 text-center">
            <FiPackage className="mx-auto text-5xl text-gray-300" />

            <h3 className="mt-3 font-semibold text-gray-700">
              No {activeStatus} Requirements
            </h3>

            <p className="text-sm text-gray-500">
              {search
                ? "No requirements match your search."
                : `No ${activeStatus.toLowerCase()} requirements available.`}
            </p>
          </div>
        )}

        {showFilters && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Filter Requirements
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Showing: {activeStatus}
                  </p>
                </div>

                {dateFilter !== "All" && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilter("All");

                      try {
                        const saved = JSON.parse(
                          localStorage.getItem(REQUIREMENTS_STATE_KEY) || "{}",
                        );

                        localStorage.setItem(
                          REQUIREMENTS_STATE_KEY,
                          JSON.stringify({
                            ...saved,
                            dateFilter: "All",
                            scrollY: 0,
                          }),
                        );
                      } catch (error) {
                        console.error(error);
                      }

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* DATE FILTER */}
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Created Date
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["All", "Today", "Yesterday", "Older"].map((filter) => {
                    const active = dateFilter === filter;

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setDateFilter(filter);

                          try {
                            const saved = JSON.parse(
                              localStorage.getItem(REQUIREMENTS_STATE_KEY) ||
                                "{}",
                            );

                            localStorage.setItem(
                              REQUIREMENTS_STATE_KEY,
                              JSON.stringify({
                                ...saved,
                                dateFilter: filter,
                                scrollY: 0,
                              }),
                            );
                          } catch (error) {
                            console.error(error);
                          }

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className={`
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  font-medium
                  transition-all
                  ${
                    active
                      ? "bg-(--theme-text) text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =====================================================
          REQUIREMENT CARDS
      ====================================================== */}

        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filteredRequirements.map((requirement) => (
              <motion.div
                key={requirement._id}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                layout
              >
                <Card
                  onClick={() => {
                    sessionStorage.setItem(
                      REQUIREMENTS_STATE_KEY,
                      JSON.stringify({
                        activeStatus,
                        search,
                        dateFilter,
                        scrollY: window.scrollY,
                      }),
                    );

                    navigate(`/store/requirements/${requirement._id}`);
                  }}
                  className="
                    cursor-pointer
                    transition-all
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* LEFT */}
                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-800">
                        {requirement.requirementNumber}
                      </h2>

                      <span className="mt-1 text-sm text-gray-600 flex gap-1">
                        <p className="mt-2 text-xs text-gray-500">
                          {requirement.kitchen?.district}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {" "}
                          | {requirement.kitchen?.name}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {" "}
                          | {requirement.createdBy?.name}
                        </p>
                      </span>

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(
                          requirement?.dispatch?.dispatchedAt ||
                            requirement?.createdAt,
                        ).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "medium",
                          timeZone: "Asia/Kolkata",
                        })}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right shrink-0">
                      <span
                        className={`
                          inline-block
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${statusStyle(requirement.status)}
                        `}
                      >
                        {requirement.status}
                      </span>

                      <p className="mt-2 text-xs text-gray-900">
                        {requirement.items?.length || 0} Items
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </ThemeProvider>
    </div>
  );
};

export default Requirements;
