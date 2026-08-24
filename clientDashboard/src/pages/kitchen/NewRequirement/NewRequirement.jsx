import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiPackage, FiArrowRight } from "react-icons/fi";

import DashboardLayout from "../../../layouts/DashboardLayout";

import PageHeader from "../../../components/shared/ui/PageHeader";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";

import ItemCard from "../../../components/kitchen/requirement/ItemCard";
import ItemSelectorModal from "../../../components/kitchen/requirement/ItemSelectorModal";

import { storage } from "../../../utils/storage";
import { getInventory } from "../../../services/inventory.service";
import {
  createRequirement,
  getLatestKitchenRequirement,
} from "../../../services/requirement.service";
import Card from "../../../components/shared/ui/Card";
import toast from "react-hot-toast";
import RequirementTypeSelector from "../../../components/kitchen/requirement/RequirementTypeSelector";
import Maintenance from "../../../components/kitchen/requirement/Maintanance";

import { FiShoppingBag, FiSliders, FiMinus, FiTrash2 } from "react-icons/fi";
import {themes} from "../../../components/shared/ui/Theme.js";
const NewRequirementTheme = themes.NewRequirementTheme
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const NewRequirement = () => {
  const navigate = useNavigate();

  const user = storage.getUser();

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requirementType, setRequirementType] = useState("RM");
  const [theme, setTheme] = useState(NewRequirementTheme.RM);


  useEffect(() => {
    fetchLatestKitchenRequirement();
    fetchInventory(requirementType);
  }, []);

 const handleRequirementType = async (type) => {
  setRequirementType(type);

  // Change entire application theme
  setTheme(NewRequirementTheme[type]);

  // Fetch inventory only for inventory-based requirements
  if (["RM", "BARTAN", "STATIONERY"].includes(type)) {
    fetchInventory(type);
  }
};
  const fetchLatestKitchenRequirement = async () => {
    try {
      // const latestRequirement = await getLatestKitchenRequirement();
      // setActiveRequirement(latestRequirement);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchInventory = async (type) => {
    try {
      const items = await getInventory(type);
      setInventory(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (item) => {
    if (selectedItems.some((i) => i._id === item._id)) return;

    setSelectedItems((prev) => [
      ...prev,
      {
        ...item,
        quantity: item.bagSize,
      },
    ]);
  };

  const updateQuantity = (_id, quantity) => {
    if (quantity < 1) quantity = 1;

    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  const removeItem = (_id) => {
    setSelectedItems((prev) => prev.filter((item) => item._id !== _id));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!selectedItems.length) {
      toast.error("Please select at least one item.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        kitchen: user.kitchenId._id,
        createdBy: user._id,
        remarks,
        items: selectedItems.map((item) => ({
          inventoryId: item._id,
          quantity: Number(item.quantity),
          unit: item.unit,
        })),
      };

      const requirement = await createRequirement(payload);
      setIsLoading(false);
      toast.success("Submited");
      navigate(`/requirements/${requirement._id}`);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(
        error.response?.data?.message  || "Failed to create requirement.",
      );
      console.log(error.response);
      
      toast.error(error.response?.data.errors[0]?.msg)
    }
  };

  if (loading) return <Loader />;

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
        bg-[var(--theme-bg)]
        text-[var(--theme-text)]
        transition-colors
        duration-500
      "
    >
     <PageHeader
  title="New Requirement"
  subtitle="Create a material requirement for your kitchen"
  imageUrl={theme.image}
/>
      <div className="rounded-2xl shadow-sm shadow-purple-300/50 bg-white h-full -translate-y-8 py-6 px-3 mt-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.3 }}
        ></motion.div>

        <RequirementTypeSelector
          value={requirementType}
          onChange={handleRequirementType}
        />

        {/* Items Section */}
        {(requirementType === "RM" ||
          requirementType === "BARTAN" ||
          requirementType === "STATIONERY") && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="mt-6 overflow-hidden rounded-[22px] border border-[#f0eef8] bg-white shadow-[0_4px_20px_rgba(80,50,150,0.06)]"
          >
            {/* ================= HEADER ================= */}
            <div
              className="
    flex
    h-[60px]
    items-center
    justify-between
    border-b
    border-[#eeeeee]
    px-3

    sm:h-[68px]
    sm:px-5
  "
            >
              {/* ================= LEFT ================= */}
              <div className="flex min-w-0 items-center gap-2.5">
                {/* Shopping Bag */}
                <div
  className="
    flex
    h-[34px]
    w-[34px]
    shrink-0
    items-center
    justify-center
    rounded-lg
    bg-[var(--theme-primary-light)]
    sm:h-[40px]
    sm:w-[40px]
    sm:rounded-xl
  "
>
  <FiShoppingBag
    className="
      text-[19px]
      text-[var(--theme-primary)]
      sm:text-[22px]
    "
  />
</div>

                {/* Title */}
                <h3
  className="
    truncate
    text-[15px]
    font-bold
    tracking-[-0.2px]
    text-[var(--theme-text)]
    sm:text-[18px]
  "
>
  Your Items
</h3>
              </div>

              {/* ================= RIGHT ================= */}
              <div className="flex shrink-0 items-center gap-2">
                {/* Item Count */}
                <div
  className="
    flex
    h-[34px]
    min-w-[68px]
    items-center
    justify-center
    rounded-lg
    bg-[var(--theme-primary-light)]
    px-2
    sm:h-[40px]
    sm:min-w-[90px]
    sm:rounded-xl
    sm:px-3
  "
>
  <span
    className="
      text-[11px]
      font-bold
      text-[var(--theme-primary)]
      sm:text-[14px]
    "
  >
    {selectedItems.length}{" "}
    {selectedItems.length === 1 ? "Item" : "Items"}
  </span>
</div>

                {/* Add / Browse Items */}
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  aria-label="Add item"
                  className="
        flex
        h-[34px]
        w-[38px]
        items-center
        justify-center
        rounded-lg
        border
        border-[#ece9f7]
        bg-white
        text-[#6135db]
        transition
        hover:bg-[#f8f5ff]
        active:scale-95

        sm:h-[40px]
        sm:w-[48px]
        sm:rounded-xl
      "
                >
                  <FiSliders
                    className="text-[18px] sm:text-[21px]"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

              {/* ================= ADD ANOTHER ITEM ================= */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="
    mb-3
    mt-3
    flex
    h-16
    w-full
    items-center
    justify-center
    gap-3
    rounded-xl
    border
    border-dashed
    border-[#a98cff]
    bg-white
    px-3
    transition
    hover:bg-[#faf8ff]
    active:scale-[0.99]

    sm:mb-5
    sm:mt-5
    sm:h-[78px]
    sm:gap-4
    sm:rounded-[16px]
  "
              >
                {/* Purple Plus Circle */}
                <div
  className="
    flex
    h-[40px]
    w-[40px]
    shrink-0
    items-center
    justify-center
    rounded-full
    bg-[var(--theme-primary)]
    shadow-[0_4px_12px_rgba(0,0,0,0.15)]
    sm:h-[48px]
    sm:w-[48px]
  "
>
  <FiPlus
    className="text-[22px] text-white sm:text-[26px]"
  />
</div>

                {/* Text */}
                <div className="text-left">
                  <h4
  className="
    text-[13px]
    font-bold
    leading-tight
    text-[var(--theme-primary)]
    sm:text-[16px]
  "
>
  Add Another Item
</h4>

                  <p
                    className="
                    mt-0.5
                    text-[10px]
                    leading-tight
                    text-[#69738b]

                    sm:text-[12px]
                  "
                  >
                    Browse more items to add
                  </p>
                </div>
              </button>
            {/* ================= ITEM LIST ================= */}
            <div className="px-2">
              {!selectedItems.length ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-1 text-center"
                >
                  <h3 className="mt-4 text-lg font-semibold text-gray-700">
                    No Items Selected
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Click "Add Another Item" to begin creating your requirement.
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {selectedItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                      className={
                        index !== selectedItems.length - 1
                          ? "border-b border-[#eeeeee]"
                          : ""
                      }
                    >
                      <ItemCard
                        item={item}
                        onQuantityChange={(qty) =>
                          updateQuantity(item._id, qty)
                        }
                        onRemove={() => removeItem(item._id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}


            </div>
          </motion.div>
        )}

        {/* Remarks */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="
    mt-3
    rounded-xl
    border
    border-dashed
    border-[var(--theme-border)]
    bg-[var(--theme-surface)]
    p-3
    shadow-[0_3px_12px_rgba(80,50,150,0.04)]

    sm:mt-5
    sm:rounded-2xl
    sm:p-4
  "
        >
          {/* ================= HEADER ================= */}
          <div className="mb-0.5 flex items-center justify-between">
            <label
              className="
        text-[10px]
        font-bold
        text-[#17213b]

        sm:text-[15px]
      "
            >
              Remarks
            </label>

            <span className="text-[9px] font-medium text-gray-400 sm:text-[10px]">
              Optional
            </span>
          </div>

          {/* ================= TEXTAREA ================= */}
          <textarea
            rows={2}
            maxLength={250}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Write additional instructions..."
            className="
    h-14.5
    w-full
    resize-none
    rounded-lg
    border
    border-(--theme-border)
    bg-(--theme-surface-alt)
    px-3
    py-2.5
    text-[12px]
    text-(--theme-text)
    outline-none
    placeholder:text-(--theme-text-secondary)
    focus:border-(--theme-primary)
    focus:bg-(--theme-surface)
    focus:ring-2
    focus:ring-(--theme-primary)/10

    sm:h-17.5
    sm:px-4
    sm:py-3
    sm:text-[13px]
  "
          />

          {/* Character Count */}
          <div className=" flex justify-end">
            <span className="text-[9px] font-medium text-gray-400 sm:text-[10px]">
              {remarks.length}/250
            </span>
          </div>
        </motion.div>

{/* ================= REVIEW & SUBMIT ================= */}
<motion.div
  variants={fadeUp}
  initial="hidden"
  animate="show"
  transition={{ delay: 0.3 }}
  className="
    mt-3
    w-full
    rounded-xl
    bg-[var(--theme-header)]
    p-1.5
    shadow-[0_4px_14px_rgba(0,0,0,0.16)]

    sm:mt-5
    sm:rounded-[20px]
    sm:p-3
  "
>
  <div
    className="
      flex
      items-center
      gap-1.5
      sm:gap-4
    "
  >

    {/* ================= TOTAL ITEMS ================= */}
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

      {/* Icon */}
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[var(--theme-surface)]

          sm:h-[54px]
          sm:w-[54px]
        "
      >
        <FiShoppingBag
          className="
            text-[16px]
            text-[var(--theme-primary)]

            sm:text-[27px]
          "
        />
      </div>

      {/* Text */}
      <div>
        <p
          className="
            whitespace-nowrap
            text-[7px]
            font-medium
            leading-none
            text-white

            sm:text-[12px]
          "
        >
          Total Items
        </p>

        <p
          className="
            mt-0.5
            text-[16px]
            font-bold
            leading-none
            text-[var(--theme-primary-light)]

            sm:text-[27px]
          "
        >
          {selectedItems.length}
        </p>
      </div>
    </div>


    {/* ================= DIVIDER ================= */}
    <div
      className="
        h-8
        w-px
        shrink-0
        bg-white/20

        sm:h-[52px]
      "
    />


    {/* ================= ESTIMATED QTY ================= */}
    <div className="min-w-0 shrink-0">

      <p
        className="
          whitespace-nowrap
          text-[7px]
          font-medium
          leading-none
          text-white

          sm:text-[12px]
        "
      >
        Estimated Qty
      </p>

      <p
        className="
          mt-0.5
          whitespace-nowrap
          text-[15px]
          font-bold
          leading-none
          text-[var(--theme-primary-light)]

          sm:text-[26px]
        "
      >
        {selectedItems.reduce(
          (total, item) =>
            total + Number(item.quantity || 0),
          0
        )}

        <span className="text-[9px] sm:text-[18px]">
          Kg
        </span>
      </p>
    </div>


    {/* ================= DIVIDER ================= */}
    <div
      className="
        h-8
        w-px
        shrink-0
        bg-white/20

        sm:h-[52px]
      "
    />


    {/* ================= REVIEW BUTTON ================= */}
    <button
      type="button"
      onClick={handleSubmit}
      disabled={!selectedItems.length || isLoading}
      className="
        flex
        h-9
        min-w-0
        flex-1
        items-center
        gap-1.5
        overflow-hidden
        rounded-full
        bg-[var(--theme-primary)]
        px-1.5
        text-left
        transition-all
        duration-300

        active:scale-[0.98]

        disabled:cursor-not-allowed
        disabled:opacity-50

        sm:min-h-[68px]
        sm:h-auto
        sm:gap-3
        sm:px-3
      "
    >

      {/* Arrow */}
      <div
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[var(--theme-primary-dark)]

          sm:h-[48px]
          sm:w-[48px]
        "
      >
        <FiArrowRight
          className="
            text-[14px]
            text-white

            sm:text-[24px]
          "
        />
      </div>


      {/* Button Text */}
      <div className="min-w-0">

        <p
          className="
            truncate
            text-[9px]
            font-bold
            leading-none
            text-white

            sm:text-[18px]
          "
        >
          {isLoading
            ? "Submitting..."
            : "Review & Submit"}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[6px]
            leading-none
            text-white/90

            sm:text-[11px]
          "
        >
          We will review and confirm
        </p>

      </div>
    </button>

  </div>
</motion.div>

        <ItemSelectorModal
          open={showModal}
          onClose={() => setShowModal(false)}
          items={inventory}
          selectedItems={selectedItems}
          onSelect={addItem}
        />
      </div>
      </div>
    </DashboardLayout>
  );
};

export default NewRequirement;
