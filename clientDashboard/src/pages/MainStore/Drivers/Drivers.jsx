import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { MdAdd, MdEdit, MdPerson, MdSearch, MdBadge } from "react-icons/md";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import driverData from "../../../mock/drivers";

const Drivers = () => {
  const [drivers, setDrivers] = useState(driverData);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingDriver, setEditingDriver] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
  });

  const filteredDrivers = useMemo(() => {
    return drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.phone.includes(search),
    );
  }, [drivers, search]);

  const openAddModal = () => {
    setEditingDriver(null);

    setForm({
      name: "",
      phone: "",
      licenseNumber: "",
    });

    setShowModal(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);

    setForm(driver);

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.phone) {
      alert("Please fill required fields.");

      return;
    }

    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === editingDriver.id
            ? {
                ...form,
                id: editingDriver.id,
              }
            : driver,
        ),
      );
    } else {
      setDrivers((prev) => [
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
          <h1 className="text-2xl font-bold text-gray-800">Drivers</h1>

          <p className="text-gray-500">Manage delivery drivers</p>
        </div>

        <Button onClick={openAddModal} className="flex items-center gap-2">
          <MdAdd size={20} />

          <span className="hidden sm:block">Add Driver</span>
        </Button>
      </motion.div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div
              className="
              p-3
              rounded-xl
              bg-green-100
              text-green-600
            "
            >
              <MdPerson size={26} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Drivers</p>

              <h2 className="text-xl font-bold">{drivers.length}</h2>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div
              className="
              p-3
              rounded-xl
              bg-blue-100
              text-blue-600
            "
            >
              <MdBadge size={26} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Licensed</p>

              <h2 className="text-xl font-bold">{drivers.length}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}

      <div className="relative">
        <MdSearch
          className="
          absolute
          left-3
          top-3.5
          text-gray-400
          "
          size={22}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search driver..."
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

      {/* Driver List */}

      <div className="space-y-4">
        <AnimatePresence>
          {filteredDrivers.map((driver) => (
            <motion.div
              key={driver.id}
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
                bg-green-100
                flex
                items-center
                justify-center
              "
                    >
                      <MdPerson size={34} className="text-green-600" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold">{driver.name}</h2>

                      <p className="text-gray-500">{driver.phone}</p>

                      <span
                        className="
                  inline-block
                  mt-2
                  rounded-full
                  bg-blue-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-blue-700
                "
                      >
                        License : {driver.licenseNumber}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openEditModal(driver)}
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
                {editingDriver ? "Edit Driver" : "Add Driver"}
              </h2>

              {[
                ["name", "Driver Name"],
                ["phone", "Phone Number"],
                ["licenseNumber", "License Number"],
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

export default Drivers;
