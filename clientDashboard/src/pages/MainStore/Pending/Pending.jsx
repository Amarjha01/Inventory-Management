import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiMoreVertical,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiX,
  FiCalendar,
  FiUser,
  FiTruck,
  FiFileText,
  FiPackage,
  FiMapPin,
  FiGitMerge,
} from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import {
  getPendingItems,
  cancelPendingItem,
  getUndispatchedRequirementId,
  mergeItem,
} from "../../../services/pendingFulfillment.service.js";
import RequirementList from "../../../components/mainStore/pending/RequirementList.jsx";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider.jsx";
import PageHeader from "../../../components/shared/ui/PageHeader.jsx";
import { themes } from "../../../components/shared/ui/Theme.js";

const Pending = () => {
  const [pendingData, setPendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedKitchens, setExpandedKitchens] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const [statusFilter, setStatusFilter] = useState("PENDING");

  const [openMenu, setOpenMenu] = useState(null);

  const [requirementId, setRequirementId] = useState([]);

  const [showRequirement, setShowRequirement] = useState(false);


  // ======================================================
  // HELPER
  // ======================================================

  /**
   * Handles both:
   *
   * referenceToOriginalRequirementId: "123"
   *
   * OR
   *
   * referenceToOriginalRequirementId: {
   *   _id: "123",
   *   requirementNumber: "REQ-123"
   * }
   */
  const getReferenceValue = (reference) => {
    if (!reference) {
      return "--";
    }

    if (typeof reference === "string") {
      return reference;
    }

    if (typeof reference === "object") {
      return reference.requirementNumber || reference._id || "--";
    }

    return String(reference);
  };

  // ======================================================
  // FETCH
  // ======================================================

  const fetchPending = async () => {
    try {
      setLoading(true);

      const response = await getPendingItems();

      console.log("Pending response:", response);

      setPendingData(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch pending items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // ======================================================
  // FILTER
  // ======================================================

  const filteredData = useMemo(() => {
    return pendingData
      .map((pending) => ({
        ...pending,

        items:
          pending.items?.filter(
            (item) => item.fulfillmentStatus === statusFilter,
          ) || [],
      }))
      .filter((pending) => pending.items.length > 0);
  }, [pendingData, statusFilter]);

  // ======================================================
  // SELECT ITEM
  // ======================================================

  const toggleItemSelection = (pendingId, itemId) => {
    const key = `${pendingId}-${itemId}`;

    setSelectedItems((previous) => {
      if (previous.includes(key)) {
        return previous.filter((item) => item !== key);
      }

      return [...previous, key];
    });
  };

  const isSelected = (pendingId, itemId) => {
    return selectedItems.includes(`${pendingId}-${itemId}`);
  };

  // ======================================================
  // SELECT KITCHEN
  // ======================================================

  const toggleKitchenSelection = (pending) => {
    const keys = pending.items.map((item) => `${pending._id}-${item._id}`);

    const allSelected =
      keys.length > 0 && keys.every((key) => selectedItems.includes(key));

    if (allSelected) {
      setSelectedItems((previous) =>
        previous.filter((key) => !keys.includes(key)),
      );
    } else {
      setSelectedItems((previous) => [...new Set([...previous, ...keys])]);
    }
  };

  // ======================================================
  // MERGE SELECTED
  // ======================================================

  const handleMerge = async (requirement) => {          
    const selected = [];

    filteredData.forEach((pending) => {
      pending.items?.forEach((item) => {
        if (isSelected(pending._id, item._id)) {
          selected.push({
            pendingFulfillmentId: pending._id,
            pendingItemId: item._id,
            inventoryId: item.inventoryId?._id,
            quantity: item.requestedQuantity,
            unit: item.unit,
            kitchenId: pending.kitchenId?._id,
            referenceToOriginalRequirementId:
            item.referenceToOriginalRequirementId,
          });
        }
      });
    });

    if (!selected.length) {
      return;
    }

    console.log("Selected pending items:", selected);

   if(!requirement._id){
     try {
      const RequirementList = await getUndispatchedRequirementId(
        selected[0]?.kitchenId,
      );
      setRequirementId(RequirementList.data);
      setShowRequirement(true);
      return;
    } catch (error) {
      console.log(error);
    }
   }
  
   try {
    const merged = await mergeItem(requirement._id , selected)
    console.log(merged);
    
   } catch (error) {
    console.log(error);
    
   }
   console.log("Selected requirement:", requirement);

  };

  // ======================================================
  // CANCEL
  // ======================================================

  const handleCancel = async (pendingId, pendingItemId) => {
    try {
      await cancelPendingItem(pendingId, pendingItemId);

      setOpenMenu(null);

      await fetchPending();
    } catch (error) {
      console.error("Failed to cancel pending item:", error);
    }
  };

  // ======================================================
  // TOGGLE KITCHEN
  // ======================================================

  const toggleKitchen = (id) => {
    setExpandedKitchens((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className="
          h-full
          flex
          items-center
          justify-center
          text-gray-500
        "
      >
        Loading pending items...
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
     <ThemeProvider
      theme={themes.DRIVERS}
      className="min-h-full pb-24"
    >
      <PageHeader
            title="Pending Items"
            subtitle="Manage all Items waiting for fulfillment"
            imageUrl={'/ui/DRIVERS.png'}
          />
    <div
      className="
        w-full
        min-h-full
        p-6
        bg-gray-50/50
        relative
      "
    >
      {/* ==================================================
          HEADER
      ================================================== */}
            
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          mb-6
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-semibold
              text-[#181e53]
            "
          >
            Pending
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Items waiting for fulfillment
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          {/* STATUS */}

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                appearance-none
                h-10
                min-w-[140px]
                pl-4
                pr-10
                rounded-lg
                border
                border-gray-200
                bg-white
                text-sm
                font-medium
                text-gray-700
                outline-none
                cursor-pointer
                focus:border-[#181e53]
              "
            >
              <option value="PENDING">Pending</option>

              <option value="FULFILLED">Fulfilled</option>

              <option value="CANCELLED">Cancelled</option>
            </select>

            <FiChevronDown
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                pointer-events-none
                text-gray-500
              "
              size={16}
            />
          </div>

          {/* MERGE */}

          <motion.button
            whileHover={{
              y: -1,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleMerge}
            disabled={selectedItems.length === 0}
            className="
              h-10
              px-4
              flex
              items-center
              gap-2
              rounded-lg
              bg-[#181e53]
              text-white
              text-sm
              font-medium
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <FiGitMerge size={16} />
            Merge
          </motion.button>
        </div>
      </div>

      {/* ==================================================
          EMPTY
      ================================================== */}

      <AnimatePresence mode="wait">
        {!filteredData.length && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              min-h-[350px]
              flex
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-gray-300
              bg-white
            "
          >
            <FiPackage size={42} className="text-gray-300 mb-3" />

            <p
              className="
                font-medium
                text-gray-600
              "
            >
              No {statusFilter.toLowerCase()} items
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================
          KITCHENS
      ================================================== */}

      <div className="space-y-4">
        <AnimatePresence>
          {filteredData.map((pending) => {
            const expanded = expandedKitchens[pending._id] ?? false;

            const allSelected =
              pending.items.length > 0 &&
              pending.items.every((item) => isSelected(pending._id, item._id));

            return (
              <motion.div
                key={pending._id}
                layout
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                    overflow-visible
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                  "
              >
                {/* ==================================================
                      KITCHEN HEADER
                  ================================================== */}

                <div
                  className="
                      flex
                      items-center
                      justify-between
                      px-5
                      py-4
                      border-b
                      border-gray-100
                    "
                >
                  <div
                    className="
                        flex
                        items-center
                        gap-3
                      "
                  >
                    <motion.button
                      whileTap={{
                        scale: 0.9,
                      }}
                      onClick={() => toggleKitchen(pending._id)}
                      className="
                          w-8
                          h-8
                          flex
                          items-center
                          justify-center
                          rounded-lg
                          text-gray-500
                          hover:bg-gray-100
                        "
                    >
                      {expanded ? (
                        <FiChevronUp size={18} />
                      ) : (
                        <FiChevronDown size={18} />
                      )}
                    </motion.button>

                    <div
                      className="
                          w-9
                          h-9
                          rounded-lg
                          bg-[#181e53]/10
                          flex
                          items-center
                          justify-center
                          text-[#181e53]
                        "
                    >
                      <FiMapPin size={17} />
                    </div>

                    <div>
                      <h2
                        className="
                            font-semibold
                            text-gray-800
                          "
                      >
                        {pending.kitchenId?.name || "Kitchen"}
                      </h2>

                      <p
                        className="
                            text-xs
                            text-gray-500
                            mt-0.5
                          "
                      >
                        {pending.items.length} item
                        {pending.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* SELECT ALL */}

                  <motion.button
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={() => toggleKitchenSelection(pending)}
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-[#181e53]
                      "
                  >
                    <span
                      className={`
                          w-5
                          h-5
                          rounded
                          border
                          flex
                          items-center
                          justify-center
                          transition
                          ${
                            allSelected
                              ? "bg-[#181e53] border-[#181e53]"
                              : "border-gray-300 bg-white"
                          }
                        `}
                    >
                      <AnimatePresence>
                        {allSelected && (
                          <motion.span
                            initial={{
                              scale: 0,
                              opacity: 0,
                            }}
                            animate={{
                              scale: 1,
                              opacity: 1,
                            }}
                            exit={{
                              scale: 0,
                              opacity: 0,
                            }}
                          >
                            <FiCheck size={13} className="text-white" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    Select all
                  </motion.button>
                </div>

                {/* ==================================================
                      ITEMS
                  ================================================== */}

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.22,
                      }}
                      className=""
                    >
                      <div
                        className="
                            divide-y
                            divide-gray-100
                          "
                      >
                        {pending.items.map((item) => {
                          const selected = isSelected(pending._id, item._id);

                          return (
                            <motion.div
                              layout
                              key={item._id}
                              whileHover={{
                                backgroundColor: "rgba(249,250,251,1)",
                              }}
                              className={`
                                    relative
                                    px-5
                                    py-4
                                    ${selected ? "bg-indigo-50/40" : ""}
                                  `}
                            >
                              <div
                                className="
                                      flex
                                      items-start
                                      gap-4
                                    "
                              >
                                {/* CHECKBOX */}

                                <motion.button
                                  whileTap={{
                                    scale: 0.85,
                                  }}
                                  onClick={() =>
                                    toggleItemSelection(pending._id, item._id)
                                  }
                                  className={`
                                        mt-1
                                        w-5
                                        h-5
                                        shrink-0
                                        rounded
                                        border
                                        flex
                                        items-center
                                        justify-center
                                        ${
                                          selected
                                            ? "bg-[#181e53] border-[#181e53]"
                                            : "border-gray-300 bg-white"
                                        }
                                      `}
                                >
                                  {selected && (
                                    <motion.span
                                      initial={{
                                        scale: 0,
                                      }}
                                      animate={{
                                        scale: 1,
                                      }}
                                    >
                                      <FiCheck
                                        size={13}
                                        className="text-white"
                                      />
                                    </motion.span>
                                  )}
                                </motion.button>

                                {/* ITEM CONTENT */}

                                <div
                                  className="
                                        flex-1
                                        min-w-0
                                      "
                                >
                                  {/* TOP */}

                                  <div
                                    className="
                                          flex
                                          items-center
                                          gap-3
                                          flex-wrap
                                        "
                                  >
                                    <div
                                      className="
                                            flex
                                            items-center
                                            gap-2
                                            font-medium
                                            text-gray-800
                                          "
                                    >
                                      <FiPackage
                                        size={16}
                                        className="text-[#181e53]"
                                      />

                                      {item.inventoryId?.name || "Unknown Item"}
                                    </div>

                                    {/* Requirement Creation date */}

                                    <span
                                      className={`
                                            px-2.5
                                            py-1
                                            rounded-full
                                            text-[11px]
                                            font-semibold
                                            
                                          `}
                                    >
                                      {new Date(
                                        item.referenceToOriginalRequirementId?.createdAt,
                                      ).toLocaleDateString("en-IN", {
                                        dateStyle: "medium",
                                      }) || "--"}
                                    </span>
                                  </div>

                                  {/* DETAILS */}

                                  <div
                                    className="
                                          flex
                                          flex-wrap
                                          items-center
                                          gap-x-6
                                          gap-y-2
                                          mt-3
                                          text-xs
                                          text-gray-500
                                        "
                                  >
                                    {/* QUANTITY */}

                                    <div
                                      className="
                                            flex
                                            items-center
                                            gap-1.5
                                          "
                                    >
                                      <FiPackage size={14} />

                                      <span>
                                        {item.requestedQuantity} {item.unit}
                                      </span>
                                    </div>

                                    {/* DATE */}

                                    <div
                                      className="
                                            flex
                                            items-center
                                            gap-1.5
                                          "
                                    >
                                      <FiCalendar size={14} />

                                      <span>
                                        {item.createdAt
                                          ? new Date(
                                              item.createdAt,
                                            ).toLocaleDateString("en-IN", {
                                              dateStyle: "medium",
                                            })
                                          : "--"}
                                      </span>
                                    </div>

                                    {/* ORIGINAL REQUIREMENT REFERENCE */}

                                    <div className="flex items-center gap-1.5 text-blue-500">
                                      <FiFileText size={14} />

                                      <a
                                        href={`/store/requirements/${item?.referenceToOriginalRequirementId?._id}`}
                                      >
                                        Ref:{" "}
                                        {getReferenceValue(
                                          item.referenceToOriginalRequirementId,
                                        )}
                                      </a>
                                    </div>

                                    {/* CREATED BY */}

                                    <div
                                      className="
                                            flex
                                            items-center
                                            gap-1.5
                                          "
                                    >
                                      <FiUser size={14} />

                                      <span>
                                        {item.createdBy?.name || "Unknown"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* DISPATCHED REFERENCE */}

                                 {item.referenceToDispatchedRequirementId && (
                                    <motion.div
                                        initial={{
                                        opacity: 0,
                                        height: 0,
                                        }}
                                        animate={{
                                        opacity: 1,
                                        height: "auto",
                                        }}
                                        className="
                                        mt-3
                                        rounded-lg
                                        border border-amber-200
                                        bg-amber-50
                                        p-3
                                        sm:p-3.5
                                        "
                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-2.5">
                                        <div
                                            className="
                                            flex
                                            h-7
                                            w-7
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-amber-100
                                            text-amber-600
                                            "
                                        >
                                            <FiTruck size={14} />
                                        </div>

                                        <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                                            Fulfilled
                                        </span>
                                        </div>

                                        {/* Details */}
                                        <div className="
                                        grid
                                        grid-cols-1
                                        gap-2.5
                                        sm:grid-cols-3
                                        sm:gap-4
                                        ">
                                        {/* Dispatched Reference */}
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Dispatched Ref
                                            </p>

                                            <a
                                            href={`/store/requirements/${item.referenceToDispatchedRequirementId}`}
                                            className="mt-0.5 block
                                                truncate
                                                text-sm
                                                font-medium
                                                text-blue-600
                                                hover:text-blue-800
                                                hover:underline
                                            "
                                            title={getReferenceValue(
                                                item.referenceToDispatchedRequirementId,
                                            )}
                                            >
                                            {getReferenceValue(
                                                item.referenceToDispatchedRequirementId,
                                            )}
                                            </a>
                                        </div>

                                        {/* Fulfilled At */}
                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Fulfilled At
                                            </p>

                                            <p className="mt-0.5 text-sm font-medium text-gray-700">
                                            {new Date(item.fulfilledAt).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "medium",
                                                timeZone: "Asia/Kolkata",
                                                })}
                                            </p>
                                        </div>

                                        {/* Fulfilled By */}
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Fulfilled By
                                            </p>

                                            <p
                                            className="mt-0.5 truncate text-sm font-medium text-gray-700"
                                            title={item.fulfilledBy?.name}
                                            >
                                            {item.fulfilledBy?.name || "-"}
                                            </p>
                                        </div>
                                        </div>
                                    </motion.div>
                                    )}


                                 
                                </div>

                                {/* KEBAB */}

                                <div className="relative">
                                  <motion.button
                                    whileTap={{
                                      scale: 0.85,
                                    }}
                                    onClick={() =>
                                      setOpenMenu(
                                        openMenu === item._id ? null : item._id,
                                      )
                                    }
                                    className="
                                          w-9
                                          h-9
                                          flex
                                          items-center
                                          justify-center
                                          rounded-lg
                                          text-gray-500
                                          hover:bg-gray-100
                                        "
                                  >
                                    <FiMoreVertical size={18} />
                                  </motion.button>

                                  <AnimatePresence>
                                    {openMenu === item._id && (
                                      <motion.div
                                        initial={{
                                          opacity: 0,
                                          scale: 0.95,
                                          y: -5,
                                        }}
                                        animate={{
                                          opacity: 1,
                                          scale: 1,
                                          y: 0,
                                        }}
                                        exit={{
                                          opacity: 0,
                                          scale: 0.95,
                                          y: -5,
                                        }}
                                        className="
                                              absolute
                                              right-0
                                              top-10
                                              z-50
                                              w-48
                                              rounded-lg
                                              border
                                              border-gray-200
                                              bg-white
                                              shadow-xl
                                              py-1
                                              origin-top-right
                                            "
                                      >
                                        {/* ITEM DETAILS */}

                                        <button
                                          type="button"
                                          className="
                                                w-full
                                                px-4
                                                py-2.5
                                                flex
                                                items-center
                                                gap-2
                                                text-left
                                                text-sm
                                                text-gray-700
                                                hover:bg-gray-50
                                              "
                                        >
                                          <FiFileText size={15} />
                                          Item Details
                                        </button>

                                        {/* CANCEL */}

                                        {item.fulfillmentStatus ===
                                          "PENDING" && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleCancel(
                                                pending._id,
                                                item._id,
                                              )
                                            }
                                            className="
                                                  w-full
                                                  px-4
                                                  py-2.5
                                                  flex
                                                  items-center
                                                  gap-2
                                                  text-left
                                                  text-sm
                                                  text-red-600
                                                  hover:bg-red-50
                                                "
                                          >
                                            <FiX size={15} />
                                            Cancel
                                          </button>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        {showRequirement && (
  <div className="absolute inset-x-0 top-5 z-50 px-3 sm:px-4">
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#181e53] to-[#252b68] px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/60">
            Pending Requirements
          </p>

          <h2 className="mt-0.5 text-base font-bold text-white sm:text-lg">
            {requirementId?.[0]?.kitchen || "Kitchen"} Kitchen
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowRequirement(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full
                     text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <IoMdCloseCircle size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[55vh] overflow-y-auto bg-gray-50/70 p-3 sm:p-4">
        {requirementId?.length > 0 ? (
          <RequirementList
            requirements={requirementId}
            onSelect={(requirement) => {
              handleMerge(requirement)
            }}
          />
        ) : (
          <div className="py-10 text-center text-sm text-gray-500">
            No pending requirements found.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-2.5">
        <span className="text-xs text-gray-500">
          {requirementId?.length || 0} requirement
          {requirementId?.length === 1 ? "" : "s"}
        </span>

        <button
          type="button"
          onClick={() => setShowRequirement(false)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium
                     text-gray-600 transition hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


        </AnimatePresence>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default Pending;
