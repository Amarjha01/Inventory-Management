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

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const data = await getRequirements();
        setRequirements(data);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const filteredRequirements = useMemo(() => {
    if (!search) return requirements;

    return requirements.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
    );
  }, [requirements, search]);

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
      <PageHeader
  title="Requirement History"
  subtitle="View all previously submitted requirements"
  imageUrl="/ui/type/HISTORY.png"
/>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
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
            <div>
              <h3 className="font-semibold text-(--theme-text)">
                Previous Requirements
              </h3>

              <p className="text-sm text-(--theme-text-secondary)">
  Total:{" "}
  <span className="font-semibold text-(--theme-primary)">
    {filteredRequirements.length}
  </span>
</p>
            </div>

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
    onChange={(e) => setSearch(e.target.value)}
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

          {filteredRequirements.length === 0 ? (
           <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
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
    No matching requirements are available.
  </p>
</motion.div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence>
                {filteredRequirements.map((requirement) => (
                  <motion.div
                    key={requirement._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <RequirementCard requirement={requirement} />
                  </motion.div>
                ))}
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
