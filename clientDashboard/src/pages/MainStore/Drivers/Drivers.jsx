import { useMemo, useState } from "react";
import {
  MdAdd,
  MdEdit,
  MdPerson,
  MdSearch,
} from "react-icons/md";

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

    return drivers.filter(driver =>

      driver.name.toLowerCase().includes(search.toLowerCase()) ||

      driver.phone.includes(search)

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

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleSave = () => {

    if (!form.name || !form.phone) {

      alert("Please fill all required fields.");

      return;

    }

    if (editingDriver) {

      setDrivers(prev =>

        prev.map(driver =>

          driver.id === editingDriver.id

            ? {
                ...form,
                id: editingDriver.id,
              }

            : driver

        )

      );

    } else {

      setDrivers(prev => [

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

            Drivers

          </h1>

          <p className="text-gray-500">

            Manage delivery drivers

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
          placeholder="Search Driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none"
        />

      </div>

      <div className="space-y-4">

        {

          filteredDrivers.map(driver => (

            <Card key={driver.id}>

              <div className="flex justify-between">

                <div className="flex gap-4">

                  <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center">

                    <MdPerson
                      size={34}
                      className="text-green-600"
                    />

                  </div>

                  <div>

                    <h2 className="font-semibold text-lg">

                      {driver.name}

                    </h2>

                    <p className="text-gray-500">

                      {driver.phone}

                    </p>

                    <p className="text-sm mt-1">

                      License : {driver.licenseNumber}

                    </p>

                  </div>

                </div>

                <button
                  onClick={() => openEditModal(driver)}
                >

                  <MdEdit size={22} />

                </button>

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

                  editingDriver

                    ? "Edit Driver"

                    : "Add Driver"

                }

              </h2>

              <input
                name="name"
                placeholder="Driver Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                name="licenseNumber"
                placeholder="License Number"
                value={form.licenseNumber}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

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

export default Drivers;