import React, { useEffect, useMemo, useState } from "react";

import {
  FiAlertCircle,
  FiCheck,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiTool,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { AnimatePresence, motion } from "framer-motion";

import CameraCapture from "../../../components/kitchen/uploads/CameraCapture";

import DashboardLayout from "../../../layouts/DashboardLayout";

import ThemeProvider from "../../../components/shared/ui/ThemeProvider";

import PageHeader from "../../../components/shared/ui/PageHeader";

import { themes } from "../../../components/shared/ui/Theme";




import ServiceSection from "./ServiceSection.jsx";
import VisitorSection from "./VisitorSection.jsx";
import PurchaseSection from "./PurchaseSection.jsx";

/* ============================================================
   CONSTANTS
============================================================ */

const API_BASE = "/api/maintenance";

const TABS = {
  SERVICE: "service",
  VISITOR: "visitor",
  PURCHASE: "purchase",
};

/* ============================================================
   EMPTY FORMS
============================================================ */

const EMPTY_SERVICE = {
  partName: "",
  serviceDate: "",
  partyName: "",
  nextServiceDate: "",
  narration: "",
  images: [],
};

const EMPTY_VISITOR = {
  problemDate: "",
  visitorName: "",
  phoneNumber: "",
  reason: "",
  narration: "",
};

const EMPTY_PURCHASE = {
  purchaseDate: "",
  partyName: "",
  guaranteePhoto: null,
  expiryWarrantyYear: "",
  companyName: "",
  otherImages: [],
};

/* ============================================================
   COMPONENT
============================================================ */

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState(TABS.SERVICE);

  const [maintenance, setMaintenance] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [expandedId, setExpandedId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showCamera, setShowCamera] = useState(false);

  const [cameraType, setCameraType] = useState(null);

  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);

  const [visitorForm, setVisitorForm] = useState(EMPTY_VISITOR);

  const [purchaseForm, setPurchaseForm] = useState(EMPTY_PURCHASE);

  /* ==========================================================
     FETCH
  ========================================================== */

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_BASE, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to fetch maintenance records.",
        );
      }

      setMaintenance(result.data);
    } catch (error) {
      // console?.error(error);

      setError(error.message || "Unable to fetch maintenance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  /* ==========================================================
     CURRENT RECORDS
  ========================================================== */

  const records = useMemo(() => {
    if (!maintenance) {
      return [];
    }

    if (activeTab === TABS.SERVICE) {
      return maintenance.service || [];
    }

    if (activeTab === TABS.VISITOR) {
      return maintenance.visitor || [];
    }

    return maintenance.purchaseRecord || [];
  }, [maintenance, activeTab]);

  /* ==========================================================
     STATS
  ========================================================== */

  const stats = useMemo(() => {
    return {
      service: maintenance?.service?.length || 0,

      visitor: maintenance?.visitor?.length || 0,

      purchase: maintenance?.purchaseRecord?.length || 0,
    };
  }, [maintenance]);

  /* ==========================================================
     SUCCESS MESSAGE
  ========================================================== */

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  /* ==========================================================
     RESET
  ========================================================== */

  const resetForms = () => {
    setServiceForm({
      ...EMPTY_SERVICE,
      images: [],
    });

    setVisitorForm({
      ...EMPTY_VISITOR,
    });

    setPurchaseForm({
      ...EMPTY_PURCHASE,
      otherImages: [],
    });

    setEditingId(null);
  };

  /* ==========================================================
     CREATE
  ========================================================== */

  const openCreate = () => {
    resetForms();

    setError("");

    setShowForm(true);
  };

  /* ==========================================================
     EDIT
  ========================================================== */

  const openEdit = (record) => {
    setError("");

    setEditingId(record._id);

    if (activeTab === TABS.SERVICE) {
      setServiceForm({
        partName: record.partName || "",

        serviceDate: formatInputDate(record.serviceDate),

        partyName: record.partyName || "",

        nextServiceDate: formatInputDate(record.nextServiceDate),

        narration: record.narration || "",

        images: record.images || [],
      });
    }

    if (activeTab === TABS.VISITOR) {
      setVisitorForm({
        problemDate: formatInputDate(record.problemDate),

        visitorName: record.visitorName || "",

        phoneNumber: record.phoneNumber || "",

        reason: record.reason || "",

        narration: record.narration || "",
      });
    }

    if (activeTab === TABS.PURCHASE) {
      setPurchaseForm({
        purchaseDate: formatInputDate(record.purchaseDate),

        partyName: record.partyName || "",

        guaranteePhoto: record.guaranteePhoto || null,

        expiryWarrantyYear: record.expiryWarrantyYear || "",

        companyName: record.companyName || "",

        otherImages: record.otherImages || [],
      });
    }

    setShowForm(true);
  };

  /* ==========================================================
     CLOSE FORM
  ========================================================== */

  const closeForm = () => {
    if (saving) return;

    resetForms();

    setShowForm(false);
  };

  /* ==========================================================
     INPUT HANDLERS
  ========================================================== */

  const handleServiceChange = (event) => {
    const { name, value } = event.target;

    setServiceForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleVisitorChange = (event) => {
    const { name, value } = event.target;

    setVisitorForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePurchaseChange = (event) => {
    const { name, value } = event.target;

    setPurchaseForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==========================================================
     CAMERA
  ========================================================== */

  const openCamera = (type) => {
    setCameraType(type);

    setShowCamera(true);
  };

  const handleCameraCapture = (file, documentType) => {
    if (!file) return;

    if (documentType?.id === "service-image") {
      setServiceForm((previous) => {
        if (previous.images.length >= 2) {
          return previous;
        }

        return {
          ...previous,
          images: [...previous.images, file],
        };
      });
    }

    if (documentType?.id === "guarantee-photo") {
      setPurchaseForm((previous) => ({
        ...previous,
        guaranteePhoto: file,
      }));
    }

    if (documentType?.id === "purchase-image") {
      setPurchaseForm((previous) => {
        if (previous.otherImages.length >= 1) {
          return previous;
        }

        return {
          ...previous,
          otherImages: [...previous.otherImages, file],
        };
      });
    }
  };

  /* ==========================================================
     SERVICE FILES
  ========================================================== */

  const handleServiceFiles = (event) => {
    const files = Array.from(event.target.files || []);

    setServiceForm((previous) => ({
      ...previous,

      images: [...previous.images, ...files].slice(0, 2),
    }));

    event.target.value = "";
  };

  /* ==========================================================
     PURCHASE FILES
  ========================================================== */

  const handleGuaranteeFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPurchaseForm((previous) => ({
      ...previous,
      guaranteePhoto: file,
    }));

    event.target.value = "";
  };

  const handlePurchaseFiles = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPurchaseForm((previous) => ({
      ...previous,

      otherImages: [file],
    }));

    event.target.value = "";
  };

  /* ==========================================================
     REMOVE FILES
  ========================================================== */

  const removeServiceImage = (index) => {
    setServiceForm((previous) => ({
      ...previous,

      images: previous.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const removeGuaranteePhoto = () => {
    setPurchaseForm((previous) => ({
      ...previous,
      guaranteePhoto: null,
    }));
  };

  const removePurchaseImage = () => {
    setPurchaseForm((previous) => ({
      ...previous,
      otherImages: [],
    }));
  };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateService = () => {
    if (!serviceForm.partName.trim()) {
      return "Part name is required.";
    }

    if (!serviceForm.serviceDate) {
      return "Service date is required.";
    }

    if (!serviceForm.partyName.trim()) {
      return "Party name is required.";
    }

    if (
      serviceForm.nextServiceDate &&
      serviceForm.serviceDate > serviceForm.nextServiceDate
    ) {
      return "Next service date cannot be before service date.";
    }

    if (serviceForm.images.length > 2) {
      return "Maximum 2 images are allowed.";
    }

    return "";
  };

  const validateVisitor = () => {
    if (!visitorForm.problemDate) {
      return "Problem date is required.";
    }

    if (!visitorForm.visitorName.trim()) {
      return "Visitor name is required.";
    }

    if (!visitorForm.phoneNumber.trim()) {
      return "Phone number is required.";
    }

    if (!visitorForm.reason.trim()) {
      return "Reason is required.";
    }

    return "";
  };

  const validatePurchase = () => {
    if (!purchaseForm.purchaseDate) {
      return "Purchase date is required.";
    }

    if (!purchaseForm.partyName.trim()) {
      return "Party name is required.";
    }

    if (!purchaseForm.companyName.trim()) {
      return "Company name is required.";
    }

    return "";
  };

  /* ==========================================================
     FORM DATA
  ========================================================== */

  const buildServiceFormData = () => {
    const formData = new FormData();

    formData.append("partName", serviceForm.partName);

    formData.append("serviceDate", serviceForm.serviceDate);

    formData.append("partyName", serviceForm.partyName);

    if (serviceForm.nextServiceDate) {
      formData.append("nextServiceDate", serviceForm.nextServiceDate);
    }

    formData.append("narration", serviceForm.narration);

    serviceForm.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    return formData;
  };

  const buildVisitorFormData = () => {
    const formData = new FormData();

    formData.append("problemDate", visitorForm.problemDate);

    formData.append("visitorName", visitorForm.visitorName);

    formData.append("phoneNumber", visitorForm.phoneNumber);

    formData.append("reason", visitorForm.reason);

    formData.append("narration", visitorForm.narration);

    return formData;
  };

  const buildPurchaseFormData = () => {
    const formData = new FormData();

    formData.append("purchaseDate", purchaseForm.purchaseDate);

    formData.append("partyName", purchaseForm.partyName);

    formData.append("expiryWarrantyYear", purchaseForm.expiryWarrantyYear);

    formData.append("companyName", purchaseForm.companyName);

    if (purchaseForm.guaranteePhoto instanceof File) {
      formData.append("guaranteePhoto", purchaseForm.guaranteePhoto);
    }

    purchaseForm.otherImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("otherImages", image);
      }
    });

    return formData;
  };

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    let validationError = "";

    if (activeTab === TABS.SERVICE) {
      validationError = validateService();
    }

    if (activeTab === TABS.VISITOR) {
      validationError = validateVisitor();
    }

    if (activeTab === TABS.PURCHASE) {
      validationError = validatePurchase();
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      let endpoint = API_BASE;

      let method = editingId ? "PUT" : "POST";

      if (activeTab === TABS.SERVICE) {
        endpoint = editingId
          ? `${API_BASE}/service/${editingId}`
          : `${API_BASE}/service`;
      }

      if (activeTab === TABS.VISITOR) {
        endpoint = editingId
          ? `${API_BASE}/visitor/${editingId}`
          : `${API_BASE}/visitor`;
      }

      if (activeTab === TABS.PURCHASE) {
        endpoint = editingId
          ? `${API_BASE}/purchase-record/${editingId}`
          : `${API_BASE}/purchase-record`;
      }

      let formData;

      if (activeTab === TABS.SERVICE) {
        formData = buildServiceFormData();
      }

      if (activeTab === TABS.VISITOR) {
        formData = buildVisitorFormData();
      }

      if (activeTab === TABS.PURCHASE) {
        formData = buildPurchaseFormData();
      }

      const response = await fetch(endpoint, {
        method,
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Unable to save record.");
      }

      setMaintenance(result.data);

      showSuccess(
        editingId
          ? "Record updated successfully."
          : "Record added successfully.",
      );

      closeForm();
    } catch (error) {
      console.error(error);

      setError(error.message || "Unable to save record.");
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      let endpoint;

      if (activeTab === TABS.SERVICE) {
        endpoint = `${API_BASE}/service/${record._id}`;
      }

      if (activeTab === TABS.VISITOR) {
        endpoint = `${API_BASE}/visitor/${record._id}`;
      }

      if (activeTab === TABS.PURCHASE) {
        endpoint = `${API_BASE}/purchase-record/${record._id}`;
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Unable to delete record.");
      }

      setMaintenance(result.data);

      showSuccess("Record deleted successfully.");
    } catch (error) {
      console.error(error);

      setError(error.message || "Unable to delete record.");
    }
  };

  /* ==========================================================
     TAB
  ========================================================== */

  const changeTab = (tab) => {
    setActiveTab(tab);

    setShowForm(false);

    resetForms();

    setExpandedId(null);

    setError("");
  };

  /* ==========================================================
     CAMERA DOCUMENT
  ========================================================== */

  const cameraDocument = useMemo(() => {
    if (cameraType === "service-image") {
      return {
        id: "service-image",
        title: "Service Image",
      };
    }

    if (cameraType === "guarantee-photo") {
      return {
        id: "guarantee-photo",
        title: "Guarantee / Warranty",
      };
    }

    return {
      id: "purchase-image",
      title: "Purchase Image",
    };
  }, [cameraType]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <DashboardLayout>
        <ThemeProvider theme={themes.SETTINGS} className="min-h-full pb-24">
          <div className="mx-auto w-full max-w-2xl px-4 pb-24">
            <PageHeader
              title="Maintenance"
              subtitle="Manage service, visitor and purchase records."
              imageUrl="/ui/type/SETTING.png"
            />

            <div className="mt-10 flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <FiRefreshCw size={28} className="text-(--theme-primary)" />
              </motion.div>

              <p className="mt-3 text-sm text-(--theme-text-muted)">
                Loading maintenance records...
              </p>
            </div>
          </div>
        </ThemeProvider>
      </DashboardLayout>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <DashboardLayout>
      <ThemeProvider theme={themes.SETTINGS} className="min-h-full pb-24">
        <div className="mx-auto w-full max-w-2xl px-4 pb-24">
          <PageHeader
            title="Maintenance"
            subtitle="Manage service, visitor and purchase records."
            imageUrl="/ui/type/SETTING.png"
          />

          {/* ====================================================
              ALERTS
          ==================================================== */}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="
                  mt-4
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                <FiAlertCircle size={17} className="mt-0.5 shrink-0" />

                <span className="flex-1">{error}</span>

                <button type="button" onClick={() => setError("")}>
                  <FiX size={17} />
                </button>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-4
                  py-3
                  text-sm
                  text-emerald-700
                "
              >
                <FiCheck size={17} />

                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====================================================
              SUMMARY
          ==================================================== */}

          <div className="mt-6 grid grid-cols-3 gap-2">
            <SummaryCard
              icon={FiTool}
              label="Services"
              value={stats.service}
              active={activeTab === TABS.SERVICE}
              onClick={() => changeTab(TABS.SERVICE)}
            />

            <SummaryCard
              icon={FiUsers}
              label="Visitors"
              value={stats.visitor}
              active={activeTab === TABS.VISITOR}
              onClick={() => changeTab(TABS.VISITOR)}
            />

            <SummaryCard
              icon={FiPackage}
              label="Purchases"
              value={stats.purchase}
              active={activeTab === TABS.PURCHASE}
              onClick={() => changeTab(TABS.PURCHASE)}
            />
          </div>

          {/* ====================================================
              TABS
          ==================================================== */}

          <div
            className="
              mt-6
              flex
              overflow-x-auto
              rounded-xl
              border
              border-(--theme-border)
              bg-(--theme-surface)
              p-1
            "
          >
            <TabButton
              active={activeTab === TABS.SERVICE}
              icon={FiTool}
              label="Service"
              onClick={() => changeTab(TABS.SERVICE)}
            />

            <TabButton
              active={activeTab === TABS.VISITOR}
              icon={FiUsers}
              label="Visitor"
              onClick={() => changeTab(TABS.VISITOR)}
            />

            <TabButton
              active={activeTab === TABS.PURCHASE}
              icon={FiPackage}
              label="Purchase"
              onClick={() => changeTab(TABS.PURCHASE)}
            />
          </div>

          {/* ====================================================
              ADD
          ==================================================== */}

          {!showForm && (
            <motion.button
              type="button"
              whileTap={{
                scale: 0.98,
              }}
              onClick={openCreate}
              className="
                mt-5
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-(--theme-primary)
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:opacity-90
              "
            >
              <FiPlus size={18} />
              Add{" "}
              {activeTab === TABS.SERVICE
                ? "Service Record"
                : activeTab === TABS.VISITOR
                  ? "Visitor Record"
                  : "Purchase Record"}
            </motion.button>
          )}

          {/* ====================================================
              FORM
          ==================================================== */}

          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="overflow-hidden"
              >
                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-(--theme-border)
                    bg-(--theme-surface)
                    p-4
                    shadow-sm
                  "
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-(--theme-text-muted)">
                        {editingId ? "Edit record" : "New record"}
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-(--theme-text)">
                        {activeTab === TABS.SERVICE
                          ? "Service Details"
                          : activeTab === TABS.VISITOR
                            ? "Visitor Details"
                            : "Purchase Details"}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={closeForm}
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-(--theme-muted)
                        text-(--theme-text-muted)
                        transition
                        hover:text-(--theme-text)
                      "
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  {activeTab === TABS.SERVICE && (
                    <ServiceSection
                      form={serviceForm}
                      onChange={handleServiceChange}
                      onCamera={() => openCamera("service-image")}
                      onFiles={handleServiceFiles}
                      onRemoveImage={removeServiceImage}
                    />
                  )}

                  {activeTab === TABS.VISITOR && (
                    <VisitorSection
                      form={visitorForm}
                      onChange={handleVisitorChange}
                    />
                  )}

                  {activeTab === TABS.PURCHASE && (
                    <PurchaseSection
                      form={purchaseForm}
                      onChange={handlePurchaseChange}
                      onGuaranteeCamera={() => openCamera("guarantee-photo")}
                      onGuaranteeFile={handleGuaranteeFile}
                      onRemoveGuarantee={removeGuaranteePhoto}
                      onOtherCamera={() => openCamera("purchase-image")}
                      onOtherFiles={handlePurchaseFiles}
                      onRemoveOther={removePurchaseImage}
                    />
                  )}

                  {/* ACTIONS */}

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={saving}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-(--theme-border)
                        bg-(--theme-surface)
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-(--theme-text)
                        transition
                        hover:bg-(--theme-muted)
                        disabled:opacity-50
                      "
                    >
                      <FiX size={17} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={saving}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-(--theme-primary)
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {saving ? (
                        <>
                          <motion.span
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <FiRefreshCw size={17} />
                          </motion.span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave size={17} />

                          {editingId ? "Update" : "Save"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====================================================
              RECORDS
          ==================================================== */}

          <div className="mt-6">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-(--theme-text)">
                {activeTab === TABS.SERVICE
                  ? "Service History"
                  : activeTab === TABS.VISITOR
                    ? "Visitor History"
                    : "Purchase History"}
              </h2>

              <p className="mt-0.5 text-xs text-(--theme-text-muted)">
                {records.length} {records.length === 1 ? "record" : "records"}
              </p>
            </div>

            {records.length === 0 ? (
              // <EmptyState
              //   icon={
              //     activeTab === TABS.SERVICE
              //       ? FiTool
              //       : activeTab === TABS.VISITOR
              //         ? FiUsers
              //         : FiPackage
              //   }
              //   title={
              //     activeTab === TABS.SERVICE
              //       ? "No service records"
              //       : activeTab === TABS.VISITOR
              //         ? "No visitor records"
              //         : "No purchase records"
              //   }
              //   text={
              //     activeTab === TABS.SERVICE
              //       ? "Service history will appear here."
              //       : activeTab === TABS.VISITOR
              //         ? "Visitor/problem records will appear here."
              //         : "Purchase history will appear here."
              //   }
              //   onAdd={openCreate}
              // />
              <>
              <p>empty</p>
              </>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {records.map((record) => (
                    <MaintenanceRecordCard
                      key={record._id}
                      record={record}
                      type={activeTab}
                      expanded={expandedId === record._id}
                      onToggle={() =>
                        setExpandedId(
                          expandedId === record._id ? null : record._id,
                        )
                      }
                      onEdit={() => openEdit(record)}
                      onDelete={() => handleDelete(record)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            CAMERA
        ====================================================== */}

        <AnimatePresence>
          {showCamera && (
            <CameraCapture
              documentType={cameraDocument}
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
            />
          )}
        </AnimatePresence>
      </ThemeProvider>
    </DashboardLayout>
  );
};

/* ============================================================
   SUMMARY CARD
============================================================ */

const SummaryCard = ({ icon: Icon, label, value, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl
        border
        p-3
        text-left
        transition
        ${
          active
            ? "border-(--theme-primary) bg-(--theme-primary)/5"
            : "border-(--theme-border) bg-(--theme-surface) hover:bg-(--theme-muted)"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <Icon
          size={17}
          className={
            active ? "text-(--theme-primary)" : "text-(--theme-text-muted)"
          }
        />

        <span className="text-lg font-bold text-(--theme-text)">{value}</span>
      </div>

      <p className="mt-1 text-[11px] text-(--theme-text-muted)">{label}</p>
    </button>
  );
};

/* ============================================================
   TAB BUTTON
============================================================ */

const TabButton = ({ active, icon: Icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-w-[100px]
        flex-1
        items-center
        justify-center
        gap-2
        rounded-lg
        px-3
        py-2.5
        text-xs
        font-medium
        transition
        ${
          active
            ? "bg-(--theme-primary) text-white shadow-sm"
            : "text-(--theme-text-muted) hover:bg-(--theme-muted) hover:text-(--theme-text)"
        }
      `}
    >
      <Icon size={15} />
      {label}
    </button>
  );
};

export default Maintenance;