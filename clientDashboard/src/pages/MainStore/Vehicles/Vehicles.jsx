import { useMemo, useState } from "react";

import {
  MdAdd,
  MdDirectionsCar,
  MdEdit,
  MdSearch,
} from "react-icons/md";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import vehicleData from "../../../mock/vehicles";

const Vehicles = () => {

  const [vehicles, setVehicles] = useState(vehicleData);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState(null);

  const [form, setForm] = useState({
    number: "",
    type: "",
    capacity: "",
    status: "Available",
  });

  const filteredVehicles = useMemo(() => {

    return vehicles.filter(vehicle =>

      vehicle.number
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  }, [vehicles, search]);

  const openAddModal = () => {

    setEditingVehicle(null);

    setForm({
      number: "",
      type: "",
      capacity: "",
      status: "Available",
    });

    setShowModal(true);

  };

  const openEditModal = (vehicle) => {

    setEditingVehicle(vehicle);

    setForm(vehicle);

    setShowModal(true);

  };

  const handleChange = (e) => {

    setForm(prev => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };

  const handleSave = () => {

    if (!form.number || !form.type) {

      alert("Please fill all required fields.");

      return;

    }

    if (editingVehicle) {

      setVehicles(prev =>

        prev.map(vehicle =>

          vehicle.id === editingVehicle.id

            ? {

                ...form,

                id: editingVehicle.id,

              }

            : vehicle

        )

      );

    } else {

      setVehicles(prev => [

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

            Vehicles

          </h1>

          <p className="text-gray-500">

            Manage delivery vehicles

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
          placeholder="Search vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none"
        />

      </div>

      <div className="space-y-4">

        {

          filteredVehicles.map(vehicle => (

            <Card key={vehicle.id}>

              <div className="flex justify-between">

                <div className="flex gap-4">

                  <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">

                    <MdDirectionsCar
                      size={34}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <h2 className="font-semibold text-lg">

                      {vehicle.number}

                    </h2>

                    <p className="text-gray-500">

                      {vehicle.type}

                    </p>

                    <p className="text-sm mt-1">

                      Capacity : {vehicle.capacity}

                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <button
                    onClick={() => openEditModal(vehicle)}
                  >

                    <MdEdit size={22} />

                  </button>

                  <span
                    className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >

                    {vehicle.status}

                  </span>

                </div>

              </div>

            </Card>

          ))

        }

      </div>

      {

        showModal && (

          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

            <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4">

              <h2 className="text-xl font-semibold">

                {

                  editingVehicle

                    ? "Edit Vehicle"

                    : "Add Vehicle"

                }

              </h2>

              <input
                name="number"
                placeholder="Vehicle Number"
                value={form.number}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                name="type"
                placeholder="Vehicle Type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                name="capacity"
                placeholder="Capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >

                <option>

                  Available

                </option>

                <option>

                  Out For Delivery

                </option>

              </select>

              <div className="flex gap-3">

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

export default Vehicles;