import React from "react";

const Maintenance = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label
        htmlFor="maintenance"
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        Maintenance Requirement
      </label>

      <input
        id="maintenance"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter maintenance requirement..."
        className="
          w-full
          px-4
          py-3
          border
          border-gray-300
          rounded-xl
          outline-none
          transition
          focus:border-teal-500
          focus:ring-4
          focus:ring-teal-500/10
        "
      />
    </div>
  );
};

export default Maintenance;