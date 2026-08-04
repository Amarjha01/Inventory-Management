import { useMemo, useState } from "react";
import {
  MdAdd,
  MdEdit,
  MdPerson,
  MdSearch,
  MdPhone,
  MdBusiness,
} from "react-icons/md";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import usersData from "../../../mock/users";
import kitchens from "../../../mock/kitchens";

const Users = () => {

  const [users, setUsers] = useState(usersData);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({

    name: "",

    phone: "",

    password: "",

    role: "Kitchen Incharge",

    kitchenId: "",

    language: "en",

    status: "Active"

  });

  const roles = [

    "Kitchen Incharge",

    "Store Incharge",

    "Store Supervisor",

    "Admin"

  ];

  const filteredUsers = useMemo(() => {

    return users.filter(user =>

      user.name.toLowerCase().includes(search.toLowerCase()) ||

      user.phone.includes(search)

    );

  }, [users, search]);

  const openAddModal = () => {

    setEditingUser(null);

    setForm({

      name: "",

      phone: "",

      password: "",

      role: "Kitchen Incharge",

      kitchenId: "",

      language: "en",

      status: "Active"

    });

    setShowModal(true);

  };

  const openEditModal = (user) => {

    setEditingUser(user);

    setForm(user);

    setShowModal(true);

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (

      name === "role" &&

      (value === "Store Supervisor" ||

        value === "Admin")

    ) {

      setForm(prev => ({

        ...prev,

        role: value,

        kitchenId: ""

      }));

      return;

    }

    setForm(prev => ({

      ...prev,

      [name]: value

    }));

  };

  const handleSave = () => {

    if (

      !form.name ||

      !form.phone ||

      !form.password

    ) {

      alert("Please fill all required fields.");

      return;

    }

    if (

      (form.role === "Kitchen Incharge" ||

        form.role === "Store Incharge") &&

      !form.kitchenId

    ) {

      alert("Please select kitchen.");

      return;

    }

    if (editingUser) {

      setUsers(prev =>

        prev.map(user =>

          user.id === editingUser.id

            ? {

                ...form,

                id: editingUser.id

              }

            : user

        )

      );

    } else {

      setUsers(prev => [

        ...prev,

        {

          ...form,

          id: Date.now()

        }

      ]);

    }

    setShowModal(false);

  };

  const getKitchenName = (kitchenId) => {

    const kitchen = kitchens.find(

      item => item.id === Number(kitchenId)

    );

    return kitchen ? kitchen.name : "-";

  };

  return (

    <div className="space-y-5 pb-10">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold">

            Users

          </h1>

          <p className="text-gray-500">

            Manage application users

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
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none"
        />

      </div>

      <div className="space-y-4">

        {filteredUsers.map(user => (

          <Card key={user.id}>

            <div className="flex justify-between">

              <div className="flex gap-4">

                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <MdPerson
                    size={34}
                    className="text-indigo-600"
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-lg">

                    {user.name}

                  </h2>

                  <p className="text-gray-500">

                    {user.role}

                  </p>

                  <div className="flex items-center gap-2 mt-2 text-sm">

                    <MdPhone />

                    {user.phone}

                  </div>

                  {(user.role === "Kitchen Incharge" ||

                    user.role === "Store Incharge") && (

                    <div className="flex items-center gap-2 mt-2 text-sm">

                      <MdBusiness />

                      {getKitchenName(user.kitchenId)}

                    </div>

                  )}

                </div>

              </div>

              <div className="flex flex-col items-end justify-between">

                <button
                  onClick={() =>
                    openEditModal(user)
                  }
                >

                  <MdEdit size={22} />

                </button>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {user.status}

                </span>

              </div>

            </div>

          </Card>

        ))}

      </div>

      {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-semibold">

              {editingUser ? "Edit User" : "Add User"}

            </h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            >

              {roles.map(role => (

                <option
                  key={role}
                  value={role}
                >

                  {role}

                </option>

              ))}

            </select>

            {(form.role === "Kitchen Incharge" ||

              form.role === "Store Incharge") && (

              <select
                name="kitchenId"
                value={form.kitchenId}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 outline-none"
              >

                <option value="">

                  Select Kitchen

                </option>

                {kitchens.map(kitchen => (

                  <option
                    key={kitchen.id}
                    value={kitchen.id}
                  >

                    {kitchen.name}

                  </option>

                ))}

              </select>

            )}

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            >

              <option value="en">

                English

              </option>

              <option value="hi">

                Hindi

              </option>

            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            >

              <option value="Active">

                Active

              </option>

              <option value="Inactive">

                Inactive

              </option>

            </select>

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

      )}

    </div>

  );

};

export default Users;