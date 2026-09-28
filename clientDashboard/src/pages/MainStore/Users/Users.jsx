import { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdEdit,
  MdPerson,
  MdSearch,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";
import {
  HiOutlineBuildingStorefront,
  HiOutlineUsers,
} from "react-icons/hi2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLoader, FiCheckCircle } from "react-icons/fi";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import {
  getUsers,
  createUser,
  updateUser,
} from "../../../services/user.service";

import { getKitchens } from "../../../services/kitchen.service";
import toast from "react-hot-toast";
import DISTRICTS from "../../../constants/districts.js";
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

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: "Kitchen Incharge",
    district: [],
    kitchenId: "",
    language: "en",
    status: "Active",
  });

  const roles = [
    "Kitchen Incharge",
    "Store Incharge",
    "Store Supervisor",
    "district coordinator",
    "Chief Coordinator",
    "Admin",
    "Driver",
  ];

  // ==================================================
  // FETCH DATA
  // ==================================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersResponse, kitchensResponse] = await Promise.all([
        getUsers(),
        getKitchens(),
      ]);

      setUsers(usersResponse || []);
      setKitchens(kitchensResponse || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FILTER
  // ==================================================

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.phone?.includes(search) ||
        user.role?.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  // ==================================================
  // MODAL
  // ==================================================

  const openAddModal = () => {
    setEditingUser(null);
    setShowPassword(false);

    setForm({
      name: "",
      phone: "",
      password: "",
      district: [],
      role: "Kitchen Incharge",
      kitchenId: "",
      language: "en",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setShowPassword(false);

    setForm({
      name: user.name || "",
      phone: user.phone || "",
      password: "",
      district: user?.district || [],
      role: user.role || "Kitchen Incharge",
      kitchenId: user.kitchenId?._id || "",
      language: user.language || "en",
      status: user.isActive ? "Active" : "Inactive",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setShowModal(false);
    setEditingUser(null);
    setShowPassword(false);
  };

  // ==================================================
  // FORM
  // ==================================================

  const handleChange = (e) => {
    const { name, value, options, multiple } = e.target;

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
        district:
          value === "district coordinator"
            ? prev.district
            : [],
      }));

      return;
    }

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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // SAVE
  // ==================================================

  const handleSave = async () => {
    if (isSaving) return;

    if (!form.name || !form.phone || (!editingUser && !form.password)) {
      toast.error("Please fill all required fields.");
      return;
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

      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        role: form.role,
        language: form.language,
        isActive: form.status === "Active",
      };

      if (
        ["Kitchen Incharge", "Store Incharge"].includes(form.role)
      ) {
        payload.kitchenId = form.kitchenId;
      }

      if (
        form.role === "district coordinator" ||
        form.role === "Chief Coordinator"
      ) {
        payload.district = form.district;
      }

      if (form.password) {
        payload.password = form.password;
      }

      if (editingUser) {
        await updateUser(editingUser._id, payload);
        toast.success("User updated successfully.");
      } else {
        await createUser(payload);
        toast.success("User created successfully.");
      }

      await fetchData();

      setShowModal(false);
      setEditingUser(null);
      setShowPassword(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==================================================
  // KITCHEN NAME
  // ==================================================

  const getKitchenName = (kitchenId) => {
    const kitchen = kitchens.find(
      (item) => item._id === kitchenId
    );

    return kitchen?.name || "-";
  };

  // ==================================================
  // SKELETON
  // ==================================================

  if (loading) {
    return (
      <ThemeProvider theme={themes.USERS} className="min-h-full pb-24">
        <PageHeader title="Users" subtitle="Manage application users" imageUrl="/ui/USERS.png" />

        <div className="space-y-5 px-4 pb-24 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-28 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-11 w-12 animate-pulse rounded-xl bg-gray-200" />
          </div>

          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <UserSkeleton key={index} />
            ))}
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-20">
      <ThemeProvider theme={themes.USERS} className="min-h-full pb-24">

        <PageHeader
          title="Users"
          subtitle="Manage application users"
          imageUrl="/ui/USERS.png"
        />

        <div className="space-y-5 px-4 pb-24 sm:px-6">

          {/* HEADER */}

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <HiOutlineUsers size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Administration
                  </p>

                  <h1 className="text-lg font-bold text-gray-900">
                    Team Members
                  </h1>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {users.length} registered user{users.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              <MdAdd size={21} />
              <span className="hidden sm:inline">
                Add User
              </span>
            </button>
          </div>

          {/* SEARCH */}

          <div className="relative">
            <MdSearch size={21} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search by name, phone or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* RESULT HEADER */}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Users
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Manage access and assignments
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
              {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* USER LIST */}

          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
                >
                  <div className="p-4">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <MdPerson size={27} />

                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${user.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-gray-900">
                            {user.name}
                          </h3>

                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {user.role}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <MdEdit size={18} />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                          <MdPhone size={15} />
                        </span>

                        <span className="truncate">
                          {user.phone || "-"}
                        </span>
                      </div>

                      {(user.role === "Kitchen Incharge" ||
                        user.role === "Store Incharge") && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                            <HiOutlineBuildingStorefront size={15} />
                          </span>

                          <span className="truncate">
                            {user.kitchenId?.name ||
                              getKitchenName(user.kitchenId?._id) ||
                              "-"}
                          </span>
                        </div>
                      )}

                      {(user.role === "district coordinator" ||
                        user.role === "Chief Coordinator") &&
                        user.district?.length > 0 && (
                          <div className="flex items-start gap-2 text-xs text-gray-500">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                              <MdLocationOn size={15} />
                            </span>

                            <span className="line-clamp-2">
                              {user.district.join(", ")}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-4 py-3">

                    <span className="text-[11px] font-medium text-gray-400">
                      {user.language === "hi" ? "Hindi" : "English"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                <MdPerson size={28} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-800">
                No users found
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Try changing your search or add a new user.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-xs font-semibold text-indigo-600"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* MODAL */}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
              <div
                className="w-full max-h-[94vh] max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
                onClick={(e) => e.stopPropagation()}
              >

                {/* MODAL HEADER */}

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                      User Management
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {editingUser ? "Edit User" : "Add User"}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      {editingUser
                        ? "Update account details and access."
                        : "Create a new application user."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSaving}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="text-lg">×</span>
                  </button>
                </div>

                {/* FORM */}

                <div className="space-y-4">

                  <FormField
                    label="Full Name"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />

                  <FormField
                    label="Phone Number"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />

                  {/* PASSWORD */}

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Password {!editingUser && <span className="text-red-500">*</span>}
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                        value={form.password}
                        onChange={handleChange}
                        disabled={isSaving}
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50 disabled:text-gray-400"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={isSaving}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 disabled:opacity-40"
                      >
                        {showPassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ROLE */}

                  <FormSelect
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    disabled={isSaving}
                    options={roles.map((role) => ({
                      value: role,
                      label: role,
                    }))}
                  />

                  {/* KITCHEN */}

                  {(form.role === "Kitchen Incharge" ||
                    form.role === "Store Incharge") && (
                    <FormSelect
                      label="Kitchen"
                      required
                      name="kitchenId"
                      value={form.kitchenId}
                      onChange={handleChange}
                      disabled={isSaving}
                      options={[
                        {
                          value: "",
                          label: "Select Kitchen",
                        },
                        ...kitchens.map((kitchen) => ({
                          value: kitchen._id,
                          label: kitchen.name,
                        })),
                      ]}
                    />
                  )}

                  {/* DISTRICT */}

                  {(form.role === "district coordinator" ||
                    form.role === "Chief Coordinator") && (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Districts
                      </label>

                      <select
                        name="district"
                        multiple
                        value={form.district}
                        onChange={handleChange}
                        disabled={isSaving}
                        className="min-h-[110px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-50"
                      >
                        {DISTRICTS.map((district) => (
                          <option
                            key={district.value}
                            value={district.value}
                            className="py-1"
                          >
                            {district.name}
                          </option>
                        ))}
                      </select>

                      <p className="mt-1.5 text-[10px] text-gray-400">
                        Hold Ctrl/Cmd to select multiple districts.
                      </p>
                    </div>
                  )}

                  {/* LANGUAGE */}

                  <FormSelect
                    label="Language"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    disabled={isSaving}
                    options={[
                      {
                        value: "en",
                        label: "English",
                      },
                      {
                        value: "hi",
                        label: "Hindi",
                      },
                    ]}
                  />

                  {/* STATUS */}

                  <FormSelect
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={isSaving}
                    options={[
                      {
                        value: "Active",
                        label: "Active",
                      },
                      {
                        value: "Inactive",
                        label: "Inactive",
                      },
                    ]}
                  />

                </div>

                {/* ACTIONS */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSaving}
                    className="h-11 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <FiLoader size={17} className="animate-spin" />
                        {editingUser ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={17} />
                        {editingUser ? "Update User" : "Create User"}
                      </>
                    )}
                  </button>

                </div>

                {/* SAVING NOTICE */}

                {isSaving && (
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-xs font-medium text-indigo-600">
                    <FiLoader size={14} className="animate-spin" />
                    Please wait while the user is being saved...
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </ThemeProvider>
    </div>
  );
};

// ==================================================
// FORM INPUT
// ==================================================

const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />
    </div>
  );
};

// ==================================================
// FORM SELECT
// ==================================================

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ==================================================
// USER SKELETON
// ==================================================

const UserSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />

            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded-md bg-gray-200" />
              <div className="h-3 w-24 animate-pulse rounded-md bg-gray-100" />
            </div>
          </div>

          <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-100" />
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-3 w-32 animate-pulse rounded-md bg-gray-100" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-3 w-40 animate-pulse rounded-md bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-4 py-3">
        <div className="h-3 w-14 animate-pulse rounded-md bg-gray-200" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
};

export default Users;
