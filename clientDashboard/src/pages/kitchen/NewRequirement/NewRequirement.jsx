import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiPackage } from "react-icons/fi";

import DashboardLayout from "../../../layouts/DashboardLayout";

import PageHeader from "../../../components/shared/ui/PageHeader";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";

import KitchenInfo from "../../../components/kitchen/requirement/KitchenInfo";
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
  const [isLoading , setIsLoading] = useState(false);
  const [requirementType, setRequirementType] = useState("");

  useEffect(() => {
    fetchLatestKitchenRequirement();
  }, []);
  const handleRequirementType = async (type)=>{
    setRequirementType(type);
    if (type === "RM") {
      fetchInventory();
    }
  }
  const fetchLatestKitchenRequirement = async () => {
    try {
      const latestRequirement = await getLatestKitchenRequirement();

      setActiveRequirement(latestRequirement);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
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
      toast.error('Please select at least one item.')
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
      toast.error(error.response?.data?.message || "Failed to create requirement.")
      // alert(error.response?.data?.message || "Failed to create requirement.");
    }
  };

  if (loading) return <Loader />;

  if (activeRequirement) {

    return (

        <DashboardLayout>

            <PageHeader
                title="New Requirement"
                subtitle="Create material requirement"
            />

            <Card>

                <h2 className="text-lg font-semibold">

                    You already have an active requirement.

                </h2>

                <p className="text-gray-600 mt-2">

                    Requirement Number: {activeRequirement.requirementNumber}

                </p>

                <p className="text-gray-600">

                    Status: {activeRequirement.status}

                </p>

                <Button
                    className="mt-5"
                    onClick={() =>
                        navigate(`/track`)
                    }
                >
                    Track Requirement
                </Button>

            </Card>

        </DashboardLayout>

    );

}

  return (
    <DashboardLayout>
      <PageHeader
        title="New Requirement"
        subtitle="Create a material requirement for your kitchen"
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.3 }}
      >
        <KitchenInfo />
      </motion.div>
      
    <RequirementTypeSelector
        value={requirementType}
        onChange={handleRequirementType}
      />
      {/* Items Toolbar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
        className="mt-6 rounded-xl border bg-white shadow-sm p-4 flex items-center justify-between"
      >
        <div>
          <h3 className="font-semibold text-gray-800">Required Items</h3>

          <p className="text-sm text-gray-500">
            {selectedItems.length} item
            {selectedItems.length !== 1 && "s"} selected
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FiPlus />
          Add Item
        </Button>
      </motion.div>

      {/* Item List */}
      <div className="mt-5 space-y-3">
        {!selectedItems.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-14 text-center"
          >
            <FiPackage className="mx-auto text-5xl text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No Items Selected
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Click "Add Item" to begin creating your requirement.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {selectedItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <ItemCard
                  item={item}
                  onQuantityChange={(qty) => updateQuantity(item._id, qty)}
                  onRemove={() => removeItem(item._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Remarks */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        className="mt-6 rounded-xl border bg-white shadow-sm p-5"
      >
        <label className="block mb-2 font-semibold text-gray-800">
          Remarks
        </label>

        <textarea
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Write additional instructions (optional)..."
          className="w-full rounded-lg border border-gray-200 p-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none resize-none"
        />
      </motion.div>

      {/* Sticky Footer */}
      <div className="sticky bottom-4 mt-8">
        <div className="rounded-2xl bg-white border shadow-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Selected Items</p>

            <p className="text-2xl font-bold text-teal-600 ">
              {selectedItems.length}
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedItems.length || isLoading}
            className={`px-8  ${!selectedItems.length || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isLoading ? "submitting..." : "Submit Requirement"}
          </Button>
        </div>
      </div>

      <ItemSelectorModal
        open={showModal}
        onClose={() => setShowModal(false)}
        items={inventory}
        selectedItems={selectedItems}
        onSelect={addItem}
      />
    </DashboardLayout>
  );
};

export default NewRequirement;
