import React from "react";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiMapPin,
  FiShoppingBag,
  FiUser,
  FiShield,
  FiImage,
} from "react-icons/fi";
import { CiBoxes } from "react-icons/ci";
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

const ImagePreview = ({ src, alt }) => {
  
  if (!src) return null;

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="
        group
        block
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-slate-50
      "
    >
      <img
        src= {src}
        alt={alt}
        className="
          aspect-video
          w-full
          object-cover
          transition
          duration-300
          group-hover:scale-105
        "
      />
    </a>
  );
};

const PurchaseDetails = ({ record }) => {
  if (!record) return null;

  /*
   * ---------------------------------------------------------
   * IMPORTANT
   * ---------------------------------------------------------
   *
   * Your API response contains the purchase data in:
   *
   * record.purchaseRecord
   *
   * Example:
   *
   * record.purchaseRecord.companyName
   * record.purchaseRecord.partyName
   * record.purchaseRecord.guaranteePhoto
   * record.purchaseRecord.otherImages
   * record.purchaseRecord.purchaseDate
   * record.purchaseRecord.ReceivedDate
   *
   */

  const purchase = record.purchaseRecord || {};

  /*
   * ---------------------------------------------------------
   * IMAGES
   * ---------------------------------------------------------
   */

  const guaranteePhoto = `${base_url}/uploads/maintenance/${purchase.guaranteePhoto}`

  const otherImages = Array.isArray(purchase.otherImages)
    ? purchase.otherImages
    : Array.isArray(record.otherImages)
      ? record.otherImages
      : Array.isArray(record.images)
        ? record.images
        : [];

  return (
    <div className="space-y-4">
      {/* =====================================================
          PURCHASE INFORMATION
      ===================================================== */}

      <Section title="Purchase Information">
        <div className="grid gap-5 grid-cols-2">
          <InfoRow
            icon={CiBoxes}
            label="Part Name"
            value={purchase.partName || record.partName}
          />

          <InfoRow
            icon={FiShoppingBag}
            label="Company"
            value={purchase.companyName || record.companyName}
          />

          <InfoRow
            icon={FiUser}
            label="Party"
            value={purchase.partyName || record.partyName}
          />

          <InfoRow
            icon={FiMapPin}
            label="Kitchen"
            value={getKitchenName(record)}
          />

          <InfoRow
            icon={FiCalendar}
            label="Purchase Date"
            value={formatDate(purchase.purchaseDate || record.purchaseDate)}
          />

          <InfoRow
            icon={FiCalendar}
            label="Received Date"
            value={formatDate(purchase.ReceivedDate)}
          />

          <InfoRow
            icon={FiShield}
            label="Warranty"
            value={
              purchase.expiryWarrantyYear
                ? `${purchase.expiryWarrantyYear} years`
                : "—"
            }
          />
        </div>
      </Section>

      {/* =====================================================
          GUARANTEE / WARRANTY
      ===================================================== */}

      {guaranteePhoto && (
        <Section title="Guarantee / Warranty">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FiShield size={16} />

              <span>Guarantee / Warranty Document</span>
            </div>

            <ImagePreview
              src={guaranteePhoto}
              alt="Guarantee or warranty document"
            />
          </div>
        </Section>
      )}

      {/* =====================================================
          OTHER FILES / IMAGES
      ===================================================== */}

      {otherImages.length > 0 && (
        <Section title="Other Documents & Images">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FiImage size={16} />

            <span>
              {otherImages.length} attachment
              {otherImages.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {otherImages.map((image, index) => {
              
              
              const imageUrl = `${base_url}/uploads/maintenance/${image}`
              if (!imageUrl) {
                return null;
              }

              return (
                <ImagePreview
                  key={image?._id || index}
                  src={imageUrl}
                  alt={`Purchase attachment ${index + 1}`}
                />
              );
            })}
          </div>
        </Section>
      )}

      {/* =====================================================
          RECORD INFORMATION
      ===================================================== */}

      <Section title="Record Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoRow
            icon={FiUser}
            label="Created By"
            value={getUserName(record)}
          />

          <InfoRow
            icon={FiMapPin}
            label="Kitchen"
            value={getKitchenName(record)}
          />

          <InfoRow
            icon={FiClock}
            label="Created At"
            value={formatDateTime(purchase.createdAt || record.createdAt)}
          />

          <InfoRow
            icon={FiClock}
            label="Updated At"
            value={formatDateTime(purchase.updatedAt || record.updatedAt)}
          />
        </div>
      </Section>

      {/* =====================================================
          NOTES
      ===================================================== */}

      {purchase.narration && (
        <Section title="Notes">
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
              {purchase.narration}
            </p>
          </div>
        </Section>
      )}
    </div>
  );
};

export default PurchaseDetails;
