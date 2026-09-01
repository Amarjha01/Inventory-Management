import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiFileText,
  FiPackage,
} from "react-icons/fi";

import Card from "../../../components/shared/ui/Card";
import Loader from "../../../components/shared/ui/Loader";

import { getAllKitchenRequirements } from "../../../services/requirement.service";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import { themes } from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";

const REQUIREMENTS_STATE_KEY = "requirements-page-state";

const Requirements = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState(() => {
  try {
    const saved = sessionStorage.getItem(
      REQUIREMENTS_STATE_KEY
    );

    if (saved) {
      const parsed = JSON.parse(saved);

      return parsed.search || "";
    }
  } catch (error) {
    console.error(
      "Failed to restore search state:",
      error
    );
  }

  return "";
});


  const [activeStatus, setActiveStatus] = useState(() => {
    try {
      const saved = sessionStorage.getItem(
        REQUIREMENTS_STATE_KEY
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        return parsed.activeStatus || "Submitted";
      }
    } catch (error) {
      console.error("Failed to restore requirements state:", error);
    }

    return "Submitted";
  });

// useEffect(() => {
//   const handleScroll = () => {
//     try {
//       const existing = sessionStorage.getItem(
//         REQUIREMENTS_STATE_KEY
//       );

//       const saved = existing
//         ? JSON.parse(existing)
//         : {};

//       sessionStorage.setItem(
//         REQUIREMENTS_STATE_KEY,
//         JSON.stringify({
//           ...saved,
//           scrollY: window.scrollY,
//         })
//       );
//     } catch (error) {
//       console.error(
//         "Failed to save scroll position:",
//         error
//       );
//     }
//   };

//   window.addEventListener("scroll", handleScroll, {
//     passive: true,
//   });

//   return () => {
//     window.removeEventListener("scroll", handleScroll);
//   };
// }, []);

useEffect(() => {
  if (loading) return;

  const saved = sessionStorage.getItem(
    REQUIREMENTS_STATE_KEY
  );

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
    console.error(
      "Failed to restore scroll position:",
      error
    );
  }
}, [loading]);


  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await getAllKitchenRequirements();

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
      Submitted: requirements.filter(
        (item) =>
          item.status === "Submitted",
      ).length,

      "Out For Delivery":
        requirements.filter(
          (item) =>
            item.status ===
            "Out For Delivery",
        ).length,

      Received: requirements.filter(
        (item) =>
          item.status === "Received",
      ).length,
    };
  }, [requirements]);

  // =========================================================
  // FILTER REQUIREMENTS
  // =========================================================

  const filteredRequirements = useMemo(() => {
    let result = requirements.filter(
      (item) =>
        item.status === activeStatus,
    );

    if (search.trim()) {
      const searchValue =
        search.trim().toLowerCase();

      result = result.filter((item) =>
        JSON.stringify(item)
          .toLowerCase()
          .includes(searchValue),
      );
    }

    return result;
  }, [
    requirements,
    activeStatus,
    search,
  ]);

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
        <ThemeProvider
      theme={themes.REQUIREMENTS}
      className="min-h-full pb-24"
    >
      <PageHeader
            title="Requirements"
            subtitle="Manage kitchen material requests"
            imageUrl={'/ui/REQUIREMENTS.png'}
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
      >


      </motion.div>

      {/* =====================================================
          STATUS TABS
      ====================================================== */}

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-gray-100 p-1">
        {statusTabs.map((tab) => {
          const active =
            activeStatus === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
  setActiveStatus(tab.value);
  setSearch("");

  const existing = sessionStorage.getItem(
    REQUIREMENTS_STATE_KEY
  );

  const saved = existing
    ? JSON.parse(existing)
    : {};

  sessionStorage.setItem(
    REQUIREMENTS_STATE_KEY,
    JSON.stringify({
      ...saved,
      activeStatus: tab.value,
      search: "",
      scrollY: 0,
    })
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
                <span className="text-center">
                  {tab.label}
                </span>

                <span
                  className={`
                    text-xs
                    ${
                      active
                        ? "text-(--theme-text)"
                        : "text-gray-400"
                    }
                  `}
                >
                  {statusCounts[
                    tab.value
                  ] || 0}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="relative">
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
    const existing = sessionStorage.getItem(
      REQUIREMENTS_STATE_KEY
    );

    const saved = existing
      ? JSON.parse(existing)
      : {};

    sessionStorage.setItem(
      REQUIREMENTS_STATE_KEY,
      JSON.stringify({
        ...saved,
        search: value,
      })
    );
  } catch (error) {
    console.error(
      "Failed to save search state:",
      error
    );
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

      {/* =====================================================
          REQUIREMENT CARDS
      ====================================================== */}

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {filteredRequirements.map(
            (requirement) => (
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
      scrollY: window.scrollY,
    })
  );

  navigate(
    `/store/requirements/${requirement._id}`
  );
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
                        {
                          requirement.requirementNumber
                        }
                      </h2>

                      <span className="mt-1 text-sm text-gray-600 flex gap-1">
                        
                        <p className="mt-2 text-xs text-gray-500"> 
                        {
                          requirement
                            .kitchen?.district
                        }
                      </p>
                        <p className="mt-2 text-xs text-gray-500"> | {" "}
                        {
                          requirement
                            .kitchen?.name
                        }
                      </p>
                        <p className="mt-2 text-xs text-gray-500"> | {" "}
                        {
                          requirement
                            .createdBy?.name
                        }
                      </p>  
                      </span>
                        

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(
                          requirement.createdAt,
                        ).toLocaleString()}
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
                          ${statusStyle(
                            requirement.status,
                          )}
                        `}
                      >
                        {requirement.status}
                      </span>

                      <p className="mt-2 text-xs text-gray-900">
                        {requirement.items
                          ?.length || 0}{" "}
                        Items
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ),
          )}
        </div>
      </AnimatePresence>
      </ThemeProvider>
    </div>
  );
};

export default Requirements;
