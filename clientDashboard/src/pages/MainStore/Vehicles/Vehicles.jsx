import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  MdAdd,
  MdEdit,
  MdSearch,
  MdLocalShipping,
} from "react-icons/md";
import { FaTruckMoving } from "react-icons/fa";
import Loader from "../../../components/shared/ui/Loader";
import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
} from "../../../services/vehicle.service";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState(null);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleName: "",
    capacity: "",
    remarks: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();

      setVehicles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) =>
      vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [vehicles, search]);

  const openAddModal = () => {
    setEditingVehicle(null);

    setForm({
      vehicleNumber: "",
      vehicleName: "",
      capacity: "",
      remarks: "",
    });

    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);

    setForm({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleName: vehicle.vehicleName,
      capacity: vehicle.capacity,
      remarks: vehicle.remarks,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!form.vehicleNumber || !form.vehicleName) {
      alert("Please fill required fields");

      return;
    }

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, payload);
      } else {
        await createVehicle(payload);
      }

      await fetchVehicles();

      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const activeVehicles = vehicles.filter((v) => v.isActive).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicles</h1>

          <p className="text-gray-500">Manage delivery vehicles</p>
        </div>

        <Button onClick={openAddModal} className="flex items-center gap-2">
          <MdAdd size={20} />

          <span className="hidden sm:block">Add Vehicle</span>
        </Button>
      </motion.div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <FaTruckMoving size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>

              <h2 className="text-xl font-bold">{vehicles.length}</h2>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <MdLocalShipping size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Available</p>

              <h2 className="text-xl font-bold">{activeVehicles}</h2>
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
          placeholder="Search vehicle number..."
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

      {/* Vehicle List */}

      <div className="space-y-4">
        <AnimatePresence>
          {filteredVehicles.map((vehicle) => (
            <motion.div
              key={vehicle._id}
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
                w-16 h-16
                rounded-xl
                bg-blue-100
                flex items-center justify-center
              "
                    >
                      <FaTruckMoving size={34} className="text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold">
                        {vehicle.vehicleNumber}
                      </h2>

                      <p className="text-gray-500">{vehicle.vehicleName}</p>

                      <p className="text-sm mt-1">
                        Capacity :
                        <span className="font-semibold">
                          {" "}
                          {vehicle.capacity} Ton
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => openEditModal(vehicle)}
                      className="
                text-gray-500
                hover:text-teal-600
                "
                    >
                      <MdEdit size={22} />
                    </button>

                    <div className="mt-4">
                      <span
                        className={`
              px-3 py-1
              rounded-full
              text-xs
              font-semibold

              ${
                vehicle.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }

              `}
                      >
                        {vehicle.isActive ? "Available" : "Inactive"}
                      </span>
                    </div>
                  </div>
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
                {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
              </h2>

              {[
                ["vehicleNumber", "Vehicle Number"],
                ["vehicleName", "Vehicle Name"],
                ["capacity", "Capacity"],
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

export default Vehicles;
