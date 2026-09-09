import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiInbox } from "react-icons/fi";

import DashboardLayout from "../../../layouts/DashboardLayout";

import PageHeader from "../../../components/shared/ui/PageHeader";
import Loader from "../../../components/shared/ui/Loader";

import RequirementCard from "../../../components/kitchen/requirement/RequirementCard";

import { getRequirements } from "../../../services/requirement.service";
import { themes } from "../../../components/shared/ui/Theme";

const theme = themes.HistoryTheme;

const PreviousRequirement = () => {
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState("");

  // Selected status
  const [selectedStatus, setSelectedStatus] = useState("submitted");

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const data = await getRequirements();
        setRequirements(data);
      } catch (error) {
        console.error("Failed to fetch requirements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  /*
   * Normalize status coming from backend
   *
   * Examples:
   *
   * Submitted        -> submitted
   * submitted        -> submitted
   * Out For Delivery -> out_for_delivery
   * out_for_delivery -> out_for_delivery
   * Received         -> received
   */
  const normalizeStatus = (status) => {
    if (!status) return "";

    return status
      .toString()
      .trim()
      .toLowerCase()
      .replace(/-/g, "_")
      .replace(/\s+/g, "_");
  };

  /*
   * Count requirements based on status
   */
  const statusCounts = useMemo(() => {
    const counts = {
      submitted: 0,
      out_for_delivery: 0,
      received: 0,
    };

    requirements.forEach((requirement) => {
      const status = normalizeStatus(requirement.status);

      if (status === "submitted") {
        counts.submitted += 1;
      }

      if (status === "out_for_delivery") {
        counts.out_for_delivery += 1;
      }

      if (status === "received") {
        counts.received += 1;
      }
    });

    return counts;
  }, [requirements]);

  /*
   * Status sections
   */
  const statusConfig = [
    {
      key: "submitted",
      label: "Submitted",
      count: statusCounts.submitted,
    },
    {
      key: "out_for_delivery",
      label: "Out For Delivery",
      count: statusCounts.out_for_delivery,
    },
    {
      key: "received",
      label: "Received",
      count: statusCounts.received,
    },
  ];

  /*
   * Filter requirements
   *
   * Filters by:
   * 1. Selected status
   * 2. Search text
   */
  const filteredRequirements = useMemo(() => {
    let result = requirements;

    // Status filter
    if (selectedStatus) {
      result = result.filter(
        (requirement) =>
          normalizeStatus(requirement.status) ===
          selectedStatus,
      );
    }

    // Search filter
    if (search.trim()) {
      result = result.filter((item) =>
        JSON.stringify(item)
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    return result;
  }, [
    requirements,
    search,
    selectedStatus,
  ]);

  /*
   * Handle status section click
   */
  const handleStatusClick = (status) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(status);
    }
  };

  return (
    <DashboardLayout>
      <div
        style={{
          "--theme-bg": theme.background,
          "--theme-header": theme.header,

          "--theme-surface": theme.surface,
          "--theme-surface-alt": theme.surfaceAlt,

          "--theme-primary": theme.primary,
          "--theme-primary-light": theme.primaryLight,
          "--theme-primary-dark": theme.primaryDark,

          "--theme-text": theme.text,
          "--theme-text-secondary": theme.textSecondary,
          "--theme-text-primary": theme.textOnPrimary,

          "--theme-border": theme.border,
          "--theme-selected-border": theme.selectedBorder,

          "--theme-secondary": theme.secondary,
        }}
        className="
          min-h-full
          bg-(--theme-bg)
          text-(--theme-text)
          transition-colors
          duration-500
        "
      >
        {/* =================================
            PAGE HEADER
        ================================== */}
        <PageHeader
          title="Requirement History"
          subtitle="View all previously submitted requirements"
          imageUrl="/ui/type/HISTORY.png"
        />

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* =================================
                THREE STATUS SECTIONS
            ================================== */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                mb-6
                grid
                grid-cols-3
                gap-2
                rounded-2xl
                border
                border-(--theme-border)
                bg-(--theme-surface-alt)
                p-1
              "
            >
              {statusConfig.map((status) => {
                const isSelected =
                  selectedStatus === status.key;

                return (
                  <button
                    key={status.key}
                    type="button"
                    onClick={() =>
                      handleStatusClick(status.key)
                    }
                    className={`
                      flex
                      min-h-[80px]
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      px-2
                      py-3
                      transition-all
                      duration-200
                      focus:outline-none

                      ${
                        isSelected
                          ? `
                            border
                            border-slate-200
                            bg-white
                            shadow-[0_3px_12px_rgba(0,0,0,0.08)]
                          `
                          : `
                            border
                            border-transparent
                            bg-transparent
                            hover:bg-white/60
                          `
                      }
                    `}
                  >
                    <span
                      className={`
                        text-sm
                        font-medium
                        ${
                          isSelected
                            ? "text-slate-900"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {status.label}
                    </span>

                    <span
                      className={`
                        mt-1
                        text-sm
                        font-medium
                        ${
                          isSelected
                            ? "text-slate-900"
                            : "text-slate-400"
                        }
                      `}
                    >
                      {status.count}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* =================================
                TOOLBAR
            ================================== */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                mb-6
                flex
                flex-col
                gap-4
                rounded-xl
                border
                border-(--theme-border)
                bg-(--theme-surface)
                p-4
                shadow-[0_4px_18px_rgba(0,0,0,0.04)]

                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              {/* Title + Total */}
              <div>
                <h3 className="font-semibold text-(--theme-text)">
                  {selectedStatus
                    ? statusConfig.find(
                        (item) =>
                          item.key === selectedStatus,
                      )?.label
                    : "Previous Requirements"}
                </h3>

                <p className="text-sm text-(--theme-text-secondary)">
                  Total:{" "}
                  <span className="font-semibold text-(--theme-primary)">
                    {filteredRequirements.length}
                  </span>
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <FiSearch
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-(--theme-text-secondary)
                  "
                />

                <input
                  type="text"
                  placeholder="Search requirements..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-(--theme-border)
                    bg-(--theme-surface-alt)
                    py-2
                    pl-10
                    pr-4
                    text-(--theme-text)
                    outline-none
                    transition-all
                    duration-200

                    placeholder:text-(--theme-text-secondary)

                    focus:border-(--theme-primary)
                    focus:bg-(--theme-surface)
                    focus:ring-4
                    focus:ring-(--theme-primary)/10
                  "
                />
              </div>
            </motion.div>

            {/* =================================
                REQUIREMENT LIST
            ================================== */}
            {filteredRequirements.length === 0 ? (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="
                  rounded-2xl
                  border-2
                  border-dashed
                  border-(--theme-border)
                  bg-(--theme-surface-alt)
                  py-16
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-(--theme-primary-light)
                  "
                >
                  <FiInbox
                    className="
                      text-3xl
                      text-(--theme-primary)
                    "
                  />
                </div>

                <h3
                  className="
                    mt-4
                    text-lg
                    font-semibold
                    text-(--theme-text)
                  "
                >
                  No Requirements Found
                </h3>

                <p
                  className="
                    mt-2
                    text-(--theme-text-secondary)
                  "
                >
                  {selectedStatus
                    ? "No requirements are available for this status."
                    : "No matching requirements are available."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="space-y-4"
              >
                <AnimatePresence>
                  {filteredRequirements.map(
                    (requirement) => (
                      <motion.div
                        key={requirement._id}
                        layout
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
                          x: -30,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                      >
                        {/* 
                          KEEPING YOUR ORIGINAL
                          REQUIREMENT CARD
                        */}
                        <RequirementCard
                          requirement={requirement}
                        />
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PreviousRequirement;
