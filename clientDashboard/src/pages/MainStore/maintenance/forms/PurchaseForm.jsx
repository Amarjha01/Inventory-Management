
import React, { useState } from "react";
import { FiPackage, FiX } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";

// Replace this path with your actual kitchens array import.
import kitchens from "../../../../constants/kitchen.js";

const PurchaseForm = ({ onSubmit, onClose, loading = false }) => {
  const today = new Date().toISOString().slice(0, 10);

  const [values, setValues] = useState({
    kitchenId: "",
    purchaseDate: today,
    ReceivedDate: today,
    partName: "",
    quantity: "1",
    partyName: "",
    companyName: "",
    expiryWarrantyYear: "",
  });

  const [guaranteePhoto, setGuaranteePhoto] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtherImages = (e) => {
    const selected = Array.from(e.target.files || []);

    if (otherImages.length + selected.length > 5) {
      setError("Maximum 5 supporting images are allowed.");
      e.target.value = "";
      return;
    }

    setOtherImages((prev) => [...prev, ...selected]);
    setError("");
    e.target.value = "";
  };

  const removeOtherImage = (index) => {
    setOtherImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.kitchenId) {
      setError("Please select a kitchen.");
      return;
    }

    try {
      await onSubmit?.({
        ...values,
        quantity: Number(values.quantity),
        guaranteePhoto,
        otherImages,
      });
    } catch (err) {
      setError(
        err.message || "Failed to save purchase record."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[90vh] w-full max-w-3xl space-y-6 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-black">
            <FiPackage size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black">
              Purchase Record
            </h2>
            <p className="text-sm text-gray-500">
              Track purchased parts, delivery, and warranty.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close purchase form"
          className="absolute right-5 top-5 text-2xl text-gray-500 transition duration-300 hover:rotate-90 hover:text-black"
        >
          <IoMdCloseCircle />
        </button>

        {/* Kitchen Selection */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <Field label="Select Kitchen" required>
            <select
              name="kitchenId"
              value={values.kitchenId}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Choose a kitchen</option>

              {kitchens.map((kitchen) => (
                <option
                  key={kitchen._id}
                  value={kitchen._id}
                >
                  {kitchen.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Purchase Details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Part Name" required>
            <input
              name="partName"
              value={values.partName}
              onChange={handleChange}
              required
              placeholder="Enter part name"
              className={inputClass}
            />
          </Field>

          <Field label="Quantity" required>
            <input
              type="number"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
              required
              min="1"
              step="1"
              className={inputClass}
            />
          </Field>

          <Field label="Purchase Date" required>
            <input
              type="date"
              name="purchaseDate"
              value={values.purchaseDate}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Received Date" required>
            <input
              type="date"
              name="ReceivedDate"
              value={values.ReceivedDate}
              onChange={handleChange}
              required
              min={values.purchaseDate}
              className={inputClass}
            />
          </Field>

          <Field label="Party / Supplier Name" required>
            <input
              name="partyName"
              value={values.partyName}
              onChange={handleChange}
              required
              placeholder="Enter supplier name"
              className={inputClass}
            />
          </Field>

          <Field label="Company Name" required>
            <input
              name="companyName"
              value={values.companyName}
              onChange={handleChange}
              required
              placeholder="Enter manufacturer/company"
              className={inputClass}
            />
          </Field>

          <Field label="Warranty Expiry Year">
            <input
              name="expiryWarrantyYear"
              type="number"
              value={values.expiryWarrantyYear}
              onChange={handleChange}
              placeholder="e.g. 2028"
              min="1900"
              max="9999"
              className={inputClass}
            />
          </Field>
        </div>

        {/* Warranty Document */}
        <div className="space-y-2">
          <Field label="Guarantee / Warranty Document">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) =>
                setGuaranteePhoto(
                  e.target.files?.[0] || null
                )
              }
              className={fileInputClass}
            />
          </Field>

          {guaranteePhoto && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <span className="truncate text-sm text-gray-700">
                {guaranteePhoto.name}
              </span>

              <button
                type="button"
                onClick={() => setGuaranteePhoto(null)}
                aria-label="Remove warranty document"
                className="ml-3 text-gray-500 transition hover:text-black"
              >
                <FiX size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Supporting Images */}
        <div className="space-y-2">
          <Field label="Other Supporting Images (Maximum 5)">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={otherImages.length >= 5}
              onChange={handleOtherImages}
              className={fileInputClass}
            />
          </Field>

          {otherImages.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span className="truncate text-sm text-gray-700">
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => removeOtherImage(index)}
                aria-label={`Remove ${file.name}`}
                className="ml-3 text-gray-500 transition hover:text-black"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}

          <p className="text-xs text-gray-500">
            {otherImages.length} of 5 supporting images selected
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium text-black"
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : "Save Purchase Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Input Styles
const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200";

const fileInputClass =
  "block w-full cursor-pointer text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium file:text-black transition hover:file:bg-gray-200";

// Reusable Field Component
const Field = ({ label, required, children }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-gray-700">
      {label}
      {required && (
        <span className="ml-1 text-black">*</span>
      )}
    </span>

    {children}
  </label>
);

export default PurchaseForm;
