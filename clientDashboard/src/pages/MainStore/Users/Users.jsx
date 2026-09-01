import { useEffect, useMemo, useState } from "react";
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

import {
  getUsers,
  createUser,
  updateUser,
} from "../../../services/user.service";

import { getKitchens } from "../../../services/kitchen.service";
import Loader from "../../../components/shared/ui/Loader";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import DISTRICTS from "../../../constants/districts.js"
import ThemeProvider from "../../../components/shared/ui/ThemeProvider.jsx";
import PageHeader from "../../../components/shared/ui/PageHeader.jsx";
import { themes } from "../../../components/shared/ui/Theme.js";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [kitchens, setKitchens] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, kitchensResponse] = await Promise.all([
        getUsers(),

        getKitchens(),
      ]);

      setUsers(usersResponse);

      setKitchens(kitchensResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: "Kitchen Incharge",
    district:[],
    kitchenId: "",
    language: "en",
    status: "Active",
  });

  const roles = [
    "Kitchen Incharge",
    "Store Incharge",
    "Store Supervisor",
    "district coordinator",
    "Admin",
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search),
    );
  }, [users, search]);

  const openAddModal = () => {
    setEditingUser(null);

    setForm({
      name: "",
      phone: "",
      password: "",
      district:[],
      role: "Kitchen Incharge",
      kitchenId: "",
      language: "en",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      phone: user.phone,
      password: "",
      district:user?.district,
      role: user.role,
      kitchenId: user.kitchenId?._id || "",
      language: user.language,
      status: user.isActive ? "Active" : "Inactive",
    });

    setShowModal(true);
  };
console.log(DISTRICTS.map((district) => district.name));

  const handleChange = (e) => {
  const { name, value, options, multiple } = e.target;

  console.log(name, value);

  // Handle role change
  if (
    name === "role" &&
    (
      value === "Store Supervisor" ||
      value === "Admin" ||
      value === "district coordinator"
    )
  ) {
    setForm((prev) => ({
      ...prev,
      role: value,
      kitchenId: "",
      district: value === "district coordinator" ? prev.district : [],
    }));

    return;
  }

  // Handle multiple district select
  if (name === "district" && multiple) {
    const selectedDistricts = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setForm((prev) => ({
      ...prev,
      district: selectedDistricts,
    }));

    return;
  }

  // Handle normal inputs
  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  const handleSave = async () => {
    setIsSaving(true)
    if (!form.name || !form.phone || (!editingUser && !form.password)) {
      toast.error("Please fill all required fields.")
      return;
      setIsSaving(false)
    }

    if (
      ["Kitchen Incharge", "Store Incharge"].includes(form.role) &&
      !form.kitchenId
    ) {
      toast("Please select a kitchen.", {
  icon: "⚠️",
  style: {
    border: "1px solid #f59e0b",
    padding: "16px",
    color: "#92400e",
    background: "#fffbeb",
  },
});
      // alert();
      setIsSaving(false)
      return;
    }

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        role: form.role,
        language: form.language,
        isActive: form.status === "Active",
      };
     
      if (["Kitchen Incharge", "Store Incharge"].includes(form.role)) {
        payload.kitchenId = form.kitchenId;
      }

      if(form.role === "district coordinator"){
        payload.district = form.district
      }
     
      if (form.password) {
        payload.password = form.password;
      }
      console.log(payload);
      setIsSaving(false);
      
      if (editingUser ) {
        await updateUser(
          editingUser._id,
          payload,
        );
      } else {
        await createUser(payload);
      }
      toast.success("user added")
      await fetchData();
      setIsSaving(false)
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.")
      // alert();
    }
  };

  const getKitchenName = (kitchenId) => {
    const kitchen = kitchens.find((item) => item._id === kitchenId);

    return kitchen?.name || "-";
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="space-y-5 pb-10">
      <ThemeProvider
      theme={themes.USERS}
      className="min-h-full pb-24"
    >
      <PageHeader
            title="Users"
            subtitle="Manage application users"
            imageUrl={'/ui/USERS.png'}
          />
      <div className="flex justify-between items-center pb-1">
        <Button onClick={openAddModal}>
          <MdAdd size={20} />
        </Button>
      </div>

      <div className="relative py-1">
        <MdSearch className="absolute left-3 top-3.5 text-gray-400" size={20} />

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user._id}>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <MdPerson size={34} className="text-indigo-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>

                  <p className="text-gray-500">{user.role}</p>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <MdPhone />

                    {user.phone}
                  </div>

                  {(user.role === "Kitchen Incharge" ||
                    user.role === "Store Incharge") && (
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <HiOutlineBuildingStorefront />

                      {user.kitchenId?.name || "-"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button onClick={() => openEditModal(user)}>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 ">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
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

            <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border rounded-xl p-3 pr-12 outline-none"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
    </div>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
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
                <option value="">Select Kitchen</option>

                {kitchens.map((kitchen) => (
                  <option key={kitchen._id} value={kitchen._id}>
                    {kitchen.name}
                  </option>
                ))}
              </select>
            )}
            
            {form.role === "district coordinator"  && (
              <select
                name="district"
                multiple
                value={form.district}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 outline-none"
              >
                <option value="">Select District</option>

                {DISTRICTS.map((district , index) => (
                  <option key={district.value} value={district.value}>
                    {district.name}
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
              <option value="en">English</option>

              <option value="hi">Hindi</option>
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none"
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1" disabled={isSaving} onClick={handleSave}>
                {isSaving ? "Saving...." : "Save"}
              </Button>

              <Button
                className="flex-1 bg-gray-600 text-black hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      </ThemeProvider>
    </div>
  );
};

export default Users;
