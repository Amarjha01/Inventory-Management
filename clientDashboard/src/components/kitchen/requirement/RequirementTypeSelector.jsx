import React from "react";

const REQUIREMENT_TYPES = [
  {
    value: "RM",
    label: "Raw Material",
    hindiLabel: "रसोई का सामान",
    image: "/itemType/RM.avif",
  },
  {
    value: "MAINTENANCE",
    label: "Maintenance",
    hindiLabel: "मरम्मत",
    image: "/itemType/Maintenance.avif",
  },
  {
    value: "BARTAN",
    label: "Bartan",
    hindiLabel: "बर्तन",
    image: "/itemType/Utensils.avif",
  },
];

const RequirementTypeSelector = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Requirement Type ( आवश्यकता के प्रकार )
      </label>

      <div className=" gap-2 flex justify-center items-center sm:w-96">
        {REQUIREMENT_TYPES.map((type) => {
          const selected = value === type.value;

          return (
            <button
              key={type.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(type.value)}
              className={`relative overflow-hidden rounded-xl border text-left transition-all duration-200 w-full flex flex-col items-center py-1
                ${
                  selected
                    ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-500"
                    : "border-gray-200 bg-amber-50 hover:border-teal-300 hover:shadow-md"
                }
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              {/* Selected indicator */}
              {selected && (
                <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                  ✓
                </div>
              )}
                 {/* Image */}
              <div className="h-20 w-20 flex items-center justify-center">
                <img
                  src={type.image}
                  alt={type.label}
                  className="w-full h-full object-cover rounded-xl "
                />
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className={`text-sm font-semibold  ${!selected ? "text-gray-800" : "text-white"}`}>
                  {type.label}
                </h3>

                <p className={`text-xs mt-0.5 ${!selected ? "text-gray-800" : "text-white"}`}>
                  {type.hindiLabel}
                </p>
              </div>
             
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RequirementTypeSelector;