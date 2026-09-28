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
  FiLoader,
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

const PendingSkeleton = () => {
  return (
    <div className="min-h-full bg-slate-50/70 pb-24">
      <div className="h-24 w-full animate-pulse border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded-lg bg-slate-200" />
            <div className="h-3 w-64 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="h-7 w-36 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-100" />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-11 w-28 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>

        {[1, 2, 3].map((group) => (
          <div key={group} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="divide-y divide-slate-100">
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 px-5 py-5">
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded-md bg-slate-200" />

                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                      <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
                    </div>

                    <div className="flex flex-wrap gap-5">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="h-20 w-full animate-pulse rounded-xl bg-slate-50" />
                  </div>

                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Pending = () => {
  const [pendingData, setPendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedKitchens, setExpandedKitchens] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const [statusFilter, setStatusFilter] = useState("PENDING");

  const [openMenu, setOpenMenu] = useState(null);

  const [requirementId, setRequirementId] = useState([]);

  const [showRequirement, setShowRequirement] = useState(false);

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

  const fetchPending = async () => {
    try {
      setLoading(true);

      const response = await getPendingItems();

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

  const filteredData = useMemo(() => {
    console.log(pendingData);

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

    if (!requirement._id) {
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
      const merged = await mergeItem(requirement._id, selected);

      console.log("Merged:", merged);

      setPendingData((previousData) => {
        return previousData
          .map((pending) => {
            const selectedItemIds = selected
              .filter(
                (item) => item.pendingFulfillmentId === pending._id,
              )
              .map((item) => item.pendingItemId);

            if (!selectedItemIds.length) {
              return pending;
            }

            return {
              ...pending,
              items: pending.items?.filter(
                (item) => !selectedItemIds.includes(item._id),
              ),
            };
          })
          .filter((pending) => pending.items?.length > 0);
      });

      setSelectedItems([]);

      setShowRequirement(false);
    } catch (error) {
      console.log(error);
    }

    console.log("Selected requirement:", requirement);
  };

  const handleCancel = async (pendingId, pendingItemId) => {
    try {
      await cancelPendingItem(pendingId, pendingItemId);

      setOpenMenu(null);

      await fetchPending();
    } catch (error) {
      console.error("Failed to cancel pending item:", error);
    }
  };

  const toggleKitchen = (id) => {
    setExpandedKitchens((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  if (loading) {
    return <PendingSkeleton />;
  }

  return (
    <ThemeProvider theme={themes.DRIVERS} className="min-h-full pb-24">
      <PageHeader
        title="Pending Items"
        subtitle="Manage all Items waiting for fulfillment"
        imageUrl={"/ui/DRIVERS.png"}
      />

      <div className="relative min-h-full w-full bg-slate-50/70 p-4 sm:p-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#181e53]">
                    <FiPackage size={19} />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Pending
                    </h1>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Items waiting for fulfillment
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-100">
                    {filteredData.reduce(
                      (total, pending) => total + pending.items.length,
                      0,
                    )}{" "}
                    {statusFilter.toLowerCase()} items
                  </span>

                  {selectedItems.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#181e53] ring-1 ring-inset ring-indigo-100"
                    >
                      {selectedItems.length} selected
                    </motion.span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 min-w-[155px] cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#181e53] focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="FULFILLED">Fulfilled</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <FiChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMerge}
                  disabled={selectedItems.length === 0}
                  className="flex h-11 items-center gap-2 rounded-xl bg-[#181e53] px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-900/20 transition hover:bg-[#11163f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiGitMerge size={16} />
                  Merge
                  {selectedItems.length > 0 && (
                    <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[11px]">
                      {selectedItems.length}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!filteredData.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                  <FiPackage size={30} />
                </div>

                <h3 className="text-base font-semibold text-slate-800">
                  No {statusFilter.toLowerCase()} items
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  There are currently no items matching the selected fulfillment
                  status.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredData.map((pending) => {
                const expanded = expandedKitchens[pending._id] ?? false;

                const allSelected =
                  pending.items.length > 0 &&
                  pending.items.every((item) =>
                    isSelected(pending._id, item._id),
                  );

                return (
                  <motion.div
                    key={pending._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleKitchen(pending._id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                        >
                          {expanded ? (
                            <FiChevronUp size={17} />
                          ) : (
                            <FiChevronDown size={17} />
                          )}
                        </motion.button>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#181e53]">
                          <FiMapPin size={17} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-bold text-slate-800 sm:text-base">
                            {pending.kitchenId?.name || "Kitchen"}
                          </h2>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {pending.items.length} item
                            {pending.items.length !== 1 ? "s" : ""} awaiting
                            action
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleKitchenSelection(pending)}
                        className="flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-[#181e53] transition hover:bg-indigo-50"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${allSelected ? "border-[#181e53] bg-[#181e53]" : "border-slate-300 bg-white"}`}
                        >
                          <AnimatePresence>
                            {allSelected && (
                              <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                              >
                                <FiCheck size={13} className="text-white" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        Select all
                      </motion.button>
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="divide-y divide-slate-100">
                            {pending.items.map((item) => {
                              const selected = isSelected(
                                pending._id,
                                item._id,
                              );

                              return (
                                <motion.div
                                  layout
                                  key={item._id}
                                  whileHover={{
                                    backgroundColor: "rgba(248,250,252,1)",
                                  }}
                                  className={`relative px-4 py-5 sm:px-5 ${selected ? "bg-indigo-50/40" : ""}`}
                                >
                                  {selected && (
                                    <motion.div
                                      layoutId={`selected-${pending._id}-${item._id}`}
                                      className="absolute bottom-0 left-0 top-0 w-1 bg-[#181e53]"
                                    />
                                  )}

                                  <div className="flex items-start gap-3 sm:gap-4">
                                    <motion.button
                                      whileTap={{ scale: 0.85 }}
                                      onClick={() =>
                                        toggleItemSelection(
                                          pending._id,
                                          item._id,
                                        )
                                      }
                                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${selected ? "border-[#181e53] bg-[#181e53]" : "border-slate-300 bg-white hover:border-slate-400"}`}
                                    >
                                      {selected && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                        >
                                          <FiCheck
                                            size={13}
                                            className="text-white"
                                          />
                                        </motion.span>
                                      )}
                                    </motion.button>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-[#181e53]">
                                            <FiPackage size={14} />
                                          </span>

                                          <span className="break-words">
                                            {item.inventoryId?.name ||
                                              "Unknown Item"}
                                          </span>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                          {item.referenceToOriginalRequirementId?.createdAt
                                            ? new Date(
                                                item
                                                  .referenceToOriginalRequirementId
                                                  ?.createdAt,
                                              ).toLocaleDateString("en-IN", {
                                                dateStyle: "medium",
                                              })
                                            : "--"}
                                        </span>
                                      </div>

                                      <div className="mt-4 grid grid-cols-1 gap-2.5 text-xs text-slate-500 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
                                        <div className="flex items-center gap-1.5">
                                          <FiPackage
                                            size={14}
                                            className="text-slate-400"
                                          />
                                          <span className="font-medium text-slate-600">
                                            {item.requestedQuantity}{" "}
                                            {item.unit}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          <FiCalendar
                                            size={14}
                                            className="text-slate-400"
                                          />
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

                                        <div className="flex items-center gap-1.5">
                                          <FiFileText
                                            size={14}
                                            className="text-blue-500"
                                          />

                                          <a
                                            href={`/store/requirements/${item?.referenceToOriginalRequirementId?._id}`}
                                            className="font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
                                          >
                                            Ref:{" "}
                                            {getReferenceValue(
                                              item.referenceToOriginalRequirementId,
                                            )}
                                          </a>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          <FiUser
                                            size={14}
                                            className="text-slate-400"
                                          />
                                          <span>
                                            {item.createdBy?.name || "Unknown"}
                                          </span>
                                        </div>
                                      </div>

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
                                          className="mt-4 overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3.5 sm:p-4"
                                        >
                                          <div className="mb-3 flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                              <FiTruck size={15} />
                                            </div>

                                            <div>
                                              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                                                Fulfilled
                                              </p>

                                              <p className="text-xs text-amber-700">
                                                This item has already been
                                                fulfilled.
                                              </p>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                                            <div className="min-w-0">
                                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                Dispatched Ref
                                              </p>

                                              <a
                                                href={`/store/requirements/${item.referenceToDispatchedRequirementId}`}
                                                className="mt-1 block truncate text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                title={getReferenceValue(
                                                  item.referenceToDispatchedRequirementId,
                                                )}
                                              >
                                                {getReferenceValue(
                                                  item.referenceToDispatchedRequirementId,
                                                )}
                                              </a>
                                            </div>

                                            <div>
                                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                Fulfilled At
                                              </p>

                                              <p className="mt-1 text-sm font-medium text-slate-700">
                                                {new Date(
                                                  item.fulfilledAt,
                                                ).toLocaleString("en-IN", {
                                                  dateStyle: "medium",
                                                  timeStyle: "medium",
                                                  timeZone: "Asia/Kolkata",
                                                })}
                                              </p>
                                            </div>

                                            <div className="min-w-0">
                                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                Fulfilled By
                                              </p>

                                              <p
                                                className="mt-1 truncate text-sm font-medium text-slate-700"
                                                title={item.fulfilledBy?.name}
                                              >
                                                {item.fulfilledBy?.name || "-"}
                                              </p>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </div>

                                    <div className="relative shrink-0">
                                      <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() =>
                                          setOpenMenu(
                                            openMenu === item._id
                                              ? null
                                              : item._id,
                                          )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
                                            className="absolute right-0 top-10 z-50 w-48 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10"
                                          >
                                            <button
                                              type="button"
                                              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                            >
                                              <FiFileText size={15} />
                                              Item Details
                                            </button>

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
                                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 top-5 z-50 px-3 sm:px-4"
                >
                  <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
                    <div className="flex items-center justify-between bg-gradient-to-r from-[#181e53] to-[#252b68] px-4 py-4 sm:px-5">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white/70">
                            Pending Requirements
                          </span>
                        </div>

                        <h2 className="text-base font-bold text-white sm:text-lg">
                          {requirementId?.[0]?.kitchen || "Kitchen"} Kitchen
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowRequirement(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
                        aria-label="Close"
                      >
                        <IoMdCloseCircle size={23} />
                      </button>
                    </div>

                    <div className="max-h-[55vh] overflow-y-auto bg-slate-50/80 p-3 sm:p-4">
                      {requirementId?.length > 0 ? (
                        <RequirementList
                          requirements={requirementId}
                          onSelect={(requirement) => {
                            handleMerge(requirement);
                          }}
                          onClose={() => {
                            setShowRequirement(false);
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <FiFileText size={20} />
                          </div>

                          <p className="text-sm font-medium text-slate-700">
                            No pending requirements found.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3">
                      <span className="text-xs font-medium text-slate-500">
                        {requirementId?.length || 0} requirement
                        {requirementId?.length === 1 ? "" : "s"}
                      </span>

                      <button
                        type="button"
                        onClick={() => setShowRequirement(false)}
                        className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Pending;
