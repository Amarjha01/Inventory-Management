import React, { useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";

const VisitorForm = ({ onSubmit, onClose, loading = false }) => {
  const [values, setValues] = useState({
    problemDate: new Date().toISOString().slice(0, 10),
    visitorName: "",
    phoneNumber: "",
    reason: "",
    status: "PENDING",
    narration: "",
    feedbackMessage: "",
  });

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
        otherImages: images,
        // The backend should set sentBy from the authenticated user.
        feedbackMessage: values.feedbackMessage.trim(),
      });
    } catch (err) {
      setError(err.message || "Failed to save visitor record.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-5">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[90vh] w-full max-w-3xl space-y-6 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="pr-10">
          <h2 className="text-lg font-semibold text-black">
            Visitor / Problem Record
          </h2>
          <p className="text-sm text-gray-500">
            Record complaints, visitors, and work updates.
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close visitor form"
          className="absolute right-5 top-5 text-2xl text-gray-500 transition duration-300 hover:rotate-90 hover:text-black"
        >
          <IoMdCloseCircle />
        </button>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Problem Date" required>
            <input
              type="date"
              name="problemDate"
              value={values.problemDate}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </Field>

          <Field label="Visitor Name" required>
            <input
              name="visitorName"
              value={values.visitorName}
              onChange={handleChange}
              required
              placeholder="Enter visitor name"
              className={inputClass}
            />
          </Field>

          <Field label="Phone Number" required>
            <input
              type="tel"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              required
              maxLength={15}
              placeholder="Enter contact number"
              className={inputClass}
            />
          </Field>

          <Field label="Status" required>
            <select
              name="status"
              value={values.status}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </Field>
        </div>

        {/* Reason / Problem */}
        <Field label="Reason / Problem" required>
          <textarea
            name="reason"
            value={values.reason}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe the issue or reason for visit..."
            className={`${inputClass} resize-y`}
          />
        </Field>

        {/* Work Done */}
        <Field label="Work Done / Narration">
          <textarea
            name="narration"
            value={values.narration}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the resolution or parts changed..."
            className={`${inputClass} resize-y`}
          />
        </Field>

        {/* Supporting Images */}
        <div className="space-y-3">
          <Field label="Supporting Images (Maximum 5)">
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
                  {images.length}/5 images · JPG, PNG, or WebP
                </p>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="user"
                multiple
                disabled={images.length >= 5}
                onChange={handleImages}
                className="hidden"
              />
            </label>
          </Field>

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
                onClick={() => removeImage(index)}
                aria-label={`Remove ${file.name}`}
                className="ml-3 shrink-0 rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-black"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Saving..." : "Save Visitor Record"}
          </button>
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

const ErrorMessage = ({ children }) => (
  <p
    role="alert"
    className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-black"
  >
    {children}
  </p>
);

export default VisitorForm;
