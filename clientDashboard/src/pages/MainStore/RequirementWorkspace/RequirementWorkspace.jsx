import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import { LuTrash2 } from "react-icons/lu";

import { getRequirementById, dispatchRequirement, updateRequirement, deletedRequirement } from "../../../services/requirement.service";
import { getInventory } from "../../../services/inventory.service";
import { getVehicles } from "../../../services/vehicle.service";
import { getDrivers } from "../../../services/driver.service";

import { storage } from "../../../utils/storage";
import DispatchDetails from "../../../components/shared/dispatch/DispatchDetails";
import EditGatePassImage from "../../../components/shared/dispatch/EditGatePassImage";

import { VscKebabVertical } from "react-icons/vsc";
import { MdSendAndArchive } from "react-icons/md";
import { TiDocumentAdd } from "react-icons/ti";

import ItemSelectorModal from "../../../components/kitchen/requirement/ItemSelectorModal";
import { AnimatePresence, motion } from "framer-motion";
import ItemCard from "../../../components/kitchen/requirement/ItemCard";

import { FaSave } from "react-icons/fa";
import { FiEdit2, FiLoader } from "react-icons/fi";

import toast from "react-hot-toast";
import { createPendingItems } from "../../../services/pendingFulfillment.service";

const RequirementWorkspaceSkeleton = () => {
  return (
    <div className="min-h-screen space-y-5 bg-slate-50/70 pb-10 animate-pulse">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-7 w-52 rounded-lg bg-slate-200" />
            <div className="h-4 w-64 rounded-md bg-slate-100" />
          </div>
          <div className="h-8 w-28 rounded-full bg-slate-200" />
        </div>
        <div className="mt-7 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-100" />
              <div className="h-5 w-40 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-40 rounded-lg bg-slate-200" />
            <div className="h-3 w-56 rounded bg-slate-100" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex gap-4">
                <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="h-4 w-28 rounded bg-slate-100" />
                </div>
                <div className="h-8 w-8 rounded-lg bg-slate-100" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-slate-100" />
                  <div className="h-5 w-24 rounded bg-slate-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-slate-100" />
                  <div className="h-5 w-24 rounded bg-slate-200" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-12 w-full rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[1, 2].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 h-6 w-40 rounded-lg bg-slate-200" />
            <div className="space-y-4">
              <div className="h-12 w-full rounded-xl bg-slate-200" />
              <div className="mx-auto h-4 w-8 rounded bg-slate-100" />
              <div className="h-12 w-full rounded-xl bg-slate-200" />
              {item === 2 && <><div className="h-12 w-full rounded-xl bg-slate-200" /><div className="h-12 w-full rounded-xl bg-slate-200" /></>}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 h-6 w-44 rounded-lg bg-slate-200" />
        <div className="h-28 w-full rounded-xl bg-slate-200" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 h-6 w-40 rounded-lg bg-slate-200" />
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4">
              <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-28 rounded bg-slate-100" />
                <div className="h-3 w-36 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-12 w-full rounded-xl bg-slate-200" />
    </div>
  );
};

const RequirementWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(storage.getUser());
  const [requirement, setRequirement] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");

  const [manualVehicleNumber, setManualVehicleNumber] = useState("");
  const [manualDriverName, setManualDriverName] = useState("");
  const [manualDriverPhone, setManualDriverPhone] = useState("");

  const [isDispatching, setIsDispatching] = useState(false);
  const [isAddingItems, setIsAddingItems] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [editingItemId, setEditingItemId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [isSavingQuantity, setIsSavingQuantity] = useState(false);

  const addItem = (item) => {
    if (selectedItems.some((i) => i._id === item._id)) return;

    setSelectedItems((prev) => [...prev, { ...item, quantity: item.bagSize }]);
  };

  const updateQuantity = (_id, quantity) => {
    if (quantity < 1) quantity = 1;

    setSelectedItems((prev) => prev.map((item) => item._id === _id ? { ...item, quantity } : item));
  };

  const removeItem = (_id) => {
    setSelectedItems((prev) => prev.filter((item) => item._id !== _id));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadData = async () => {
    try {
      const [requirementData, inventoryData, vehicleData, driverData] = await Promise.all([getRequirementById(id), getInventory(), getVehicles(), getDrivers()]);

      setRequirement({
        ...requirementData,
        items: requirementData.items.map((item) => ({ ...item, dispatchedQuantity: item.dispatchedQuantity ?? item.quantity })),
      });

      setInventory(inventoryData);
      setVehicles(vehicleData);
      setDrivers(driverData);
      setRemarks(requirementData.publicRemarks || "");
      setVehicleId(requirementData.vehicle?._id || "");
      setDriverId(requirementData.driver?._id || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isDispatched = requirement?.status === "Out For Delivery";
  const isReceived = requirement?.status === "Received";

  const inventoryMap = useMemo(() => {
    const map = {};
    inventory.forEach((item) => {
      map[item._id] = item;
    });
    return map;
  }, [inventory]);

  const updateDispatchQuantity = (inventoryId, value) => {
    setRequirement((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.inventoryId._id !== inventoryId) return item;

        if (value === "") {
          return { ...item, dispatchedQuantity: "" };
        }

        let quantity = Number(value);

        if (quantity < 0) quantity = 0;

        return { ...item, dispatchedQuantity: quantity };
      }),
    }));
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this requirement?");

    if (!confirmed) return;

    try {
      await deletedRequirement(id);
      toast.success("Deleted successfully");
      window.location.href = "/store/requirements";
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete requirement");
    }
  };

  const handleSaveItem = async () => {
    const itemPayload = selectedItems.map((item) => ({ inventoryId: item._id, quantity: item.quantity, unit: item.unit }));

    setIsAddingItems(true);

    try {
      const updatedRequirement = await updateRequirement(requirement._id, itemPayload);
      setRequirement(updatedRequirement.data);
      setSelectedItems([]);
      setIsAddingItems(false);
      toast.success(updatedRequirement.message);
    } catch (error) {
      toast.error(error.message);
      setIsAddingItems(false);
    }
  };

  const handleSave = async () => {
    if (!vehicleId && !manualVehicleNumber) {
      alert("Please select a vehicle or type a manual vehicle number.");
      return;
    }

    if (!driverId && !manualDriverName) {
      alert("Please select a driver or type a manual driver name.");
      return;
    }

    if (manualDriverName && !manualDriverPhone) {
      alert("Please type the driver's phone number also.");
      return;
    }

    setIsDispatching(true);

    try {
      const payload = {
        vehicleId,
        manualVehicleNumber,
        driverId,
        manualDriverName,
        manualDriverPhone,
        remarks,
        items: requirement.items.map((item) => ({
          inventoryId: item.inventoryId._id,
          quantity: item.quantity,
          dispatchedQuantity: item.dispatchedQuantity,
          unit: item.unit,
        })),
      };

      await dispatchRequirement(requirement._id, payload);

      alert("Requirement dispatched successfully.");
      navigate("/store/requirements");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to dispatch.");
    } finally {
      setIsDispatching(false);
    }
  };

  if (loading) {
    return <RequirementWorkspaceSkeleton />;
  }

  const handleHaveItemForLatter = async (item) => {
    try {
      const payload = { ...item, _id: id };
      await createPendingItems(payload);

      setRequirement((prev) => ({
        ...prev,
        items: prev.items.map((existingItem) => existingItem.inventoryId?._id === item.inventoryId ? { ...existingItem, fulfillmentStatus: false } : existingItem),
      }));

      toast.success("saved for latter");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEditQuantity = (item) => {
    setEditingItemId(item.inventoryId?._id);
    setEditQuantity(item.quantity);
    setOpenDropdownId(null);
  };

  const handleQuantityChange = (value) => {
    setEditQuantity(value);
  };

  const handleSaveQuantity = async (item) => {
    const payload = { ...item, quantity: editQuantity, _id: id, action: "updateQuantity" };

    if (editQuantity === "" || Number(editQuantity) < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setIsSavingQuantity(true);

    try {
      const response = await updateRequirement(requirement._id, payload);

      setRequirement((prev) => ({ ...prev, ...response.data }));

      setEditingItemId(null);
      setEditQuantity("");

      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update quantity");
    } finally {
      setIsSavingQuantity(false);
    }
  };

  const handleArchiveItem = async (id) => {
    console.log(id);
  };

  if (requirement) {
    return (
      <div className="min-h-screen space-y-5 bg-slate-50/70 pb-10">
        <Card>
          <div className="relative overflow-hidden">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Requirement Workspace</span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{requirement.requirementNumber}</h2>

                <p className="mt-1.5 text-sm text-slate-500">{new Date(requirement.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">{requirement.status}</span>

                <motion.button type="button" onClick={() => handleDelete(requirement._id)} title="Delete requirement" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="group flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 shadow-sm transition-colors hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                  <motion.div whileHover={{ rotate: [-5, 5, -5, 0] }} transition={{ duration: 0.3 }}>
                    <LuTrash2 className="text-lg" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            <div className="relative mt-7 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Kitchen</p>
                <p className="font-semibold text-slate-800">{requirement.kitchen?.name}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Address</p>
                <p className="line-clamp-2 text-sm font-medium text-slate-700">{requirement.kitchen?.address}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Created By</p>
                <p className="font-semibold text-slate-800">{requirement.createdBy?.name}</p>
              </div>
            </div>
          </div>
        </Card>

        <ItemSelectorModal open={showModal} onClose={() => setShowModal(false)} items={inventory} selectedItems={selectedItems} onSelect={addItem} />

        <AnimatePresence>
          {selectedItems.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">Items to add</h3>
                  <p className="text-xs text-slate-500">{selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected</p>
                </div>

                <button type="button" onClick={handleSaveItem} disabled={isAddingItems} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isAddingItems ? <FiLoader className="animate-spin" /> : <FaSave />}
                  {isAddingItems ? "Saving..." : "Save Items"}
                </button>
              </div>

              <div className="space-y-2">
                {selectedItems.map((item, index) => (
                  <motion.div key={item._id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className={index !== selectedItems.length - 1 ? "border-b border-blue-100 pb-2" : ""}>
                    <ItemCard item={item} onQuantityChange={(qty) => updateQuantity(item._id, qty)} onRemove={() => removeItem(item._id)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">Requested Items</h3>
              <p className="mt-1 text-xs text-slate-400">Items requested by the kitchen</p>
            </div>

            <button type="button" onClick={() => setShowModal(!showModal)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
              <TiDocumentAdd className="text-2xl" />
            </button>
          </div>

          <div className="space-y-4">
            {requirement?.items?.filter((item) => item?.fulfillmentStatus === true || item?.fulfillmentStatus === undefined).map((item) => {
              const stock = inventoryMap[item?.inventoryId?._id];

              return (
                <motion.div layout key={item?.inventoryId?._id} className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md sm:p-5">
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <img src={`/items/${item?.inventoryId?.image}`} alt={item?.inventoryId?.name} className="h-16 w-16 rounded-xl border border-slate-100 bg-slate-50 object-cover shadow-sm" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-bold text-slate-800">{item?.inventoryId?.name}</h4>
                      <p className="mt-1 text-sm text-slate-400">{item?.inventoryId?.hindiName}</p>

                      {stock && (
                        <div className="mt-2 inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                          Stock available: {stock.quantity ?? 0}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div ref={dropdownRef} className="relative">
                        <button type="button" onClick={() => setOpenDropdownId((prev) => prev === item?.inventoryId?._id ? null : item?.inventoryId?._id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                          <VscKebabVertical className="text-xl" />
                        </button>

                        {openDropdownId === item?.inventoryId?._id && (
                          <motion.div initial={{ opacity: 0, scale: 0.96, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="absolute right-0 top-10 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                            {user.role !== "district coordinator" && user?.role !== "Chief Coordinator" && (
                              <button type="button" onMouseDown={(e) => { e.stopPropagation(); handleHaveItemForLatter({ kitchenId: requirement.kitchen._id, requirementNumber: requirement.requirementNumber, quantity: item?.quantity, inventoryId: item?.inventoryId?._id, unit: item?.inventoryId?.unit }); setOpenDropdownId(null); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600">
                                <MdSendAndArchive className="text-lg" />
                                Save For Later
                              </button>
                            )}

                            <button type="button" onMouseDown={(e) => { e.stopPropagation(); handleEditQuantity(item); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600">
                              <FiEdit2 />
                              Edit Quantity
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Requested</p>

                      {editingItemId === item?.inventoryId?._id ? (
                        <div className="mt-3 col-span-2 flex flex-wrap items-center gap-2">
                          <input type="number" min={1} value={editQuantity} onChange={(e) => handleQuantityChange(e.target.value)} className="h-10 w-24 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" autoFocus />

                          <button type="button" onClick={() => handleSaveQuantity({ kitchenId: requirement.kitchen._id, requirementNumber: requirement.requirementNumber, inventoryId: item?.inventoryId?._id, unit: item?.inventoryId?.unit })} disabled={isSavingQuantity} className="flex h-10 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {isSavingQuantity ? <FiLoader className="animate-spin" /> : <FaSave />}
                            {isSavingQuantity ? "Saving" : "Save"}
                          </button>

                          <button type="button" onClick={() => { setEditingItemId(null); setEditQuantity(""); }} disabled={isSavingQuantity} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="mt-1 text-base font-bold text-slate-800">{item?.quantity} <span className="text-xs font-medium text-slate-400">{item?.inventoryId?.unit}</span></p>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Updated</p>
                      {item?.updated ? (
                        <p className="mt-1 text-base font-bold text-emerald-600">{item?.updated.quantity} <span className="text-xs font-medium text-emerald-500">{item?.inventoryId?.unit}</span></p>
                      ) : (
                        <p className="mt-1 text-base font-semibold text-slate-300">—</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dispatch Quantity</label>
                      <span className="text-[11px] text-slate-400">{item?.inventoryId?.unit}</span>
                    </div>

                    <input type="number" disabled={isDispatched || isReceived} min={0} value={item?.updated?.quantity || item?.dispatchedQuantity} onChange={(e) => updateDispatchQuantity(item?.inventoryId?._id, e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" />
                  </div>
                </motion.div>
              );
            })}

            {requirement?.items?.filter((item) => item?.fulfillmentStatus === true || item?.fulfillmentStatus === undefined).length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <TiDocumentAdd className="text-2xl" />
                </div>
                <p className="font-semibold text-slate-700">No active items</p>
                <p className="mt-1 text-sm text-slate-400">Add an item to this requirement to continue.</p>
              </div>
            )}

            {requirement.remarks && (
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">Remarks</p>
                <span className="whitespace-pre-line break-words text-sm leading-6 text-slate-600">{requirement.remarks}</span>
              </div>
            )}
          </div>
        </Card>

        {isDispatched || isReceived ? (
          <>
            <DispatchDetails requirement={requirement} user={user} />

            {isReceived && requirement.gatePass?.length > 0 && user.role !== "district coordinator" && user?.role !== "Chief Coordinator" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditGatePassImage requirement={requirement} onSuccess={(updatedRequirement) => { setRequirement(updatedRequirement); }} />
              </div>
            )}
          </>
        ) : (
          user.role !== "district coordinator" && user?.role !== "Chief Coordinator" && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">🚚</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Vehicle Details</h3>
                    <p className="text-xs text-slate-400">Select or enter delivery vehicle</p>
                  </div>
                </div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Registered Vehicle</label>

                <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                  <option value="">Select Vehicle</option>
                  {vehicles.filter((vehicle) => vehicle.isActive).map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>{vehicle.vehicleNumber} - {vehicle.vehicleName}</option>
                  ))}
                </select>

                <div className="my-4 flex items-center gap-3 text-xs font-medium text-slate-400">
                  <div className="h-px flex-1 bg-slate-100" />
                  OR
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <input type="text" placeholder="Enter vehicle number manually" value={manualVehicleNumber} onChange={(e) => setManualVehicleNumber(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
              </Card>

              <Card>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">👤</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Driver Details</h3>
                    <p className="text-xs text-slate-400">Assign a delivery driver</p>
                  </div>
                </div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Registered Driver</label>

                <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                  <option value="">Select Driver</option>
                  {drivers.filter((driver) => driver.isActive).map((driver) => (
                    <option key={driver._id} value={driver._id}>{driver.name} - {driver.phone}</option>
                  ))}
                </select>

                <div className="my-4 flex items-center gap-3 text-xs font-medium text-slate-400">
                  <div className="h-px flex-1 bg-slate-100" />
                  OR
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="space-y-3">
                  <input type="text" placeholder="Driver name" value={manualDriverName} onChange={(e) => setManualDriverName(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                  <input type="text" placeholder="Driver phone number" value={manualDriverPhone} onChange={(e) => setManualDriverPhone(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </Card>
            </div>
          )
        )}

        {user.role !== "district coordinator" && user?.role !== "Chief Coordinator" && (
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">✎</div>
              <div>
                <h3 className="font-bold text-slate-900">Dispatch Remarks</h3>
                <p className="text-xs text-slate-400">Add additional information for this dispatch</p>
              </div>
            </div>

            <textarea rows={4} disabled={isDispatched || isReceived} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Write dispatch remarks..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" />
          </Card>
        )}

        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">Activity History</h3>
            <p className="mt-1 text-xs text-slate-400">Recent activity for this requirement</p>
          </div>

          {requirement.activities?.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">No activities found.</div>
          ) : (
            <div className="relative space-y-6">
              <div className="absolute bottom-3 left-4 top-3 w-px bg-slate-200" />

              {requirement?.activities?.map((activity) => (
                <div key={activity._id} className="relative flex gap-4">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-teal-500 shadow-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800">{activity.action}</p>
                      <p className="text-[11px] text-slate-400">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>

                    <p className="mt-1 text-xs font-medium text-slate-500">{activity.user?.name}</p>

                    {activity.remarks && <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600">{activity.remarks}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {!isDispatched && !isReceived && user.role !== "district coordinator" && user.role !== "Chief Coordinator" && (
          <div className="sticky bottom-4 z-30">
            <Button className="w-full !rounded-xl !py-3.5 shadow-lg shadow-blue-600/20" onClick={handleSave} disabled={isDispatching}>
              {isDispatching ? (
                <span className="flex items-center justify-center gap-2">
                  Dispatching...
                  <FiLoader className="animate-spin text-xl" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">Dispatch Requirement <span>→</span></span>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
};

export default RequirementWorkspace;
