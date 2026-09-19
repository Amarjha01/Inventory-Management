import React from "react";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiMapPin,
  FiTool,
  FiUser,
} from "react-icons/fi";

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

const ServiceDetails = ({ record }) => {
  if (!record) return null;

  const images = Array.isArray(record.images) ? record.images : [];

  return (
    <div className="space-y-4">
      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <Section title="Service Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoRow
            icon={FiTool}
            label="Part / Equipment"
            value={record.partName || record.machineName}
          />

          <InfoRow icon={FiUser} label="Party" value={record.partyName} />

          <InfoRow
            icon={FiMapPin}
            label="Kitchen"
            value={getKitchenName(record)}
          />

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

          <InfoRow
            icon={FiClock}
            label="Created At"
            value={formatDateTime(record.createdAt)}
          />
        </div>
      </Section>

      {/* =================================================
          NARRATION
      ================================================= */}

      {record.narration && (
        <Section title="Narration">
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

            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {record.narration}
            </p>
          </div>
        </Section>
      )}

      {/* =================================================
          USER INFORMATION
      ================================================= */}

      {record.userId && (
        <Section title="Created By">
          <InfoRow icon={FiUser} label="User" value={getUserName(record)} />
        </Section>
      )}

      {/* =================================================
          IMAGES
      ================================================= */}

      {images.length > 0 && (
        <Section title="Images">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => {
              const imageUrl = `${base_url}/uploads/maintenance/${image}` || `https://esfserver.axeiro.com/api/v1/uploads/maintenance/${image}`
              if (!imageUrl) {
                return null;
              }

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
    </div>
  );
};

export default ServiceDetails;
