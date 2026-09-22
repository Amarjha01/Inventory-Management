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
} from "react-icons/fi";
import { updateVisitorRecord } from "../../../services/maintainence.service";
import { ImageSection } from "../../shared/MaintenanceCommon";
import CameraCapture from "../../kitchen/uploads/CameraCapture";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
const base_url = import.meta.env.VITE_SERVER_BASE_URL;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
};

const getKitchenName = (record) => {
  if (!record) return "—";

  if (typeof record.kitchenId === "object") {
    return (
      record.kitchenId?.name ||
      record.kitchenId?.kitchenName ||
      "—"
    );
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
      <div
        className="
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-100
          text-slate-500
        "
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-wider
            text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-words
            text-sm
            font-semibold
            text-slate-800
          "
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <section
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
      "
    >
      <h3
        className="
          mb-4
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-500
        "
      >
        {title}
      </h3>

      {children}
    </section>
  );
};

const VisitorDetails = ({
  record,
  onUpdated,
}) => {
  if (!record) return null;

  const images = record?.visitor?.otherImages || [];

  const [status, setStatus] = useState(
    record.status || "PENDING"
  );

  const [feedback, setFeedback] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [addingFeedback, setAddingFeedback] = useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState(null);
  const [visitorImage, setVisitorImage] = useState([]);
  const [saving, setSaving] = useState(false);
  // Local feedbackTrail state synchronized with record prop
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

  /* ==========================================================
      CAMERA DOCUMENT
  ========================================================== */
  const cameraDocument = useMemo(() => {
    if (cameraType === "visitor-image") {
      return {
        id: "visitor-image",
        title: "Visitor Service Image",
      };
    }
  }, [cameraType]);

  /* ==========================================================
      CAMERA / IMAGE HANDLERS
  ========================================================== */
  const openCamera = (type) => {
    setCameraType(type);
    setShowCamera(true);
  };

  const handleCameraCapture = (file, documentType) => {
    if (!file) return;

    if (documentType?.id === "visitor-image") {
      setVisitorImage((previous) => {
        if (previous?.length >= 5) {
          return previous;
        }
        return [...previous, file];
      });
    }
  };

  const handleVisitorFiles = (event) => {
    const files = Array.from(event.target.files || []);

    setVisitorImage((previous) => {
      const combined = [...previous, ...files];
      return combined.slice(0, 5);
    });

    event.target.value = "";
  };

  const removeVisitorImage = (index) => {
    setVisitorImage((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const isCompleted = status === "COMPLETED";

  /*
   * ---------------------------------------------------------
   * UPDATE STATUS
   * ---------------------------------------------------------
   */
  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) {
      return;
    }

    try {
      setSavingStatus(true);

      const updated = await updateVisitorRecord(
        record._id,
        {
          status: newStatus,
        }
      );

      setStatus(newStatus);
      onUpdated?.(updated);
    } catch (error) {
      console.error("Failed to update visitor status:", error);
      alert(
        error?.response?.data?.message ||
        "Failed to update status."
      );
    } finally {
      setSavingStatus(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * ADD FEEDBACK
   * ---------------------------------------------------------
   */
  const handleAddFeedback = async () => {
    const trimmedFeedback = feedback.trim();

    if (!trimmedFeedback) {
      return;
    }

    try {
      setAddingFeedback(true);

      const updated = await updateVisitorRecord(
        record._id,
        {
          message: trimmedFeedback
        }
      );

      setFeedback("");
      
      const newTrails = updated?.visitor?.feedbackTrail || updated?.feedbackTrail || [];
      setFeedbackTrail(newTrails);
      
      onUpdated?.(updated);
    } catch (error) {
      console.error("Failed to add feedback:", error);
      alert(
        error?.response?.data?.message ||
        "Failed to add feedback."
      );
    } finally {
      setAddingFeedback(false);
    }
  };

  const handleFeedbackKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleAddFeedback();
    }
  };

    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
      let formData = new FormData();

      visitorImage?.forEach((image)=>{
            if (image instanceof File) {
            formData.append("otherImages", image);
        }
      })
      const response = updateVisitorRecord(record._id , formData)
      toast.success(response.message || "image upload successfully")
      setVisitorImage([])
      } catch (error) {
        toast.error(error)
      }
      
    };

  return (
    <div className="space-y-4">

      {/* STATUS */}
      <Section title="Status">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }
              `}
            >
              {isCompleted ? (
                <FiCheckCircle size={19} />
              ) : (
                <FiClock size={19} />
              )}
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Current Status
              </p>

              <p
                className={`
                  mt-1
                  text-sm
                  font-bold
                  ${
                    isCompleted
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }
                `}
              >
                {isCompleted
                  ? "COMPLETED"
                  : "PENDING"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={savingStatus}
              onClick={() =>
                handleStatusChange("PENDING")
              }
              className={`
                rounded-xl
                px-4
                py-2
                text-xs
                font-semibold
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${
                  status === "PENDING"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
              `}
            >
              Pending
            </button>

            <button
              type="button"
              disabled={savingStatus}
              onClick={() =>
                handleStatusChange("COMPLETED")
              }
              className={`
                rounded-xl
                px-4
                py-2
                text-xs
                font-semibold
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${
                  status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
              `}
            >
              Completed
            </button>
          </div>
        </div>
      </Section>

      {/* VISITOR INFORMATION */}
      <Section title="Visitor Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoRow
            icon={FiUser}
            label="Visitor Name"
            value={
              record.visitorName ||
              record.name
            }
          />

          <InfoRow
            icon={FiPhone}
            label="Phone Number"
            value={
              record.phoneNumber ||
              record.phone
            }
          />

          <InfoRow
            icon={FiMapPin}
            label="Kitchen"
            value={getKitchenName(record)}
          />

          <InfoRow
            icon={FiCalendar}
            label="Problem Date"
            value={formatDate(
              record.problemDate
            )}
          />

          <InfoRow
            icon={FiClock}
            label="Created At"
            value={formatDateTime(
              record.createdAt
            )}
          />

          <InfoRow
            icon={FiClock}
            label="Updated At"
            value={formatDateTime(
              record.updatedAt
            )}
          />
        </div>
      </Section>

      {/* REASON */}
      {record.reason && (
        <Section title="Reason">
          <div className="flex gap-3">
            <div
              className="
                flex h-9 w-9
                shrink-0
                items-center justify-center
                rounded-xl
                bg-slate-100
                text-slate-500
              "
            >
              <FiFileText size={15} />
            </div>

            <p
              className="
                whitespace-pre-wrap
                text-sm
                leading-6
                text-slate-600
              "
            >
              {record.reason}
            </p>
          </div>
        </Section>
      )}

      {/* FEEDBACK TRAIL */}
      <Section
        title={`Feedback Trail (${feedbackTrail.length})`}
      >
        {feedbackTrail.length === 0 ? (
          <div
            className="
              rounded-xl
              border border-dashed
              border-slate-200
              bg-slate-50
              p-5
              text-center
            "
          >
            <FiMessageSquare
              size={20}
              className="mx-auto text-slate-300"
            />

            <p
              className="
                mt-2
                text-xs
                text-slate-400
              "
            >
              No feedback has been added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbackTrail.map((item, index) => {
              const date = new Date(item.createdAt);
              const day = date.getDate();
              const month = date.toLocaleString('en', { month: 'short' });
              const year = date.getFullYear();
              const time = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
              
              const formattedDate = !isNaN(date.getTime()) ? `${day} ${month}, ${year} at ${time}` : '';

              return (
                <div key={item._id || index} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                    <FiMessageSquare size={13} />
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-sm">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Feedback {index + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-900">
                          • {item?.sentBy?.name || item?.sentBy?.username || "Unknown User"}
                        </span>
                      </div>
                      
                      <span className="text-[11px] font-medium text-slate-400">
                        {formattedDate}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {item.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p
            className="
              mb-2
              text-xs
              font-bold
              text-slate-700
            "
          >
            Add Feedback
          </p>

          <div className="relative">
            <textarea
              value={feedback}
              onChange={(event) =>
                setFeedback(
                  event.target.value
                )
              }
              onKeyDown={
                handleFeedbackKeyDown
              }
              placeholder="Enter feedback..."
              rows={3}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                pr-12
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-slate-400
                focus:bg-white
                focus:ring-2
                focus:ring-slate-100
              "
            />

            <button
              type="button"
              disabled={
                addingFeedback ||
                !feedback.trim()
              }
              onClick={
                handleAddFeedback
              }
              className="
                absolute
                bottom-3
                right-3
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-slate-900
                text-white
                transition
                hover:bg-slate-700
                disabled:cursor-not-allowed
                disabled:bg-slate-200
                disabled:text-slate-400
              "
            >
              <FiSend size={14} />
            </button>
          </div>

          <p
            className="
              mt-2
              text-[10px]
              text-slate-400
            "
          >
            Press Enter to add feedback.
            Use Shift + Enter for a new line.
          </p>
        </div>
      </Section>

      {/* NARRATION */}
      {record.visitor?.narration && (
        <Section title="Narration">
          <InfoRow
            icon={FiUser}
            label="Narration"
            value={record.visitor.narration}
          />
        </Section>
      )}

      {/* CREATED BY */}
      {record.userId && (
        <Section title="Created By">
          <InfoRow
            icon={FiUser}
            label="User"
            value={getUserName(record)}
          />
        </Section>
      )}

      {/* OTHER IMAGES */}
      {images.length > 0 && (
        <Section title="Images">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => {
              const imageUrl = `${base_url}/uploads/maintenance/${image}`;

              return (
                <a
                  key={image?._id || index}
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group
                    overflow-hidden
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                  "
                >
                  <img
                    src={imageUrl}
                    alt={`Service ${index + 1}`}
                    className="
                      aspect-square
                      w-full
                      object-cover
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  />
                </a>
              );
            })}
          </div>
        </Section>
      )}

      {/* IMAGE SECTION & CAMERA CAPTURE */}
      <ImageSection
        title="Other Photos / अन्य फोटो"
        subtitle="Maximum 5 photos / अधिकतम 5 फोटो"
        images={visitorImage}
        maxImages={5}
        onCamera={() => openCamera("visitor-image")}
        onFiles={handleVisitorFiles}
        onRemove={removeVisitorImage}
      />

      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            documentType={cameraDocument}
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-(--theme-primary) px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
                          Save
                        </>
                      )}
                    </button>

    </div>
  );
};

export default VisitorDetails;