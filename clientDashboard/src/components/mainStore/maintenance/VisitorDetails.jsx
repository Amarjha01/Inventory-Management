import React, { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiRefreshCw,
  FiSave,
  FiSend,
  FiUser,
  FiX,
  FiEdit3,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { updateVisitorRecord, deleteVisitorRecord } from "../../../services/maintainence.service";
import { ImageSection } from "../../shared/MaintenanceCommon";
import CameraCapture from "../../kitchen/uploads/CameraCapture";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

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

const VisitorDetails = ({ record, onUpdated, onClose , onDeleteSuccess }) => {
  if (!record) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(record.status || "PENDING");
  const [feedback, setFeedback] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [addingFeedback, setAddingFeedback] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState(null);
  const [saving, setSaving] = useState(false);

  // Editable Form Data state (including existing and new images)
  const [formData, setFormData] = useState({
    visitorName: record.visitorName || record.name || "",
    phoneNumber: record.phoneNumber || record.phone || "",
    problemDate: record.problemDate ? record.problemDate.split("T")[0] : "",
    reason: record.reason || "",
    images: Array.isArray(record?.visitor?.otherImages)
      ? record.visitor.otherImages
      : Array.isArray(record?.otherImages)
      ? record.otherImages
      : [],
  });

  const [feedbackTrail, setFeedbackTrail] = useState(() => {
    return Array.isArray(record?.visitor?.feedbackTrail)
      ? record.visitor.feedbackTrail
      : Array.isArray(record?.feedbackTrail)
      ? record.feedbackTrail
      : Array.isArray(record?.feedBackTrail)
      ? record.feedBackTrail
      : [];
  });

  useEffect(() => {
    const trails = Array.isArray(record?.visitor?.feedbackTrail)
      ? record.visitor.feedbackTrail
      : Array.isArray(record?.feedbackTrail)
      ? record.feedbackTrail
      : Array.isArray(record?.feedBackTrail)
      ? record.feedBackTrail
      : [];
    setFeedbackTrail(trails);
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ==========================================================
      CAMERA / IMAGE HANDLERS
  ========================================================== */
  const cameraDocument = useMemo(() => {
    if (cameraType === "visitor-image") {
      return {
        id: "visitor-image",
        title: "Visitor Service Image",
      };
    }
  }, [cameraType]);

  const openCamera = (type) => {
    setCameraType(type);
    setShowCamera(true);
  };

  const handleCameraCapture = (file, documentType) => {
    if (!file) return;
    if (documentType?.id === "visitor-image") {
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

  const handleVisitorFiles = (event) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => {
      const currentImages = prev.images || [];
      if (currentImages.length + files.length > 5) {
        toast.error("Maximum 5 images allowed");
        return prev;
      }
      return { ...prev, images: [...currentImages, ...files] };
    });
    event.target.value = "";
  };

  const removeVisitorImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleCancelEdit = () => {
    setFormData({
      visitorName: record.visitorName || record.name || "",
      phoneNumber: record.phoneNumber || record.phone || "",
      problemDate: record.problemDate ? record.problemDate.split("T")[0] : "",
      reason: record.reason || "",
      images: Array.isArray(record?.visitor?.otherImages)
        ? record.visitor.otherImages
        : Array.isArray(record?.otherImages)
        ? record.otherImages
        : [],
    });
    setIsEditing(false);
  };

  const isCompleted = status === "COMPLETED";

  /* ==========================================================
      UPDATE STATUS
  ========================================================== */
  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;

    try {
      setSavingStatus(true);
      const updated = await updateVisitorRecord(record._id, { status: newStatus });
      setStatus(newStatus);
      onUpdated?.(updated);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Failed to update visitor status:", error);
      toast.error(error?.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  /* ==========================================================
      ADD FEEDBACK
  ========================================================== */
  const handleAddFeedback = async () => {
    const trimmedFeedback = feedback.trim();
    if (!trimmedFeedback) return;

    try {
      setAddingFeedback(true);
      const updated = await updateVisitorRecord(record._id, { message: trimmedFeedback });
      setFeedback("");
      const newTrails = updated?.visitor?.feedbackTrail || updated?.feedbackTrail || [];
      setFeedbackTrail(newTrails);
      onUpdated?.(updated);
      toast.success("Feedback added");
    } catch (error) {
      console.error("Failed to add feedback:", error);
      toast.error(error?.response?.data?.message || "Failed to add feedback.");
    } finally {
      setAddingFeedback(false);
    }
  };

  const handleFeedbackKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddFeedback();
    }
  };

  /* ==========================================================
      SAVE EDITABLE FIELDS & IMAGES (MULTIPART)
  ========================================================== */
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      data.append("visitorName", formData.visitorName);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("problemDate", formData.problemDate);
      data.append("reason", formData.reason);

      formData.images.forEach((image) => {
        if (typeof image === "string") {
          data.append("existingImages", image);
        } else {
          data.append("otherImages", image);
        }
      });

      const response = await updateVisitorRecord(record._id, data);
      toast.success("Visitor record updated successfully");
      setIsEditing(false);
      onUpdated?.(response);
    } catch (error) {
      console.error("Failed update:", error);
      toast.error(error?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
      DELETE VISITOR RECORD
  ========================================================== */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this visitor record?")) return;

    try {
      setDeleting(true);
      await deleteVisitorRecord(record._id);
      toast.success("Record deleted successfully");
      onClose
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete visitor record.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ACTION BAR: DELETE & EDIT TOGGLE */}
      <div className="flex items-center justify-between">
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
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <FiX size={14} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={saving}
                className="flex items-center gap-1 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                <FiCheck size={14} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* STATUS */}
      <Section title="Status">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {isCompleted ? <FiCheckCircle size={19} /> : <FiClock size={19} />}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Current Status
              </p>
              <p className={`mt-1 text-sm font-bold ${isCompleted ? "text-emerald-700" : "text-amber-700"}`}>
                {isCompleted ? "COMPLETED" : "PENDING"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={savingStatus}
              onClick={() => handleStatusChange("PENDING")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              disabled={savingStatus}
              onClick={() => handleStatusChange("COMPLETED")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </Section>

      {/* VISITOR INFORMATION */}
      <Section title="Visitor Information">
        <div className="grid gap-5 sm:grid-cols-2">
          {isEditing ? (
            <>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Visitor Name</label>
                <input
                  type="text"
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            <>
              <InfoRow icon={FiUser} label="Visitor Name" value={record.visitorName || record.name} />
              <InfoRow icon={FiPhone} label="Phone Number" value={record.phoneNumber || record.phone} />
            </>
          )}

          <InfoRow icon={FiMapPin} label="Kitchen" value={getKitchenName(record)} />

          {isEditing ? (
            <div>
              <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Problem Date</label>
              <input
                type="date"
                name="problemDate"
                value={formData.problemDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
              />
            </div>
          ) : (
            <InfoRow icon={FiCalendar} label="Problem Date" value={formatDate(record.problemDate)} />
          )}

          <InfoRow icon={FiClock} label="Created At" value={formatDateTime(record.createdAt)} />
          <InfoRow icon={FiClock} label="Updated At" value={formatDateTime(record.updatedAt)} />
        </div>
      </Section>

      {/* REASON */}
      {(record.reason || isEditing) && (
        <Section title="Reason">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FiFileText size={15} />
            </div>
            {isEditing ? (
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{record.reason}</p>
            )}
          </div>
        </Section>
      )}

      {/* FEEDBACK TRAIL */}
      <Section title={`Feedback Trail (${feedbackTrail.length})`}>
        {feedbackTrail.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <FiMessageSquare size={20} className="mx-auto text-slate-300" />
            <p className="mt-2 text-xs text-slate-400">No feedback has been added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbackTrail.map((item, index) => {
              const date = new Date(item.createdAt);
              const formattedDate = !isNaN(date.getTime()) ? `${date.getDate()} ${date.toLocaleString('en', { month: 'short' })}, ${date.getFullYear()} at ${date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}` : '';

              return (
                <div key={item._id || index} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                    <FiMessageSquare size={13} />
                  </div>
                  <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-sm">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Feedback {index + 1}</span>
                        <span className="text-xs font-semibold text-slate-900">• {item?.sentBy?.name || item?.sentBy?.username || "Unknown User"}</span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">{formattedDate}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="mb-2 text-xs font-bold text-slate-700">Add Feedback</p>
          <div className="relative">
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              onKeyDown={handleFeedbackKeyDown}
              placeholder="Enter feedback..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
            <button
              type="button"
              disabled={addingFeedback || !feedback.trim()}
              onClick={handleAddFeedback}
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <FiSend size={14} />
            </button>
          </div>
        </div>
      </Section>

      {/* IMAGES SECTION (View Mode or Edit Mode via ImageSection) */}
      {isEditing ? (
        <Section title="Manage Photos">
          <ImageSection
            title="Other Photos / अन्य फोटो"
            subtitle="Maximum 5 photos / अधिकतम 5 फोटो"
            images={formData.images}
            maxImages={5}
            onCamera={() => openCamera("visitor-image")}
            onFiles={handleVisitorFiles}
            onRemove={removeVisitorImage}
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
                      alt={`Visitor ${index + 1}`}
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

export default VisitorDetails;