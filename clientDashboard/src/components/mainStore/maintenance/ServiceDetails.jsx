import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiMapPin,
  FiTool,
  FiUser,
  FiEdit3,
  FiCheck,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { ImageSection } from "../../../components/shared/MaintenanceCommon.jsx";
import { updateServiceRecord, deleteServiceRecord } from "../../../services/maintainence.service.js";
import { AnimatePresence } from "framer-motion";
import CameraCapture from "../../kitchen/uploads/CameraCapture.jsx";

const base_url = import.meta.env.VITE_SERVER_BASE_URL;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
};

const getKitchenName = (record) => {
  if (!record) return "—";
  if (typeof record.kitchenId === "object") {
    return record.kitchenId?.name || record.kitchenId?.kitchenName || "—";
  }
  if (record.kitchen?.name) {
    return record.kitchen.name;
  }
  return record.kitchenName || "—";
};

const getUserName = (record) => {
  if (!record?.userId) return "—";
  if (typeof record.userId === "object") {
    return (
      record.userId?.name ||
      record.userId?.username ||
      record.userId?.email ||
      "—"
    );
  }
  return "—";
};

const InfoRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  );
};

const ServiceDetails = ({ record, onUpdateSuccess, onDeleteSuccess }) => {
  if (!record) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
    const [showCamera, setShowCamera] = useState(false);
    const [cameraType, setCameraType] = useState(null);
  const [formData, setFormData] = useState({
    partName: record.partName || record.machineName || "",
    partyName: record.partyName || "",
    serviceDate: record.serviceDate ? record.serviceDate.split("T")[0] : "",
    nextServiceDate: record.nextServiceDate ? record.nextServiceDate.split("T")[0] : "",
    narration: record.narration || "",
    images: Array.isArray(record.images) ? record.images : [],
  });

    /* ==========================================================
      CAMERA / IMAGE HANDLERS
  ========================================================== */
  const cameraDocument = useMemo(() => {
    if (cameraType === "Service-image") {
      return {
        id: "Service-image",
        title: "Service Image",
      };
    }
  }, [cameraType]);

  const openCamera = (type) => {
    setCameraType(type);
    setShowCamera(true);
  };

  const handleCameraCapture = (file, documentType) => {
    if (!file) return;
    if (documentType?.id === "Service-image") {
      setFormData((prev) => {
        const currentImages = prev.images || [];
        if (currentImages.length >= 5) {
          toast.error("Maximum 5 images allowed");
          return prev;
        }
        return { ...prev, images: [...currentImages, file] };
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => {
      const currentImages = prev.images || [];
      if (currentImages.length + files.length > 5) {
        alert("Maximum 5 images allowed");
        return prev;
      }
      return { ...prev, images: [...currentImages, ...files] };
    });
  };

  const handleCamera = (file) => {
    setFormData((prev) => {
      const currentImages = prev.images || [];
      if (currentImages.length >= 5) {
        alert("Maximum 5 images allowed");
        return prev;
      }
      return { ...prev, images: [...currentImages, file] };
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const data = new FormData();
      data.append("partName", formData.partName);
      data.append("partyName", formData.partyName);
      data.append("serviceDate", formData.serviceDate);
      data.append("nextServiceDate", formData.nextServiceDate);
      data.append("narration", formData.narration);

      formData.images.forEach((image) => {
        if (typeof image === "string") {
          data.append("existingImages", image);
        } else {
          data.append("images", image);
        }
      });

      const updatedRecord = await updateServiceRecord(record._id || record.id, data);
      setIsEditing(false);
      
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedRecord.data);
      }
    } catch (error) {
      console.error("Failed to update service record:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service record?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      const serviceId = record._id || record.id;
      await deleteServiceRecord(serviceId);

      if (onDeleteSuccess) {
        onDeleteSuccess(serviceId);
      }
    } catch (error) {
      console.error("Failed to delete service record:", error);
      alert("Failed to delete record. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      partName: record.partName || record.machineName || "",
      partyName: record.partyName || "",
      serviceDate: record.serviceDate ? record.serviceDate.split("T")[0] : "",
      nextServiceDate: record.nextServiceDate ? record.nextServiceDate.split("T")[0] : "",
      narration: record.narration || "",
      images: Array.isArray(record.images) ? record.images : [],
    });
    setIsEditing(false);
  };

  const images = Array.isArray(formData.images) ? formData.images : [];

  return (
    <div className="space-y-4">
      {/* EDIT / SAVE / DELETE ACTION BAR */}
      <div className="flex items-center justify-between">
        {/* Delete Button */}
        {!isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
          >
            <FiTrash2 size={14} /> {deleting ? "Deleting..." : "Delete Record"}
          </button>
        )}

        <div className="flex ml-auto gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <FiEdit3 size={14} /> Edit Details
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <FiX size={14} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                <FiCheck size={14} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* BASIC INFORMATION */}
      <Section title="Service Information">
        <div className="grid gap-5 sm:grid-cols-2">
          {isEditing ? (
            <>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Part / Equipment
                </label>
                <input
                  type="text"
                  name="partName"
                  value={formData.partName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Party
                </label>
                <input
                  type="text"
                  name="partyName"
                  value={formData.partyName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            <>
              <InfoRow
                icon={FiTool}
                label="Part / Equipment"
                value={record.partName || record.machineName}
              />
              <InfoRow icon={FiUser} label="Party" value={record.partyName} />
            </>
          )}

          <InfoRow
            icon={FiMapPin}
            label="Kitchen"
            value={getKitchenName(record)}
          />

          {isEditing ? (
            <>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Service Date
                </label>
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Next Service Date
                </label>
                <input
                  type="date"
                  name="nextServiceDate"
                  value={formData.nextServiceDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            <>
              <InfoRow
                icon={FiCalendar}
                label="Service Date"
                value={formatDate(record.serviceDate)}
              />
              <InfoRow
                icon={FiCalendar}
                label="Next Service"
                value={formatDate(record.nextServiceDate)}
              />
            </>
          )}

          <InfoRow
            icon={FiClock}
            label="Created At"
            value={formatDateTime(record.createdAt)}
          />
        </div>
      </Section>

      {/* NARRATION */}
      {(record.narration || isEditing) && (
        <Section title="Narration">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FiFileText size={15} />
            </div>
            {isEditing ? (
              <textarea
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {record.narration}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* USER INFORMATION */}
      {record.userId && (
        <Section title="Created By">
          <InfoRow icon={FiUser} label="User" value={getUserName(record)} />
        </Section>
      )}
      
            {isEditing ? (
              <Section title="Manage Photos">
                <ImageSection
                  title="Other Photos / अन्य फोटो"
                  subtitle="Maximum 5 photos / अधिकतम 5 फोटो"
                  images={formData.images}
                  maxImages={5}
                  onCamera={() => openCamera("Service-image")}
                  onFiles={handleFiles}
                  onRemove={handleRemoveImage}
                />
              </Section>
            ) : (
              formData.images.length > 0 && (
                <Section title="Images">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {formData.images.map((image, index) => {
                      const imageUrl = typeof image === "string" ? `${base_url}/uploads/maintenance/${image}` : URL.createObjectURL(image);
                      return (
                        <a
                          key={index}
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={imageUrl}
                            alt={`Service ${index + 1}`}
                            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </a>
                      );
                    })}
                  </div>
                </Section>
              )
            )}

            <AnimatePresence>
              {showCamera && (
                <CameraCapture
                  documentType={cameraDocument}
                  onCapture={handleCameraCapture}
                  onClose={() => setShowCamera(false)}
                />
              )}
            </AnimatePresence>
    </div>
  );
};

export default ServiceDetails;