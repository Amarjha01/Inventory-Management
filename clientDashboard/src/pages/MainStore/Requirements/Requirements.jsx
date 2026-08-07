import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFileText, FiPackage } from "react-icons/fi";

import Card from "../../../components/shared/ui/Card";
import Loader from "../../../components/shared/ui/Loader";

import { getAllKitchenRequirements } from "../../../services/requirement.service";

const Requirements = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllKitchenRequirements();
        setRequirements(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredRequirements = useMemo(() => {
    if (!search) return requirements;

    return requirements.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
    );
  }, [requirements, search]);

  const statusStyle = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-blue-100 text-blue-700";

      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-700";

      case "RECEIVED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Requirements</h1>

          <p className="text-gray-500">Manage kitchen material requests</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2 text-teal-700">
          <FiFileText />

          <span className="font-semibold">{requirements.length}</span>

          <span className="text-sm">Requests</span>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search requirement or kitchen..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
        />
      </div>

      {/* Empty */}
      {filteredRequirements.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed bg-gray-50 py-14 text-center">
          <FiPackage className="mx-auto text-5xl text-gray-300" />

          <h3 className="mt-3 font-semibold text-gray-700">
            No Requirements Found
          </h3>

          <p className="text-sm text-gray-500">
            No kitchen requests available.
          </p>
        </div>
      )}

      {/* Cards */}
      <AnimatePresence>
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
            >
              <Card
                onClick={() =>
                  navigate(`/store/requirements/${requirement._id}`)
                }
                className="
                  cursor-pointer
                  transition-all
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-800">
                      {requirement.requirementNumber}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {requirement.kitchen?.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(requirement.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`
                        rounded-full px-3 py-1
                        text-xs font-semibold
                        ${statusStyle(requirement.status)}
                      `}
                    >
                      {requirement.status}
                    </span>

                    <p className="mt-2 text-xs text-gray-500">
                      {requirement.items?.length || 0} Items
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Requirements;
