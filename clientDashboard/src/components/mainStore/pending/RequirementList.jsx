import React from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClipboard,
  FiUser,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";

const RequirementList = ({
  requirements = [],
  selectedRequirement,
  onSelect,
}) => {
  if (!requirements.length) {
    return (
      <div className="py-6 text-center">
        <FiClipboard className="mx-auto mb-2 text-3xl text-gray-300" />
        <h3 className="text-sm font-semibold text-gray-700">
          No Undispatched Requirements
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          There is no pending requirement for this kitchen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requirements.map((requirement) => {
        const isSelected = selectedRequirement === requirement._id;

        return (
          <motion.button
            key={requirement._id}
            type="button"
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(requirement)}
            className={`w-full rounded-lg border px-3 py-2.5 text-left transition-all ${
              isSelected
                ? "border-[#181e53] bg-[#181e53]/5 ring-1 ring-[#181e53]/10"
                : "border-gray-200 bg-white hover:border-[#181e53]/40 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="flex items-center gap-1.5">
                  <FiClipboard className="shrink-0 text-sm text-[#181e53]" />

                  <span className="truncate text-sm font-semibold text-gray-800">
                    {requirement.requirementNumber}
                  </span>
                </div>

                {/* Compact Metadata */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiPackage />
                    {requirement.totalItems}{" "}
                    {requirement.totalItems === 1 ? "item" : "items"}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiUser />
                    {requirement.createdBy?.name || "Unknown"}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiCalendar />
                    {new Date(requirement.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>

              {/* Selection */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-[#181e53] bg-[#181e53]"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <FiCheckCircle className="text-white" size={12} />
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default RequirementList;
