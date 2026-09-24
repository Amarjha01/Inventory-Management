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
import { storage } from "../../../utils/storage";

const REQUIREMENTS_STATE_KEY = "requirements-page-state";

const OutForDelivery = () => {
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

  const [dateFilter, setDateFilter] = useState(() => {
    try {
      const saved = sessionStorage.getItem(REQUIREMENTS_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.dateFilter || "All";
      }
    } catch (error) {
      console.error("Failed to restore date filter:", error);
    }
    return "All";
  });

  // Restore scroll position
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

  // Load requirements data
  useEffect(() => {
    const load = async () => {
      try {
        setRequirements(storage?.getOutForDeliveryRequirement || []);
        if (requirements) {
          setLoading(false)
        }
        const data = await getAllKitchenRequirements("Out For Delivery");
        if (data) {
          storage.setOutForDeliveryRequirement(data);
          setRequirements(data || []);
          const stat = storage.getStats();
          storage.setStats({ ...stat, "Out For Delivery": data.length });
        }
      } catch (error) {
        console.error(error);
        if (!requirements) {
          setRequirements([]);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Filtered requirements calculation (Search + Date Filter)
  const filteredRequirements = useMemo(() => {
    return (requirements || []).filter((req) => {
      // 1. Search matching
      const matchesSearch =
        !search ||
        req.requirementNumber?.toLowerCase().includes(search.toLowerCase()) ||
        req.kitchen?.name?.toLowerCase().includes(search.toLowerCase()) ||
        req.kitchen?.district?.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Date filtering
      if (dateFilter === "All") return true;

      const reqDate = new Date(
        req.receivedAt || req?.dispatch?.dispatchedAt || req?.createdAt
      );
      const today = new Date();
      const isToday = reqDate.toDateString() === today.toDateString();

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const isYesterday = reqDate.toDateString() === yesterday.toDateString();

      if (dateFilter === "Today") return isToday;
      if (dateFilter === "Yesterday") return isYesterday;
      if (dateFilter === "Older") return !isToday && !isYesterday;

      return true;
    });
  }, [requirements, search, dateFilter]);

  return (
    <div>
      {/* =====================================================
          SEARCH & FILTER HEADER
      ====================================================== */}
      <div className="flex gap-2">
        {/* SEARCH */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);

              try {
                const saved = JSON.parse(
                  sessionStorage.getItem(REQUIREMENTS_STATE_KEY) || "{}"
                );

                sessionStorage.setItem(
                  REQUIREMENTS_STATE_KEY,
                  JSON.stringify({
                    ...saved,
                    search: value,
                  })
                );
              } catch (error) {
                console.error(error);
              }
            }}
            placeholder={`Search Out For Delivery requirement...`}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </div>

        {/* FILTER BUTTON */}
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
            dateFilter !== "All"
              ? "border-(--theme-text) bg-(--theme-text)/10 text-(--theme-text)"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
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

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mt-4"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Filter Requirements
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Showing: Out For Delivery
                </p>
              </div>

              {dateFilter !== "All" && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("All");

                    try {
                      const saved = JSON.parse(
                        sessionStorage.getItem(REQUIREMENTS_STATE_KEY) || "{}"
                      );

                      sessionStorage.setItem(
                        REQUIREMENTS_STATE_KEY,
                        JSON.stringify({
                          ...saved,
                          dateFilter: "All",
                          scrollY: 0,
                        })
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
                            sessionStorage.getItem(REQUIREMENTS_STATE_KEY) || "{}"
                          );

                          sessionStorage.setItem(
                            REQUIREMENTS_STATE_KEY,
                            JSON.stringify({
                              ...saved,
                              dateFilter: filter,
                              scrollY: 0,
                            })
                          );
                        } catch (error) {
                          console.error(error);
                        }

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        active
                          ? "bg-(--theme-text) text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
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
          LOADING SKELETON STATE
      ====================================================== */}
      {loading ? (
        <div className="space-y-3 mt-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="h-3 w-48 rounded bg-gray-100"></div>
                  <div className="h-3 w-24 rounded bg-gray-100"></div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="ml-auto h-5 w-20 rounded-full bg-yellow-100"></div>
                  <div className="ml-auto h-3 w-12 rounded bg-gray-100"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* =====================================================
              EMPTY STATE
          ====================================================== */}
          {filteredRequirements?.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed bg-gray-50 py-14 text-center mt-4">
              <FiPackage className="mx-auto text-5xl text-gray-300" />

              <h3 className="mt-3 font-semibold text-gray-700">
                No Out For Delivery Requirements
              </h3>

              <p className="text-sm text-gray-500">
                {search
                  ? "No requirements match your search."
                  : `No Out For Delivery requirements available.`}
              </p>
            </div>
          )}

          {/* REQUIREMENTS LIST */}
          <AnimatePresence mode="popLayout">
            <div className="space-y-3 mt-4">
              {filteredRequirements?.map((requirement) => (
                <motion.div
                  key={requirement._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  layout
                >
                  <Card
                    onClick={() => {
                      sessionStorage.setItem(
                        REQUIREMENTS_STATE_KEY,
                        JSON.stringify({
                          activeStatus: "Out For Delivery",
                          search,
                          dateFilter,
                          scrollY: window.scrollY,
                        })
                      );

                      navigate(`/store/requirements/${requirement._id}`);
                    }}
                    className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
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
                            | {requirement.kitchen?.name}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            | {requirement.createdBy?.name}
                          </p>
                        </span>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(
                            requirement.receivedAt ||
                              requirement?.dispatch?.dispatchedAt ||
                              requirement?.createdAt
                          ).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "medium",
                            timeZone: "Asia/Kolkata",
                          })}
                        </p>
                      </div>

                      {/* RIGHT */}
                      <div className="text-right shrink-0">
                        <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700">
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
        </>
      )}
    </div>
  );
};

export default OutForDelivery;