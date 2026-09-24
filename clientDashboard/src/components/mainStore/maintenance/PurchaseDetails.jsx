import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiFileText,
  FiPhone,
  FiUser,
  FiUsers,
  FiX,
  FiSave,
  FiClock,
  FiMapPin,
  FiShoppingBag,
  FiShield,
  FiImage,
  FiEdit3,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { CiBoxes } from "react-icons/ci";
import { updatePurchaseRecord, deletePurchaseRecord } from "../../../services/maintainence.service";
import { ImageSection } from "../../../components/shared/MaintenanceCommon.jsx";
import toast from "react-hot-toast";
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
  if (record.kitchenId && typeof record.kitchenId === "object") {
    return record.kitchenId?.name || record.kitchenId?.kitchenName || "—";
  }
  return record.kitchenName || record.kitchen?.name || "—";
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

const ImagePreview = ({ src, alt }) => {
  if (!src) return null;
  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
    >
      <img
        src={src}
        alt={alt}
        className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </a>
  );
};

const PurchaseDetails = ({ record, onUpdated, onDeleteSuccess }) => {
  if (!record) return null;

  const purchase = record.purchaseRecord || {};

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

    const [showCamera, setShowCamera] = useState(false);
    const [cameraType, setCameraType] = useState(null);
  // Form State for editing
  const [formData, setFormData] = useState({
    partName: purchase.partName || record.partName || "",
    companyName: purchase.companyName || record.companyName || "",
    partyName: purchase.partyName || record.partyName || "",
    purchaseDate: purchase.purchaseDate ? purchase.purchaseDate.split("T")[0] : "",
    ReceivedDate: purchase.ReceivedDate ? purchase.ReceivedDate.split("T")[0] : "",
    expiryWarrantyYear: purchase.expiryWarrantyYear || "",
    narration: purchase.narration || "",
    guaranteePhoto: purchase.guaranteePhoto || null,
    otherImages: Array.isArray(purchase.otherImages)
      ? purchase.otherImages
      : Array.isArray(record.otherImages)
      ? record.otherImages
      : Array.isArray(record.images)
      ? record.images
      : [],
  });
    /* ==========================================================
      CAMERA / IMAGE HANDLERS
  ========================================================== */
  const cameraDocument = useMemo(() => {
    if (cameraType === "Purchase-image") {
      return {
        id: "Purchase-image",
        title: "Purchase Image",
      };
    }
  }, [cameraType]);

  const openCamera = (type) => {
    setCameraType(type);
    setShowCamera(true);
  };

  const handleCameraCapture = (file, documentType) => {
    if (!file) return;
    if (documentType?.id === "Purchase-image") {
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

  const handleCancelEdit = () => {
    setFormData({
      partName: purchase.partName || record.partName || "",
      companyName: purchase.companyName || record.companyName || "",
      partyName: purchase.partyName || record.partyName || "",
      purchaseDate: purchase.purchaseDate ? purchase.purchaseDate.split("T")[0] : "",
      ReceivedDate: purchase.ReceivedDate ? purchase.ReceivedDate.split("T")[0] : "",
      expiryWarrantyYear: purchase.expiryWarrantyYear || "",
      narration: purchase.narration || "",
      guaranteePhoto: purchase.guaranteePhoto || null,
      otherImages: Array.isArray(purchase.otherImages)
        ? purchase.otherImages
        : Array.isArray(record.otherImages)
        ? record.otherImages
        : Array.isArray(record.images)
        ? record.images
        : [],
    });
    setIsEditing(false);
  };

  // Image Handlers for Attachment / Other Photos
  const handleOtherFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => {
      const current = prev.otherImages || [];
      if (current.length + files.length > 5) {
        toast.error("Maximum 5 files allowed");
        return prev;
      }
      return { ...prev, otherImages: [...current, ...files] };
    });
    e.target.value = "";
  };

  const handleRemoveOtherImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, i) => i !== index),
    }));
  };

  // Guarantee Photo handlers
  const handleGuaranteeFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, guaranteePhoto: file }));
    }
  };

  // Save changes via API
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      data.append("partName", formData.partName);
      data.append("companyName", formData.companyName);
      data.append("partyName", formData.partyName);
      data.append("purchaseDate", formData.purchaseDate);
      data.append("ReceivedDate", formData.ReceivedDate);
      data.append("expiryWarrantyYear", formData.expiryWarrantyYear);
      data.append("narration", formData.narration);

      // Handle Guarantee Photo
      if (formData.guaranteePhoto) {
        if (typeof formData.guaranteePhoto === "string") {
          data.append("existingGuaranteePhoto", formData.guaranteePhoto);
        } else {
          data.append("guaranteePhoto", formData.guaranteePhoto);
        }
      }

      // Handle Other Images
      formData.otherImages.forEach((img) => {
        if (typeof img === "string") {
          data.append("existingOtherImages", img);
        } else {
          data.append("otherImages", img);
        }
      });

      const updated = await updatePurchaseRecord(record._id, data);
      toast.success("Purchase record updated successfully");
      setIsEditing(false);
      onUpdated?.(updated);
    } catch (error) {
      console.error("Failed to update purchase record:", error);
      toast.error(error?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Record
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this purchase record?")) return;

    try {
      setDeleting(true);
      await deletePurchaseRecord(record._id);
      toast.success("Record deleted successfully");
      onDeleteSuccess?.(record._id);
    } catch (error) {
      console.error("Failed to delete record:", error);
      toast.error("Failed to delete purchase record.");
    } finally {
      setDeleting(false);
    }
  };

  const guaranteePhotoUrl =
    typeof purchase.guaranteePhoto === "string" && purchase.guaranteePhoto
      ? `${base_url}/uploads/maintenance/${purchase.guaranteePhoto}`
      : null;

  const otherImages = Array.isArray(purchase.otherImages)
    ? purchase.otherImages
    : Array.isArray(record.otherImages)
    ? record.otherImages
    : Array.isArray(record.images)
    ? record.images
    : [];

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

      {/* PURCHASE INFORMATION */}
      <Section title="Purchase Information">
        <div className="grid gap-5 grid-cols-2">
          {isEditing ? (
            <>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Part Name</label>
                <input
                  type="text"
                  name="partName"
                  value={formData.partName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Company</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Party</label>
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
              <InfoRow icon={CiBoxes} label="Part Name" value={purchase.partName || record.partName} />
              <InfoRow icon={FiShoppingBag} label="Company" value={purchase.companyName || record.companyName} />
              <InfoRow icon={FiUser} label="Party" value={purchase.partyName || record.partyName} />
            </>
          )}

          <InfoRow icon={FiMapPin} label="Kitchen" value={getKitchenName(record)} />

          {isEditing ? (
            <>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Received Date</label>
                <input
                  type="date"
                  name="ReceivedDate"
                  value={formData.ReceivedDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Warranty (Years)</label>
                <input
                  type="number"
                  name="expiryWarrantyYear"
                  value={formData.expiryWarrantyYear}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            <>
              <InfoRow icon={FiCalendar} label="Purchase Date" value={formatDate(purchase.purchaseDate || record.purchaseDate)} />
              <InfoRow icon={FiCalendar} label="Received Date" value={formatDate(purchase.ReceivedDate)} />
              <InfoRow
                icon={FiShield}
                label="Warranty"
                value={purchase.expiryWarrantyYear ? `${purchase.expiryWarrantyYear} years` : "—"}
              />
            </>
          )}
        </div>
      </Section>

      {/* GUARANTEE / WARRANTY */}
      {(guaranteePhotoUrl || isEditing) && (
        <Section title="Guarantee / Warranty">
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Guarantee Document</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleGuaranteeFile}
                className="w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
              />
              {formData.guaranteePhoto && typeof formData.guaranteePhoto === "string" && (
                <p className="text-xs text-emerald-600">Current document attached.</p>
              )}
            </div>
          ) : (
            guaranteePhotoUrl && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiShield size={16} />
                  <span>Guarantee / Warranty Document</span>
                </div>
                <ImagePreview src={guaranteePhotoUrl} alt="Guarantee or warranty document" />
              </div>
            )
          )}
        </Section>
      )}

      {/* OTHER FILES / IMAGES */}
      {(otherImages.length > 0 || isEditing) && (
        <Section title="Other Documents & Images">
          {isEditing ? (
            <ImageSection
              title="Attachments / अटैचमेंट्स"
              subtitle="Maximum 5 files / अधिकतम 5 फाइलें"
              images={formData.otherImages}
              maxImages={5}
              onFiles={handleOtherFiles}
              onCamera={() => openCamera("Purchase-image")}
              onRemove={handleRemoveOtherImage}
            />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FiImage size={16} />
                <span>
                  {otherImages.length} attachment{otherImages.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {otherImages.map((image, index) => {
                  const imageUrl = typeof image === "string" ? `${base_url}/uploads/maintenance/${image}` : URL.createObjectURL(image);
                  return <ImagePreview key={index} src={imageUrl} alt={`Purchase attachment ${index + 1}`} />;
                })}
              </div>
            </>
          )}
        </Section>
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
      {/* RECORD INFORMATION */}
      <Section title="Record Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoRow icon={FiUser} label="Created By" value={getUserName(record)} />
          <InfoRow icon={FiMapPin} label="Kitchen" value={getKitchenName(record)} />
          <InfoRow icon={FiClock} label="Created At" value={formatDateTime(purchase.createdAt || record.createdAt)} />
          <InfoRow icon={FiClock} label="Updated At" value={formatDateTime(purchase.updatedAt || record.updatedAt)} />
        </div>
      </Section>

      {/* NOTES */}
      {(purchase.narration || isEditing) && (
        <Section title="Notes">
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
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{purchase.narration}</p>
            )}
          </div>
        </Section>
      )}
    </div>
  );
};

export default PurchaseDetails;