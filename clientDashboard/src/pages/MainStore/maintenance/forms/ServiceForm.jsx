import React, { useState } from "react";
import { FiImage, FiTool, FiX } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";

const initialValues = {
  partName: "",
  serviceDate: new Date().toISOString().slice(0, 10),
  partyName: "",
  nextServiceDate: "",
  narration: "",
};

const ServiceForm = ({ onSubmit, onClose, loading = false }) => {
  const [values, setValues] = useState(initialValues);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImages = (e) => {
    const selected = Array.from(e.target.files || []);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (images.length + selected.length > 5) {
      setError("Maximum 5 images are allowed.");
      e.target.value = "";
      return;
    }

    const invalidFiles = selected.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...selected]);
    setError("");
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await onSubmit?.({
        ...values,
        nextServiceDate: values.nextServiceDate || null,
        images,
      });
    } catch (err) {
      setError(err.message || "Failed to save service record.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-5">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[90vh] w-full max-w-3xl space-y-6 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="flex items-center gap-3 pr-10">
          <div className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-black">
            <FiTool size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black">
              Service Record
            </h2>
            <p className="text-sm text-gray-500">
              Record maintenance and service details.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close service form"
          className="absolute right-5 top-5 text-2xl text-gray-500 transition duration-300 hover:rotate-90 hover:text-black"
        >
          <IoMdCloseCircle />
        </button>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Part Name" required>
            <input
              name="partName"
              value={values.partName}
              onChange={handleChange}
              placeholder="e.g. Generator filter"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Party / Service Provider" required>
            <input
              name="partyName"
              value={values.partyName}
              onChange={handleChange}
              placeholder="Enter service provider"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Service Date" required>
            <input
              type="date"
              name="serviceDate"
              value={values.serviceDate}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Next Service Date">
            <input
              type="date"
              name="nextServiceDate"
              value={values.nextServiceDate}
              onChange={handleChange}
              min={values.serviceDate}
              className={inputClass}
            />
          </Field>
        </div>

        {/* Narration */}
        <Field label="Narration / Work Done">
          <textarea
            name="narration"
            value={values.narration}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the service, parts replaced, and observations..."
            className={`${inputClass} resize-y`}
          />
        </Field>

        {/* Image Upload */}
        <ImagePicker
          images={images}
          onSelect={handleImages}
          onRemove={removeImage}
        />

        {/* Error Message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>

          <SubmitButton loading={loading}>
            Save Service Record
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200";

const Field = ({ label, required, children }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-black">*</span>}
    </span>
    {children}
  </label>
);

const ImagePicker = ({ images, onSelect, onRemove }) => (
  <div className="space-y-3">
    <label
      className={`flex items-center gap-3 rounded-xl border border-dashed border-gray-400 bg-white p-4 transition hover:border-black hover:bg-gray-50 ${
        images.length >= 5
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >
      <FiImage size={22} className="shrink-0 text-black" />

      <div>
        <p className="text-sm font-medium text-black">
          Upload images
        </p>
        <p className="text-xs text-gray-500">
          {images.length}/5 images uploaded · JPG, PNG, or WebP
        </p>
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onSelect}
        disabled={images.length >= 5}
        className="hidden"
      />
    </label>

    {images.length > 0 && (
      <div className="space-y-2">
        {images.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <FiImage
                size={17}
                className="shrink-0 text-gray-500"
              />
              <span className="truncate text-sm text-gray-700">
                {file.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${file.name}`}
              className="shrink-0 rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-black"
            >
              <FiX size={18} />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ErrorMessage = ({ children }) => (
  <p
    role="alert"
    className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-black"
  >
    {children}
  </p>
);

const SubmitButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
  >
    {loading ? "Saving..." : children}
  </button>
);

export default ServiceForm;
