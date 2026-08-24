import React from "react";

const REQUIREMENT_TYPES = [
  {
    value: "RM",
    label: "Raw Material",
    hindiLabel: "रसोई का सामान",
    image: "/ui/type/RM.png",
  },
  // {
  //   value: "MAINTENANCE",
  //   label: "Maintenance",
  //   hindiLabel: "मरम्मत",
  //   image: "/ui/type/MAINTENANCE.png",
  // },
  {
    value: "BARTAN",
    label: "Bartan",
    hindiLabel: "बर्तन",
    image: "/ui/type/BARTAN.png",
  },
  {
    value: "STATIONERY",
    label: "Stationery",
    hindiLabel: "लेखन सामग्री",
    image: "/ui/type/STATIONERY.png",
  },
];

const RequirementTypeSelector = ({ value, onChange, disabled = false }) => {
  return (
    <div className="">
      {/* ================= HEADING ================= */}
      <div className="mb-2 px-0.5">
        <p className="mt-0.5 font-medium text-[10px] text-gray-500 sm:text-[11px]">
          Select the type of requirement you want to create
        </p>
      </div>

      {/* ================= SLIDER ================= */}
      <div
        className="
         overflow-y-hidden
          flex
          items-center
          w-full
          h-16
          gap-2
          overflow-x-auto
         
          snap-x
          snap-mandatory
          scrollbar-none
          sm:grid
          sm:grid-cols-4
          sm:overflow-visible
        "
      >
        {REQUIREMENT_TYPES.map((type) => {
          const selected = value === type.value;

          return (
            <button
              key={type.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(type.value)}
              className={`
                group
                relative
                flex
                h-14.5
                min-w-38.75
                shrink-0
                snap-start
                items-center
                gap-2
                rounded-xl
                border
                pl-3
                text-left
                transition-all
                duration-200
                shadow-2xs
                shadow-purple-300/30
                sm:h-17
                sm:min-w-0

                ${
                  selected
  ? `
    border-[var(--theme-selected-border)]
    bg-[var(--theme-primary-light)]
    shadow-[0_3px_10px_rgba(0,0,0,0.08)]
    ring-1
    ring-[var(--theme-selected-border)]
  `
  : `
    border-[var(--theme-border)]
    bg-[var(--theme-surface)]
    hover:border-[var(--theme-primary)]
  `
                }

                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              `}
            >
              {/* ================= CHECK ================= */}
             {selected && (
  <div
    className="
      absolute
      right-1.5
      top-1.5
      flex
      h-4
      w-4
      items-center
      justify-center
      rounded-full
      bg-[var(--theme-primary)]
      text-[9px]
      font-bold
      text-white
    "
  >
    ✓
  </div>
)}

             {/* ================= IMAGE ================= */}
<div
  className={`
    flex
    h-full
    w-10
    pl-3
    shrink-0
    items-center
    justify-center
    transition-transform
    duration-200
    overflow-hidden
    sm:h-24
    sm:w-24

   
  `}
>
  <img
    src={type.image}
    alt={type.label}
    className="
    overflow-hidden
      absolute
      h-full
      object-contain
      drop-shadow-[0_3px_4px_rgba(0,0,0,0.12)]
    "
  />
</div>

              {/* ================= TEXT ================= */}
              <div className="min-w-[55%]">
                <h3
  className={`
    truncate
    text-[11px]
    font-bold
    leading-tight
    text-center
    sm:text-[12px]

    ${
      selected
        ? "text-[var(--theme-primary)]"
        : "text-[var(--theme-text)]"
    }
  `}
>
  {type.label}
</h3>

               <p
  className={`
    mt-0.5
    truncate
    text-[10px]
    leading-tight
    text-center
    sm:text-[11px]

    ${
      selected
        ? "text-[var(--theme-primary)]"
        : "text-[var(--theme-text-secondary)]"
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

      {/* ================= MOBILE INDICATOR ================= */}
      <div className="mt-1 flex justify-center gap-1 sm:hidden">
        {REQUIREMENT_TYPES.map((type) => (
          <div
            key={type.value}
            className={`
              h-1 rounded-full transition-all duration-200
              ${value === type.value ? "w-4 bg-[#7657e8]" : "w-1 bg-gray-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default RequirementTypeSelector;
