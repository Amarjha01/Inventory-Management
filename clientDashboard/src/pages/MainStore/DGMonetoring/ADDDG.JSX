import React, { useState } from "react";

const AddDG = ({ kitchenId, onSuccess }) => {
  const [formData, setFormData] = useState({
    kitchenId: kitchenId || "",
    DGID: "",
    DGModel: "",
    voltage: "",
    SRNO: "",
    KVA: "",
    phase: "",
    current: "",
    fuelConsumptionHr: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        DGID: Number(formData.DGID),
        voltage: formData.voltage ? Number(formData.voltage) : undefined,
        KVA: formData.KVA ? Number(formData.KVA) : undefined,
        current: formData.current ? Number(formData.current) : undefined,
        fuelConsumptionHr: formData.fuelConsumptionHr
          ? Number(formData.fuelConsumptionHr)
          : undefined,
      };

      const response = await fetch("/api/dg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add DG");
      }

      alert("DG added successfully");

      if (onSuccess) {
        onSuccess(data);
      }

      setFormData({
        kitchenId: kitchenId || "",
        DGID: "",
        DGModel: "",
        voltage: "",
        SRNO: "",
        KVA: "",
        phase: "",
        current: "",
        fuelConsumptionHr: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Add New DG
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter the generator details below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Kitchen ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kitchen ID
          </label>

          <input
            type="text"
            name="kitchenId"
            value={formData.kitchenId}
            onChange={handleChange}
            required
            disabled={!!kitchenId}
            placeholder="Kitchen ID"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />
        </div>

        {/* DG ID + Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DG ID *
            </label>

            <input
              type="number"
              name="DGID"
              value={formData.DGID}
              onChange={handleChange}
              required
              placeholder="e.g. 1"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DG Model
            </label>

            <input
              type="text"
              name="DGModel"
              value={formData.DGModel}
              onChange={handleChange}
              placeholder="e.g. Cummins C100"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Voltage + KVA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voltage (V)
            </label>

            <input
              type="number"
              name="voltage"
              value={formData.voltage}
              onChange={handleChange}
              placeholder="e.g. 415"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (KVA)
            </label>

            <input
              type="number"
              name="KVA"
              value={formData.KVA}
              onChange={handleChange}
              placeholder="e.g. 125"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Serial Number + Phase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serial Number
            </label>

            <input
              type="text"
              name="SRNO"
              value={formData.SRNO}
              onChange={handleChange}
              placeholder="DG serial number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phase
            </label>

            <select
              name="phase"
              value={formData.phase}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="">Select Phase</option>
              <option value="Single Phase">Single Phase</option>
              <option value="Three Phase">Three Phase</option>
            </select>
          </div>
        </div>

        {/* Current + Fuel Consumption */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current (A)
            </label>

            <input
              type="number"
              name="current"
              value={formData.current}
              onChange={handleChange}
              placeholder="e.g. 175"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Consumption / Hr
            </label>

            <input
              type="number"
              name="fuelConsumptionHr"
              value={formData.fuelConsumptionHr}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding DG..." : "Add New DG"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDG;
