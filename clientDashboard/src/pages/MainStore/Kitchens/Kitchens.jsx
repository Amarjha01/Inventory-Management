import { useMemo, useState } from "react";

import {
  MdAdd,
  MdEdit,
  MdHome,
  MdSearch,
  MdPhone,
  MdLocationOn
} from "react-icons/md";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import kitchensData from "../../../mock/kitchens";

const Kitchens = () => {

  const [kitchens, setKitchens] = useState(kitchensData);

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

  const filteredKitchens = useMemo(() => {

    return kitchens.filter(kitchen =>

      kitchen.name.toLowerCase().includes(search.toLowerCase()) ||

      kitchen.district.toLowerCase().includes(search.toLowerCase())

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

    setForm(prev => ({

      ...prev,

      [e.target.name]: e.target.value

    }));

  };

  const handleSave = () => {

    if (!form.name || !form.district) {

      alert("Please fill required fields.");

      return;

    }

    if (editingKitchen) {

      setKitchens(prev =>

        prev.map(item =>

          item.id === editingKitchen.id

            ? {

                ...form,

                id: editingKitchen.id

              }

            : item

        )

      );

    } else {

      setKitchens(prev => [

        ...prev,

        {

          ...form,

          id: Date.now()

        }

      ]);

    }

    setShowModal(false);

  };

  return (

    <div className="space-y-5 pb-10">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold">

            Kitchens

          </h1>

          <p className="text-gray-500">

            Manage kitchen locations

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
          placeholder="Search kitchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none"
        />

      </div>

      <div className="space-y-4">

        {

          filteredKitchens.map(kitchen => (

            <Card key={kitchen.id}>

              <div className="flex justify-between">

                <div className="flex gap-4">

                  <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center">

                    <MdHome
                      size={34}
                      className="text-orange-600"
                    />

                  </div>

                  <div>

                    <h2 className="font-semibold text-lg">

                      {kitchen.name}

                    </h2>

                    <p className="text-gray-500">

                      {kitchen.district}

                    </p>

                    <div className="flex items-center gap-2 mt-2 text-sm">

                      <MdLocationOn />

                      {kitchen.address}

                    </div>

                    <div className="flex items-center gap-2 mt-1 text-sm">

                      <MdPhone />

                      {kitchen.contactPerson} • {kitchen.phone}

                    </div>

                  </div>

                </div>

                <button
                  onClick={() => openEditModal(kitchen)}
                >
                  <MdEdit size={22} />
                </button>

              </div>

            </Card>

          ))

        }

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4">

            <h2 className="text-xl font-semibold">
              {editingKitchen ? "Edit Kitchen" : "Add Kitchen"}
            </h2>

            <input
              name="district"
              placeholder="District"
              value={form.district}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

            <input
              name="name"
              placeholder="Kitchen Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

            <input
              name="contactPerson"
              placeholder="Contact Person"
              value={form.contactPerson}
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

      )}

    </div>

  );

};

export default Kitchens;