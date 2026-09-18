import React, { useState } from "react";

import {
  FiChevronDown,
  FiChevronRight,
  FiTool,
  FiUsers,
  FiShoppingBag,
} from "react-icons/fi";
import { FaFolder , FaFolderOpen} from "react-icons/fa";
const RECORD_TYPES = {
  SERVICE: "service",
  VISITOR: "visitor",
  PURCHASE: "purchase",
};

const MaintenanceSideBar = ({
  kitchens,
  selectedKitchen,
  selectedType,
  onKitchenSelect,
  onTypeSelect,
}) => {
  const [expandedKitchen, setExpandedKitchen] =
    useState(selectedKitchen?._id);

  const recordTypes = [
    {
      id: RECORD_TYPES.SERVICE,
      label: "Service",
      hindiLabel: "सर्विस",
      icon: FiTool,
    },
    {
      id: RECORD_TYPES.VISITOR,
      label: "Visitor",
      hindiLabel: "विजिटर",
      icon: FiUsers,
    },
    {
      id: RECORD_TYPES.PURCHASE,
      label: "Purchase Record",
      hindiLabel: "परचेज रिकॉर्ड",
      icon: FiShoppingBag,
    },
  ];

  const handleKitchenClick = (kitchen) => {
    const kitchenId =
      kitchen._id || kitchen.id;

    const isSame =
      expandedKitchen === kitchenId;

    setExpandedKitchen(
      isSame ? null : kitchenId
    );

    onKitchenSelect(kitchen);

    /*
     * Automatically open Service when
     * changing kitchen.
     */
    if (!isSame) {
      onTypeSelect(RECORD_TYPES.SERVICE);
    }
  };

  return (
    <aside className="w-72 md:max-h-[450px] shrink-0 border-r border-slate-200 bg-white overflow-hidden">
      <div className="sticky top-0 h-screen overflow-y-auto">

        {/* Header */}
        <div className="border-b border-slate-200 px-5 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
              <FiTool
                size={19}
                className="text-white"
              />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Maintenance
              </h2>

              <p className="text-xs text-slate-400">
                मेंटेनेंस
              </p>
            </div>

          </div>

        </div>

        {/* Kitchens */}
        <div className="p-3">

          <div className="mb-2 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Kitchens / किचन
            </p>
          </div>

          <div className="space-y-1 md:max-h-[300px] overflow-y-scroll">

            {kitchens.map((kitchen) => {

              const kitchenId =
                kitchen._id || kitchen.id;

              const isExpanded =
                expandedKitchen === kitchenId;

              const isSelected =
                selectedKitchen &&
                (selectedKitchen._id ||
                  selectedKitchen.id) ===
                  kitchenId;
                    const FolderIcon = isSelected ? FaFolderOpen : FaFolder;
              return (
                <div key={kitchenId}>

                  {/* Kitchen */}
                  <button
                    type="button"
                    onClick={() =>
                      handleKitchenClick(kitchen)
                    }
                    className={`
                      flex w-full items-center gap-3
                      rounded-xl px-3 py-3
                      text-left transition
                      ${
                        isSelected
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >

                    <FolderIcon
                      size={18}
                      className={
                        isSelected
                          ? "text-slate-900"
                          : "text-slate-400"
                      }
                    />

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold">
                        {kitchen.name}
                      </p>

                      {kitchen.hindiName && (
                        <p className="truncate text-[11px] text-slate-400">
                          {kitchen.hindiName}
                        </p>
                      )}

                    </div>

                    {isExpanded ? (
                      <FiChevronDown size={16} />
                    ) : (
                      <FiChevronRight size={16} />
                    )}

                  </button>

                  {/* Categories */}
                  {isExpanded && (
                    <div className="ml-5 mt-1 border-l border-slate-200 pl-3">

                      {recordTypes.map((type) => {

                        const Icon = type.icon;

                        const isActive =
                          isSelected &&
                          selectedType === type.id;

                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                              onKitchenSelect(
                                kitchen
                              );

                              onTypeSelect(
                                type.id
                              );
                            }}
                            className={`
                              flex w-full items-center
                              gap-3 rounded-lg
                              px-3 py-2.5
                              text-left transition
                              ${
                                isActive
                                  ? "bg-slate-900 text-white"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                              }
                            `}
                          >

                            <Icon size={16} />

                            <div>
                              <p className="text-xs font-medium">
                                {type.label}
                              </p>

                              <p
                                className={`
                                  text-[10px]
                                  ${
                                    isActive
                                      ? "text-slate-300"
                                      : "text-slate-400"
                                  }
                                `}
                              >
                                {type.hindiLabel}
                              </p>
                            </div>

                          </button>
                        );
                      })}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </div>

      </div>
    </aside>
  );
};

export default MaintenanceSideBar;