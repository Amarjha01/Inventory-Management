import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiInbox } from "react-icons/fi";

import DashboardLayout from "../../../layouts/DashboardLayout";

import PageHeader from "../../../components/shared/ui/PageHeader";
import Loader from "../../../components/shared/ui/Loader";

import RequirementCard from "../../../components/kitchen/requirement/RequirementCard";

import { getRequirements } from "../../../services/requirement.service";

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
      <PageHeader
        title="Requirement History"
        subtitle="View all previously submitted requirements"
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                Previous Requirements
              </h3>

              <p className="text-sm text-gray-500">
                Total:{" "}
                <span className="font-semibold text-teal-600">
                  {filteredRequirements.length}
                </span>
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search requirements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />
            </div>
          </motion.div>

          {filteredRequirements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center"
            >
              <FiInbox className="mx-auto text-5xl text-gray-300" />

              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                No Requirements Found
              </h3>

              <p className="mt-2 text-gray-500">
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
    </DashboardLayout>
  );
};

export default PreviousRequirement;
