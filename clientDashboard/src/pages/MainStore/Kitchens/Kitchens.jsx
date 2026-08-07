import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  MdAdd,
  MdEdit,
  MdSearch,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";
import Loader from "../../../components/shared/ui/Loader";

import {
  getKitchens,
  createKitchen,
  updateKitchen,
} from "../../../services/kitchen.service";

const Kitchens = () => {
  const [kitchens, setKitchens] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingKitchen, setEditingKitchen] = useState(null);

  const [form, setForm] = useState({
    district: "",
    name: "",
    address: "",
    contactPerson: "",
    phone: "",
  });

  useEffect(() => {
    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    try {
      const data = await getKitchens();

      setKitchens(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredKitchens = useMemo(() => {
    return kitchens.filter(
      (kitchen) =>
        kitchen.name.toLowerCase().includes(search.toLowerCase()) ||
        kitchen.district.toLowerCase().includes(search.toLowerCase()),
    );
  }, [kitchens, search]);

  const openAddModal = () => {
    setEditingKitchen(null);

    setForm({
      district: "",
      name: "",
      address: "",
      contactPerson: "",
      phone: "",
    });

    setShowModal(true);
  };

  const openEditModal = (kitchen) => {
    setEditingKitchen(kitchen);

    setForm(kitchen);

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.district || !form.phone) {
      alert("Please fill required fields.");

      return;
    }

    try {
      if (editingKitchen) {
        await updateKitchen(editingKitchen._id, form);
      } else {
        await createKitchen(form);
      }

      await fetchKitchens();

      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kitchens</h1>

          <p className="text-gray-500">Manage kitchen locations</p>
        </div>

        <Button onClick={openAddModal} className="flex items-center gap-2">
          <MdAdd size={20} />

          <span className="hidden sm:block">Add Kitchen</span>
        </Button>
      </motion.div>

      {/* Stats */}

      <Card>
        <div className="flex items-center gap-4">
          <div
            className="
          p-3
          rounded-xl
          bg-orange-100
          text-orange-600
          "
          >
            <HiOutlineBuildingStorefront size={28} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Kitchens</p>

            <h2 className="text-2xl font-bold">{kitchens.length}</h2>
          </div>
        </div>
      </Card>

      {/* Search */}

      <div className="relative">
        <MdSearch
          size={22}
          className="
          absolute
          left-3
          top-3.5
          text-gray-400
          "
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search kitchen or district..."
          className="
          w-full
          rounded-xl
          border
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

      {/* Kitchen Cards */}

      <div className="space-y-4">
        <AnimatePresence>
          {filteredKitchens.map((kitchen) => (
            <motion.div
              key={kitchen._id}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <Card
                className="
            hover:shadow-lg
            transition
            "
              >
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div
                      className="
              w-16
              h-16
              rounded-xl
              bg-orange-100
              flex
              items-center
              justify-center
              "
                    >
                      <HiOutlineBuildingStorefront size={34} className="text-orange-600" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold">{kitchen.name}</h2>

                      <span
                        className="
                inline-block
                mt-1
                rounded-full
                bg-orange-50
                px-3
                py-1
                text-xs
                font-semibold
                text-orange-700
                "
                      >
                        {kitchen.district}
                      </span>

                      <div
                        className="
                flex
                gap-2
                mt-3
                text-sm
                text-gray-600
                "
                      >
                        <MdLocationOn className="text-red-500" />

                        {kitchen.address}
                      </div>

                      <div
                        className="
                flex
                gap-2
                mt-2
                text-sm
                text-gray-600
                "
                      >
                        <MdPhone className="text-green-600" />

                        {kitchen.contactPerson}
                        {" • "}
                        {kitchen.phone}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openEditModal(kitchen)}
                    className="
              text-gray-500
              hover:text-teal-600
              "
                  >
                    <MdEdit size={22} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
        fixed
        inset-0
        bg-black/40
        z-50
        flex
        items-center
        justify-center
        p-4
        "
          >
            <motion.div
              initial={{
                scale: 0.9,
              }}
              animate={{
                scale: 1,
              }}
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
                {editingKitchen ? "Edit Kitchen" : "Add Kitchen"}
              </h2>

              {[
                ["district", "District"],
                ["name", "Kitchen Name"],
                ["address", "Address"],
                ["contactPerson", "Contact Person"],
                ["phone", "Phone Number"],
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="
              w-full
              border
              rounded-xl
              p-3
              "
                />
              ))}

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleSave}>
                  Save
                </Button>

                <Button
                  className="
            flex-1
            bg-gray-200
            text-black
            "
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

export default Kitchens;
