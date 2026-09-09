import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiEdit2,
  FiFileText,
  FiPackage,
  FiPhone,
  FiTool,
  FiTrash2,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import {
  DetailItem,
  RecordImages,
  formatDate,
} from "./MaintenanceCommon";

const TYPES = {
  SERVICE: "service",
  VISITOR: "visitor",
  PURCHASE: "purchase",
};

const MaintenanceRecordCard = ({
  record,
  type,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const getTitle = () => {
    if (type === TYPES.SERVICE) {
      return record.partName;
    }

    if (type === TYPES.VISITOR) {
      return record.visitorName;
    }

    return record.companyName;
  };

  const getSubtitle = () => {
    if (type === TYPES.SERVICE) {
      return record.partyName;
    }

    if (type === TYPES.VISITOR) {
      return record.reason;
    }

    return record.partyName;
  };

  const getDate = () => {
    if (type === TYPES.SERVICE) {
      return record.serviceDate;
    }

    if (type === TYPES.VISITOR) {
      return record.problemDate;
    }

    return record.purchaseDate;
  };

  const Icon =
    type === TYPES.SERVICE
      ? FiTool
      : type === TYPES.VISITOR
        ? FiUser
        : FiPackage;

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 8,
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
        overflow-hidden
        rounded-2xl
        border
        border-(--theme-border)
        bg-(--theme-surface)
        shadow-sm
      "
    >
      {/* HEADER */}

      <button
        type="button"
        onClick={onToggle}
        className="
          flex
          w-full
          items-center
          gap-3
          p-4
          text-left
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-(--theme-primary)/10
            text-(--theme-primary)
          "
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-(--theme-text)">
            {getTitle()}
          </p>

          <p className="mt-0.5 truncate text-xs text-(--theme-text-muted)">
            {getSubtitle()}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-medium text-(--theme-text-muted)">
            {formatDate(getDate())}
          </p>

          <div className="mt-1 flex justify-end">
            {expanded ? (
              <FiChevronUp
                size={15}
                className="text-(--theme-text-muted)"
              />
            ) : (
              <FiChevronDown
                size={15}
                className="text-(--theme-text-muted)"
              />
            )}
          </div>
        </div>
      </button>

      {/* DETAILS */}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="overflow-hidden"
          >
            <div
              className="
                border-t
                border-(--theme-border)
                px-4
                pb-4
                pt-4
              "
            >
              {type === TYPES.SERVICE && (
                <ServiceDetails record={record} />
              )}

              {type === TYPES.VISITOR && (
                <VisitorDetails record={record} />
              )}

              {type === TYPES.PURCHASE && (
                <PurchaseDetails record={record} />
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onEdit}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-(--theme-border)
                    px-3
                    py-2.5
                    text-xs
                    font-medium
                    text-(--theme-text)
                    transition
                    hover:bg-(--theme-muted)
                  "
                >
                  <FiEdit2 size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={onDelete}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-3
                    py-2.5
                    text-xs
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-100
                  "
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ============================================================
   SERVICE DETAILS
============================================================ */

const ServiceDetails = ({
  record,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <DetailItem
          label="Part Name"
          value={record.partName}
          icon={FiTool}
        />

        <DetailItem
          label="Party"
          value={record.partyName}
          icon={FiTruck}
        />

        <DetailItem
          label="Service Date"
          value={formatDate(record.serviceDate)}
          icon={FiCalendar}
        />

        <DetailItem
          label="Next Service"
          value={formatDate(record.nextServiceDate)}
          icon={FiClock}
        />
      </div>

      {record.narration && (
        <DetailItem
          label="Narration"
          value={record.narration}
          icon={FiFileText}
        />
      )}

      {record.images?.length > 0 && (
        <RecordImages
          images={record.images}
          title="Service Images"
        />
      )}
    </div>
  );
};

/* ============================================================
   VISITOR DETAILS
============================================================ */

const VisitorDetails = ({
  record,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <DetailItem
          label="Problem Date"
          value={formatDate(record.problemDate)}
          icon={FiCalendar}
        />

        <DetailItem
          label="Visitor"
          value={record.visitorName}
          icon={FiUser}
        />

        <DetailItem
          label="Phone"
          value={record.phoneNumber}
          icon={FiPhone}
        />

        <DetailItem
          label="Reason"
          value={record.reason}
          icon={FiFileText}
        />
      </div>

      {record.narration && (
        <DetailItem
          label="Part Changes / Narration"
          value={record.narration}
          icon={FiTool}
        />
      )}
    </div>
  );
};

/* ============================================================
   PURCHASE DETAILS
============================================================ */

const PurchaseDetails = ({
  record,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <DetailItem
          label="Purchase Date"
          value={formatDate(record.purchaseDate)}
          icon={FiCalendar}
        />

        <DetailItem
          label="Party"
          value={record.partyName}
          icon={FiTruck}
        />

        <DetailItem
          label="Company"
          value={record.companyName}
          icon={FiPackage}
        />

        <DetailItem
          label="Warranty / Expiry"
          value={record.expiryWarrantyYear}
          icon={FiClock}
        />
      </div>

      {record.guaranteePhoto && (
        <RecordImages
          images={[record.guaranteePhoto]}
          title="Guarantee / Warranty"
        />
      )}

      {record.otherImages?.length > 0 && (
        <RecordImages
          images={record.otherImages}
          title="Other Image"
        />
      )}
    </div>
  );
};

export default MaintenanceRecordCard;