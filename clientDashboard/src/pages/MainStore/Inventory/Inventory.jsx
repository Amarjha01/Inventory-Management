import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAdd,
  MdEdit,
  MdSearch,
  MdWarningAmber,
  MdInventory,
} from "react-icons/md";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";

import {
  getInventory,
  createInventory,
  updateInventory,
} from "../../../services/inventory.service";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    hindiName: "",
    quantity: "",
    minimumStock: "",
    unit: "",
    image: "",
  });

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

  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.hindiName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [inventory, search]);

  const openAddModal = () => {
    setEditingItem(null);

    setForm({
      name: "",
      hindiName: "",
      quantity: "",
      minimumStock: "",
      unit: "",
      image: "",
    });

    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);

    setForm({
      name: item.name,
      hindiName: item.hindiName,
      quantity: item.quantity,
      minimumStock: item.minimumStock,
      unit: item.unit,
      image: item.image,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.unit) {
      alert("Please fill required fields.");
      return;
    }

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        minimumStock: Number(form.minimumStock),
      };

      if (editingItem) {
        await updateInventory(editingItem._id, payload);
      } else {
        await createInventory(payload);
      }

      await fetchInventory();

      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const totalItems = inventory.length;

  const lowStockCount = inventory.filter(
    (item) => Number(item.quantity) <= Number(item.minimumStock),
  ).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>

          <p className="text-gray-500">Manage warehouse stock</p>
        </div>

        <Button onClick={openAddModal} className="flex items-center gap-2">
          <MdAdd size={20} />
          <span className="hidden sm:block">Add Item</span>
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
              <MdInventory size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Items</p>

              <h2 className="text-xl font-bold">{totalItems}</h2>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <MdWarningAmber size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Low Stock</p>

              <h2 className="text-xl font-bold">{lowStockCount}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <MdSearch className="absolute left-3 top-3.5 text-gray-400" size={22} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search inventory..."
          className="
          w-full rounded-xl border
          py-3 pl-10 pr-4
          outline-none
          focus:border-teal-500
          focus:ring-4
          focus:ring-teal-500/10
          "
        />
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredInventory.map((item) => {
            const lowStock = Number(item.quantity) <= Number(item.minimumStock);

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card
                  className="
            hover:shadow-lg
            transition
            "
                >
                  <div className="flex gap-4">
                    <img
                      src={`/items/${item.image}`}
                      alt={item.name}
                      className="
              w-20 h-20
              rounded-xl
              object-cover
              border
              bg-gray-100
              "
                    />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="font-bold text-lg">{item.name}</h2>

                          <p className="text-gray-500">{item.hindiName}</p>
                        </div>

                        <button
                          onClick={() => openEditModal(item)}
                          className="text-gray-500 hover:text-teal-600"
                        >
                          <MdEdit size={22} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Current Stock</p>

                          <p className="font-semibold">
                            {item.quantity} {item.unit}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Minimum</p>

                          <p className="font-semibold">
                            {item.minimumStock} {item.unit}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        {lowStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                            <MdWarningAmber />
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                            Healthy Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
          fixed inset-0
          bg-black/40
          z-50
          flex
          items-center
          justify-center
          p-4
          "
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="
          bg-white
          rounded-2xl
          p-5
          w-full
          max-w-md
          space-y-4
          "
            >
              <h2 className="text-xl font-bold">
                {editingItem ? "Edit Item" : "Add Item"}
              </h2>

              {[
                ["name", "Item Name"],
                ["hindiName", "Hindi Name"],
                ["quantity", "Quantity"],
                ["minimumStock", "Minimum Stock"],
                ["unit", "Unit"],
                ["image", "Image Name"],
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-xl border p-3"
                />
              ))}

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleSave}>
                  Save
                </Button>

                <Button
                  className="flex-1 bg-gray-200 text-black"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
