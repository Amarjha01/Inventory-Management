import { useMemo, useState } from "react";
import {
  MdAdd,
  MdEdit,
  MdSearch,
  MdWarningAmber,
} from "react-icons/md";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import inventoryData from "../../../mock/inventory";

const Inventory = () => {

  const [inventory, setInventory] = useState(inventoryData);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    hindiName: "",
    currentStock: "",
    minimumStock: "",
    unit: "",
    image: "",
  });

  const filteredInventory = useMemo(() => {

    return inventory.filter(item =>

      item.name.toLowerCase().includes(search.toLowerCase()) ||

      item.hindiName.toLowerCase().includes(search.toLowerCase())

    );

  }, [inventory, search]);

  const openAddModal = () => {

    setEditingItem(null);

    setForm({
      name: "",
      hindiName: "",
      currentStock: "",
      minimumStock: "",
      unit: "",
      image: "",
    });

    setShowModal(true);

  };

  const openEditModal = (item) => {

    setEditingItem(item);

    setForm(item);

    setShowModal(true);

  };

  const handleChange = (e) => {

    setForm(prev => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };

  const handleSave = () => {

    if (!form.name || !form.unit) {

      alert("Please fill required fields");

      return;

    }

    if (editingItem) {

      setInventory(prev =>

        prev.map(item =>

          item.id === editingItem.id

            ? { ...form, id: editingItem.id }

            : item

        )

      );

    } else {

      setInventory(prev => [

        ...prev,

        {

          ...form,

          id: Date.now(),

        },

      ]);

    }

    setShowModal(false);

  };

  return (

    <div className="space-y-5 pb-10">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold">

            Inventory

          </h1>

          <p className="text-gray-500">

            Manage warehouse stock

          </p>

        </div>

        <Button onClick={openAddModal}>

          <MdAdd size={20} />

        </Button>

      </div>

      <div className="relative">

        <MdSearch
          className="absolute left-3 top-3.5 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search Item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none"
        />

      </div>

      <div className="space-y-4">

        {

          filteredInventory.map(item => {

            const lowStock = Number(item.currentStock) <= Number(item.minimumStock);

            return (

              <Card key={item.id}>

                <div className="flex gap-4">

                  <img
                    src={`/items/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border"
                  />

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <div>

                        <h2 className="font-semibold text-lg">

                          {item.name}

                        </h2>

                        <p className="text-gray-500">

                          {item.hindiName}

                        </p>

                      </div>

                      <button
                        onClick={() => openEditModal(item)}
                      >

                        <MdEdit size={22} />

                      </button>

                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">

                      <div>

                        <p className="text-xs text-gray-500">

                          Current Stock

                        </p>

                        <p className="font-semibold">

                          {item.currentStock} {item.unit}

                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">

                          Minimum Stock

                        </p>

                        <p className="font-semibold">

                          {item.minimumStock} {item.unit}

                        </p>

                      </div>

                    </div>

                    <div className="mt-4">

                      {

                        lowStock ? (

                          <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">

                            <MdWarningAmber />

                            Low Stock

                          </span>

                        ) : (

                          <span className="text-green-600 text-sm font-medium">

                            Healthy Stock

                          </span>

                        )

                      }

                    </div>

                  </div>

                </div>

              </Card>

            );

          })

        }

      </div>

      {

        showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4">

              <h2 className="text-xl font-semibold">

                {

                  editingItem

                    ? "Edit Item"

                    : "Add Item"

                }

              </h2>

              <input
                name="name"
                placeholder="Item Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                name="hindiName"
                placeholder="Hindi Name"
                value={form.hindiName}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                name="currentStock"
                placeholder="Current Stock"
                value={form.currentStock}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                name="minimumStock"
                placeholder="Minimum Stock"
                value={form.minimumStock}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                name="unit"
                placeholder="Unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                name="image"
                placeholder="Image Name (rice.avif)"
                value={form.image}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <div className="flex gap-3 pt-2">

                <Button
                  className="flex-1"
                  onClick={handleSave}
                >

                  Save

                </Button>

                <Button
                  className="flex-1 bg-gray-300 text-black hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >

                  Cancel

                </Button>

              </div>

            </div>

          </div>

        )

      }

    </div>

  );

};

export default Inventory;