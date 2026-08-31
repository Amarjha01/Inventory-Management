import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  MdAdd,
  MdEdit,
  MdSearch,
  MdWarningAmber,
  MdInventory,
  MdCheckCircle,
  MdClose,
  MdTune,
  MdImage,
  MdCategory,
} from "react-icons/md";

import {
  FaToggleOn,
  FaToggleOff,
  FaBoxesStacked,
} from "react-icons/fa6";

import {
  FiPackage,
  FiLayers,
  FiActivity,
  FiSave,
} from "react-icons/fi";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";

import category from "../../../constants/category.js";

import {
  getInventory,
  createInventory,
  updateInventory,
} from "../../../services/inventory.service";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider.jsx";
import { themes } from "../../../components/shared/ui/Theme.js";
import PageHeader from "../../../components/shared/ui/PageHeader.jsx";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    hindiName: "",
    requirementType: "",
    quantity: "",
    minimumStock: "",
    bagSize: "",
    unit: "",
    isActive: true,
    image: "",
  });

  // --------------------------------------------------
  // Fetch Inventory
  // --------------------------------------------------

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const items = await getInventory();
      setInventory(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const stats = useMemo(() => {
    const total = inventory.length;

    const active = inventory.filter(
      (item) => item.isActive
    ).length;

    const inactive = inventory.filter(
      (item) => !item.isActive
    ).length;

    const lowStock = inventory.filter(
      (item) =>
        Number(item.quantity) <= Number(item.minimumStock)
    ).length;

    const healthy = inventory.filter(
      (item) =>
        Number(item.quantity) > Number(item.minimumStock)
    ).length;

    return {
      total,
      active,
      inactive,
      lowStock,
      healthy,
    };
  }, [inventory]);

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.hindiName?.toLowerCase().includes(query) ||
        item.requirementType?.toLowerCase().includes(query);

      const lowStock =
        Number(item.quantity) <=
        Number(item.minimumStock);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "low"
          ? lowStock
          : filter === "active"
          ? item.isActive
          : filter === "inactive"
          ? !item.isActive
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [inventory, search, filter]);

  // --------------------------------------------------
  // Modal
  // --------------------------------------------------

  const openAddModal = () => {
    setEditingItem(null);

    setForm({
      name: "",
      hindiName: "",
      requirementType: "",
      quantity: "",
      minimumStock: "",
      bagSize: "",
      unit: "",
      isActive: true,
      image: "",
    });

    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);

    setForm({
      name: item.name || "",
      hindiName: item.hindiName || "",
      requirementType: item.requirementType || "",
      quantity: item.quantity ?? "",
      minimumStock: item.minimumStock ?? "",
      bagSize: item.bagSize ?? "",
      unit: item.unit || "",
      isActive: item.isActive,
      image: item.image || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setShowModal(false);
    setEditingItem(null);
  };

  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.unit) {
      alert("Please fill required fields.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity) || 0,
        minimumStock: Number(form.minimumStock) || 0,
        bagSize: Number(form.bagSize) || 0,
      };

      if (editingItem) {
        await updateInventory(
          editingItem._id,
          payload
        );
      } else {
        await createInventory(payload);
      }

      await fetchInventory();

      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save inventory item.");
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------
  // Toggle
  // --------------------------------------------------

  const handleToggle = async (item) => {
    try {
      const newStatus = !item.isActive;

      const payload = {
        ...item,
        isActive: newStatus,
      };

      await updateInventory(item._id, payload);

      setInventory((prev) =>
        prev.map((inventoryItem) =>
          inventoryItem._id === item._id
            ? {
                ...inventoryItem,
                isActive: newStatus,
              }
            : inventoryItem
        )
      );
    } catch (error) {
      console.error(
        "Failed to update item status:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return <Loader />;
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f9fa] pb-28">
    <ThemeProvider
        theme={themes.INVENTORY}
        className="min-h-full pb-24"
      >
      {/* =========================================
          PAGE HEADER
      ========================================== */}
    
      <PageHeader
            title="Inventory"
            subtitle="Manage warehouse stock"
            imageUrl={'/ui/INVENTORY.png'}
          />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between gap-4">
            <div className="mb-2 flex items-center gap-2">

              <div className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-teal-50
                text-teal-700
              ">
                <MdInventory size={21} />
              </div>

              <span className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-teal-700
              ">
                Warehouse
              </span>
            </div>
 

          <button
            onClick={openAddModal}
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-xl
              bg-teal-600
              px-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              shadow-teal-600/20
              transition
              hover:bg-teal-700
              active:scale-[0.98]
            "
          >
            <MdAdd size={21} />

            <span className="hidden sm:inline">
              Add Item
            </span>
          </button>
        </div>
      </motion.div>


      {/* =========================================
          MAIN STAT
      ========================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="
          mb-4
          overflow-hidden
          rounded-2xl
          border
          border-teal-100
          bg-gradient-to-br
          from-teal-50
          via-white
          to-white
          p-5
          shadow-sm
        "
      >

        <div className="
          flex
          items-center
          justify-between
          gap-4
        ">

          <div className="flex items-center gap-4">

            <div className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-teal-100
              text-teal-700
            ">
              <FaBoxesStacked size={25} />
            </div>

            <div>
              <p className="
                text-sm
                font-medium
                text-gray-500
              ">
                Total Items
              </p>

              <p className="
                mt-0.5
                text-3xl
                font-bold
                tracking-tight
                text-gray-900
              ">
                {stats.total}
              </p>
            </div>

          </div>

          <div className="
            hidden
            text-right
            sm:block
          ">
            <p className="text-xs text-gray-400">
              Inventory Status
            </p>

            <p className="
              mt-1
              text-sm
              font-semibold
              text-teal-700
            ">
              {stats.active} Active
            </p>
          </div>

        </div>

        {/* Active / inactive */}
        <div className="
          mt-5
          flex
          items-center
          gap-4
          border-t
          border-teal-100
          pt-4
        ">

          <div className="
            flex
            items-center
            gap-2
            text-xs
            text-gray-500
          ">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {stats.active} Active
          </div>

          <div className="
            flex
            items-center
            gap-2
            text-xs
            text-gray-500
          ">
            <span className="
              h-2
              w-2
              rounded-full
              bg-gray-400"
            />

            {stats.inactive} Inactive
          </div>

        </div>
      </motion.div>


      {/* =========================================
          STOCK STATS
      ========================================== */}

      <div className="
        mb-5
        grid
        grid-cols-2
        gap-3
      ">

        {/* Low Stock */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setFilter("low")}
          className={`
            rounded-2xl
            border
            p-4
            text-left
            transition
            ${
              filter === "low"
                ? "border-red-200 bg-red-50"
                : "border-gray-100 bg-white hover:border-red-100"
            }
          `}
        >
          <div className="flex items-center justify-between">

            <div className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
            ">
              <MdWarningAmber size={22} />
            </div>

            <span className="
              text-xs
              font-medium
              text-red-500
            ">
              Needs attention
            </span>

          </div>

          <p className="
            mt-3
            text-xs
            font-medium
            text-gray-500
          ">
            Low Stock
          </p>

          <p className="
            mt-0.5
            text-2xl
            font-bold
            text-gray-900
          ">
            {stats.lowStock}
          </p>

        </motion.button>


        {/* Healthy */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setFilter("active")}
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-4
            text-left
            transition
            hover:border-green-100
          "
        >
          <div className="flex items-center justify-between">

            <div className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
            ">
              <MdCheckCircle size={22} />
            </div>

            <span className="
              text-xs
              font-medium
              text-green-600
            ">
              Healthy
            </span>

          </div>

          <p className="
            mt-3
            text-xs
            font-medium
            text-gray-500
          ">
            Healthy Stock
          </p>

          <p className="
            mt-0.5
            text-2xl
            font-bold
            text-gray-900
          ">
            {stats.healthy}
          </p>

        </motion.button>

      </div>


      {/* =========================================
          SEARCH
      ========================================== */}

      <div className="
        mb-4
        flex
        gap-2
      ">

        <div className="relative flex-1">

          <MdSearch
            size={22}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search inventory..."
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              pl-11
              pr-4
              text-sm
              text-gray-800
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-teal-500
              focus:ring-4
              focus:ring-teal-500/10
            "
          />

        </div>

        <button
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-gray-200
            bg-white
            text-gray-500
            transition
            hover:border-teal-200
            hover:text-teal-600
          "
        >
          <MdTune size={21} />
        </button>

      </div>


      {/* =========================================
          FILTER TABS
      ========================================== */}

      <div className="
        mb-5
        flex
        gap-2
        overflow-x-auto
        pb-1
        scrollbar-none
      ">

        {[
          ["all", "All"],
          ["low", "Low Stock"],
          ["active", "Active"],
          ["inactive", "Inactive"],
        ].map(([value, label]) => (

          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`
              whitespace-nowrap
              rounded-full
              px-4
              py-2
              text-xs
              font-semibold
              transition
              ${
                filter === value
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-teal-200"
              }
            `}
          >
            {label}
          </button>

        ))}

      </div>


      {/* =========================================
          RESULT COUNT
      ========================================== */}

      <div className="
        mb-3
        flex
        items-center
        justify-between
      ">

        <p className="
          text-sm
          font-semibold
          text-gray-700
        ">
          Inventory Items
        </p>

        <p className="
          text-xs
          text-gray-400
        ">
          {filteredInventory.length} items
        </p>

      </div>


      {/* =========================================
          INVENTORY LIST
      ========================================== */}

      <div className="space-y-3">

        <AnimatePresence mode="popLayout">

          {filteredInventory.map((item, index) => {

            const quantity =
              Number(item.quantity) || 0;

            const minimum =
              Number(item.minimumStock) || 0;

            const lowStock =
              quantity <= minimum;

            const stockPercentage =
              minimum > 0
                ? Math.min(
                    (quantity / (minimum * 2)) * 100,
                    100
                  )
                : 100;

            return (

              <motion.div
                key={item._id}
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
                  scale: 0.98,
                }}
                transition={{
                  delay: index * 0.03,
                }}
              >

                <div className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition
                  hover:border-gray-200
                  hover:shadow-md
                ">

                  {/* Item Header */}

                  <div className="
                    flex
                    gap-4
                    p-4
                  ">

                    {/* Image */}

                    <div className="
                      relative
                      shrink-0
                    ">

                      <div className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-100
                        bg-gray-50
                      ">

                        {item.image ? (
                          <img
                            src={`/items/${item.image}`}
                            alt={item.name}
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <MdImage
                            size={30}
                            className="text-gray-300"
                          />
                        )}

                      </div>

                      {/* Status */}

                      <div className="
                        absolute
                        -bottom-1
                        -right-1
                        rounded-full
                        border-2
                        border-white
                        bg-white
                      ">
                        {item.isActive ? (
                          <span className="
                            block
                            h-3
                            w-3
                            rounded-full
                            bg-green-500
                          " />
                        ) : (
                          <span className="
                            block
                            h-3
                            w-3
                            rounded-full
                            bg-gray-400
                          " />
                        )}
                      </div>

                    </div>


                    {/* Content */}

                    <div className="min-w-0 flex-1">

                      <div className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      ">

                        <div className="min-w-0">

                          <h2 className="
                            truncate
                            text-base
                            font-bold
                            text-gray-900
                          ">
                            {item.name}
                          </h2>

                          {item.hindiName && (
                            <p className="
                              mt-0.5
                              truncate
                              text-sm
                              text-gray-500
                            ">
                              {item.hindiName}
                            </p>
                          )}

                        </div>


                        <button
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-gray-400
                            transition
                            hover:bg-teal-50
                            hover:text-teal-600
                          "
                        >
                          <MdEdit size={19} />
                        </button>

                      </div>


                      {/* Category */}

                      {item.requirementType && (
                        <div className="
                          mt-2
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-gray-50
                          px-2.5
                          py-1
                          text-[11px]
                          font-medium
                          text-gray-500
                        ">
                          <MdCategory size={13} />

                          {item.requirementType}
                        </div>
                      )}

                    </div>

                  </div>


                  {/* Stock Details */}

                  <div className="
                    border-t
                    border-gray-100
                    px-4
                    py-3
                  ">

                    <div className="
                      grid
                      grid-cols-2
                      gap-4
                    ">

                      <div>
                        <p className="
                          text-[11px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-gray-400
                        ">
                          Current Stock
                        </p>

                        <p className="
                          mt-1
                          text-sm
                          font-bold
                          text-gray-800
                        ">
                          {quantity}{" "}
                          <span className="
                            font-medium
                            text-gray-400
                          ">
                            {item.unit}
                          </span>
                        </p>
                      </div>


                      <div>
                        <p className="
                          text-[11px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-gray-400
                        ">
                          Minimum
                        </p>

                        <p className="
                          mt-1
                          text-sm
                          font-bold
                          text-gray-800
                        ">
                          {minimum}{" "}
                          <span className="
                            font-medium
                            text-gray-400
                          ">
                            {item.unit}
                          </span>
                        </p>
                      </div>

                    </div>


                    {/* Progress */}

                    <div className="mt-3">

                      <div className="
                        mb-1.5
                        flex
                        items-center
                        justify-between
                      ">

                        <span className={`
                          text-[11px]
                          font-semibold
                          ${
                            lowStock
                              ? "text-red-500"
                              : "text-green-600"
                          }
                        `}>
                          {lowStock
                            ? "Low Stock"
                            : "Healthy Stock"}
                        </span>

                        <span className="
                          text-[10px]
                          text-gray-400
                        ">
                          {item.bagSize
                            ? `${item.bagSize} ${item.unit}/bag`
                            : ""}
                        </span>

                      </div>

                      <div className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-gray-100
                      ">

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${stockPercentage}%`,
                          }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.03,
                          }}
                          className={`
                            h-full
                            rounded-full
                            ${
                              lowStock
                                ? "bg-red-500"
                                : "bg-green-500"
                            }
                          `}
                        />

                      </div>

                    </div>

                  </div>


                  {/* Bottom Action */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-gray-100
                    bg-gray-50/50
                    px-4
                    py-2.5
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2
                    ">

                      <FiActivity
                        size={14}
                        className="text-gray-400"
                      />

                      <span className="
                        text-[11px]
                        text-gray-500
                      ">
                        {item.isActive
                          ? "Available for requirements"
                          : "Item disabled"}
                      </span>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(item)
                      }
                      className="
                        transition
                        active:scale-95
                      "
                      aria-label={
                        item.isActive
                          ? "Disable item"
                          : "Enable item"
                      }
                    >
                      {item.isActive ? (
                        <FaToggleOn
                          size={30}
                          className="text-green-500"
                        />
                      ) : (
                        <FaToggleOff
                          size={30}
                          className="text-gray-400"
                        />
                      )}
                    </button>

                  </div>

                </div>

              </motion.div>
            );
          })}

        </AnimatePresence>


        {/* Empty State */}

        {filteredInventory.length === 0 && (

          <div className="
            rounded-2xl
            border
            border-dashed
            border-gray-200
            bg-white
            px-6
            py-14
            text-center
          ">

            <div className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gray-50
              text-gray-400
            ">
              <FiPackage size={25} />
            </div>

            <h3 className="
              mt-4
              text-sm
              font-semibold
              text-gray-800
            ">
              No inventory found
            </h3>

            <p className="
              mt-1
              text-xs
              text-gray-400
            ">
              Try changing your search or filter.
            </p>

            {(search || filter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="
                  mt-4
                  text-xs
                  font-semibold
                  text-teal-600
                "
              >
                Clear filters
              </button>
            )}

          </div>

        )}

      </div>


      {/* =========================================
          ADD / EDIT MODAL
      ========================================== */}

      <AnimatePresence>

        {showModal && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-50
              flex
              items-end
              justify-center
              bg-black/40
              p-0
              backdrop-blur-sm
              sm:items-center
              sm:p-4
            "
            onMouseDown={closeModal}
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 30,
              }}
              transition={{
                duration: 0.2,
              }}
              onMouseDown={(e) =>
                e.stopPropagation()
              }
              className="
                max-h-[92vh]
                w-full
                overflow-y-auto
                rounded-t-3xl
                bg-white
                p-5
                scrollbar-none
                shadow-2xl
                sm:max-w-lg
                sm:rounded-3xl
              "
            >

              {/* Modal Header */}

              <div className="
                mb-5
                flex
                items-center
                justify-between
              ">

                <div>

                  <p className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-teal-600
                  ">
                    Inventory
                  </p>

                  <h2 className="
                    mt-1
                    text-xl
                    font-bold
                    text-gray-900
                  ">
                    {editingItem
                      ? "Edit Item"
                      : "Add New Item"}
                  </h2>

                </div>

                <button
                  onClick={closeModal}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                    text-gray-500
                    transition
                    hover:bg-gray-200
                  "
                >
                  <MdClose size={20} />
                </button>

              </div>


              {/* Form */}

              <div className="space-y-4">

                {/* Item Name */}

                <FormInput
                  label="Item Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Potato"
                  required
                />


                {/* Hindi Name */}

                <FormInput
                  label="Hindi Name"
                  name="hindiName"
                  value={form.hindiName}
                  onChange={handleChange}
                  placeholder="e.g. आलू"
                />


                {/* Category */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    text-gray-700
                  ">
                    Category
                  </label>

                  <select
                    name="requirementType"
                    value={form.requirementType}
                    onChange={handleChange}
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-3
                      text-sm
                      outline-none
                      transition
                      focus:border-teal-500
                      focus:ring-4
                      focus:ring-teal-500/10
                    "
                  >

                    <option value="">
                      Select Category
                    </option>

                    {category.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}

                  </select>

                </div>


                {/* Stock Row */}

                <div className="
                  grid
                  grid-cols-2
                  gap-3
                ">

                  <FormInput
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="0"
                  />

                  <FormInput
                    label="Minimum Stock"
                    name="minimumStock"
                    type="number"
                    value={form.minimumStock}
                    onChange={handleChange}
                    placeholder="0"
                  />

                </div>


                {/* Bag / Unit */}

                <div className="
                  grid
                  grid-cols-2
                  gap-3
                ">

                  <FormInput
                    label="Bag Size"
                    name="bagSize"
                    type="number"
                    value={form.bagSize}
                    onChange={handleChange}
                    placeholder="0"
                  />

                  <FormInput
                    label="Unit"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="kg"
                    required
                  />

                </div>


                {/* Image */}

                <FormInput
                  label="Image Name"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="potato.jpg"
                />


                {/* Active Status */}

                <div className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                ">

                  <div>

                    <p className="
                      text-sm
                      font-semibold
                      text-gray-800
                    ">
                      Item Status
                    </p>

                    <p className="
                      mt-0.5
                      text-xs
                      text-gray-500
                    ">
                      Allow this item in requirements
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        isActive:
                          !prev.isActive,
                      }))
                    }
                  >
                    {form.isActive ? (
                      <FaToggleOn
                        size={34}
                        className="text-green-500"
                      />
                    ) : (
                      <FaToggleOff
                        size={34}
                        className="text-gray-400"
                      />
                    )}
                  </button>

                </div>

              </div>


              {/* Actions */}

              <div className="
                mt-6
                grid
                grid-cols-2
                gap-3
              ">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="
                    h-11
                    rounded-xl
                    bg-gray-100
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:bg-gray-200
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-teal-600
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    shadow-teal-600/20
                    transition
                    hover:bg-teal-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {isSaving ? (
                    <>
                      <span className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      " />

                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={17} />

                      {editingItem
                        ? "Update Item"
                        : "Save Item"}
                    </>
                  )}

                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>
        </ThemeProvider>
    </div>
    
  );
};


// ==================================================
// FORM INPUT
// ==================================================

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>

      <label className="
        mb-1.5
        block
        text-xs
        font-semibold
        text-gray-700
      ">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          h-11
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          px-3
          text-sm
          text-gray-800
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-teal-500
          focus:ring-4
          focus:ring-teal-500/10
        "
      />

    </div>
  );
};

export default Inventory;