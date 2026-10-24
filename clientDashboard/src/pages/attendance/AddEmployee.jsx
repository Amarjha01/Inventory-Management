
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import FaceEnrollment from "../../components/shared/attendance/FaceEnrollment.jsx";
import { createEmployeeWithFace } from "../../services/attendance.service";

const INITIAL_FORM = {
  name: "",
  phone: "",
  employeeCode: "",
  role: "Kitchen Incharge",
  kitchenId: "",
  biometricConsent: false,
};

const ROLES = [
  "Kitchen Incharge",
  "Store Incharge",
  "Production Incharge",
];

const AddEmployee = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [enrollment, setEnrollment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "biometricConsent" && !checked) {
      setEnrollment(null);
    }

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEnrollmentReady = (result) => {
    if (!form.biometricConsent) {
      toast.error("Obtain employee consent before enrolling their face.");
      setEnrollment(null);
      return;
    }

    setEnrollment(result);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Enter the employee's name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      toast.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!form.kitchenId.trim()) {
      toast.error("Enter the assigned kitchen or location ID.");
      return;
    }

    if (!form.biometricConsent) {
      toast.error("Employee consent is required for face enrollment.");
      return;
    }

    if (!enrollment?.descriptor?.length) {
      toast.error("Capture and validate the employee's face first.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        employeeCode: form.employeeCode.trim() || undefined,
        role: form.role,
        kitchenId: form.kitchenId.trim(),
        biometricConsent: true,
        faceEnrollment: {
          descriptor: enrollment.descriptor,
          descriptorDimensions: enrollment.descriptorDimensions,
          modelVersion: enrollment.modelVersion,
          quality: enrollment.quality,
        },
      };

      await createEmployeeWithFace(payload);

      toast.success("Employee enrolled successfully.");
      navigate("/attendance");
    } catch (error) {
      console.error("Employee enrollment failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Employee enrollment failed. Check the backend API."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 pb-24 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <button
            type="button"
            onClick={() => navigate("/attendance")}
            className="mb-3 text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Back to attendance
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Add employee
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register employee details and create a face-recognition
            enrollment for attendance.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Employee details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full name *
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  autoComplete="name"
                  required
                  maxLength={120}
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Employee name"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mobile number *
                </span>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="10-digit mobile number"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Employee code
                </span>

                <input
                  name="employeeCode"
                  value={form.employeeCode}
                  onChange={updateField}
                  maxLength={50}
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500"
                  placeholder="Optional employee ID"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Employee role *
                </span>

                <select
                  name="role"
                  value={form.role}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Assigned kitchen / location ID *
                </span>

                <input
                  name="kitchenId"
                  value={form.kitchenId}
                  onChange={updateField}
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500"
                  placeholder="Enter the existing kitchen or location ID"
                />

                <span className="mt-1 block text-xs text-slate-500">
                  This is a temporary text field. Replace it with
                  your actual kitchen selector when your kitchen API
                  is available.
                </span>
              </label>
            </div>
          </section>

          {/* Consent is requested before biometric enrollment. */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="biometricConsent"
                checked={form.biometricConsent}
                onChange={updateField}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />

              <span className="text-sm text-slate-700">
                <strong>Employee biometric consent *</strong>

                <span className="mt-1 block">
                  The employee has been informed that their face
                  descriptor will be processed and stored for attendance
                  recognition, how it will be used, who can access it,
                  and how to request deletion. An alternative attendance
                  method must be available if the employee declines.
                </span>
              </span>
            </label>
          </section>

          {form.biometricConsent ? (
            <FaceEnrollment
              onEnrollmentReady={handleEnrollmentReady}
            />
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-600">
                Confirm employee consent before starting face enrollment.
                An alternative attendance method should be available
                if consent is declined.
              </p>
            </section>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {enrollment
                ? "Face descriptor ready for submission."
                : "Complete face enrollment before saving."}
            </p>

            <button
              type="submit"
              disabled={
                submitting ||
                !enrollment ||
                !form.biometricConsent
              }
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving employee…" : "Save employee"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddEmployee;
