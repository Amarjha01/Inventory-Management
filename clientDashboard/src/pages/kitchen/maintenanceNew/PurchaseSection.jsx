import { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiPackage,
  FiTruck,
  FiShoppingBag,
  FiX,
  FiSave,
  FiLoader,
} from "react-icons/fi";

import {
  Input,
  ImageSection,
  SingleImageField,
} from "../../../components/shared/MaintenanceCommon.jsx";

const PurchaseSection = ({
  form,
  onChange,

  onGuaranteeCamera,
  onGuaranteeFile,
  onRemoveGuarantee,

  onOtherCamera,
  onOtherFiles,
  onRemoveOther,

  onCancel,
  onSubmit,
}) => {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      await onSubmit(event);
    } catch (error) {
      console.error("Purchase submission failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (saving) return;

    setSaving(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <FiShoppingBag size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Purchase Details
              </h2>

              <p className="text-xs text-gray-500">
                Add or update purchase information
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={21} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Scrollable Content */}
          <div className={`flex-1 overflow-y-auto px-5 py-5 ${saving ? "pointer-events-none opacity-70" : ""}`}>
            <div className="space-y-5">
              {/* Part Name */}
              <Input
                label="Part Name / पार्ट का नाम"
                name="partName"
                placeholder="Part Name / पार्ट का नाम"
                value={form.partName}
                onChange={onChange}
                icon={FiPackage}
              />

              {/* Quantity */}
              <Input
                label="Quantity / मात्रा"
                name="quantity"
                type="number"
                min="1"
                placeholder="Quantity / मात्रा"
                value={form.quantity}
                onChange={onChange}
                icon={FiPackage}
              />

              {/* Purchase Date */}
              <Input
                label="Purchase Date / परचेज डेट"
                name="purchaseDate"
                type="date"
                value={form.purchaseDate}
                onChange={onChange}
                icon={FiCalendar}
              />

              {/* Received Date */}
              <Input
                label="Received Date / प्राप्त डेट"
                name="ReceivedDate"
                type="date"
                value={form.ReceivedDate}
                onChange={onChange}
                icon={FiCalendar}
              />

              {/* Party Name */}
              <Input
                label="Party Name / पार्टी नेम"
                name="partyName"
                value={form.partyName}
                onChange={onChange}
                placeholder="Supplier / party name / सप्लायर / पार्टी नेम"
                icon={FiTruck}
              />

              {/* Company Name */}
              <Input
                label="Company Name / कंपनी नेम"
                name="companyName"
                value={form.companyName}
                onChange={onChange}
                placeholder="Manufacturer / company / मैन्युफैक्चरर / कंपनी"
                icon={FiPackage}
              />

              {/* Guarantee / Warranty */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-(--theme-text)">
                  Guarantee / Warranty / गारंटी / वारंटी
                </label>

                <select
                  name="guaranteeWarrantyType"
                  value={form.guaranteeWarrantyType}
                  onChange={onChange}
                  disabled={saving}
                  className="h-11 w-full rounded-xl border border-(--theme-border) bg-(--theme-background) px-3 text-sm text-(--theme-text) outline-none transition focus:border-(--theme-primary) focus:ring-2 focus:ring-(--theme-primary)/10 disabled:cursor-not-allowed"
                >
                  <option value="">Select / चुनें</option>
                  <option value="guarantee">Guarantee / गारंटी</option>
                  <option value="warranty">Warranty / वारंटी</option>
                </select>
              </div>

              {/* Duration */}
              {form.guaranteeWarrantyType && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Duration / अवधि"
                    name="guaranteeWarrantyDuration"
                    type="number"
                    min="1"
                    value={form.guaranteeWarrantyDuration}
                    onChange={onChange}
                    placeholder="e.g. 2"
                    icon={FiClock}
                  />

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-(--theme-text)">
                      Unit / यूनिट
                    </label>

                    <select
                      name="guaranteeWarrantyUnit"
                      value={form.guaranteeWarrantyUnit}
                      onChange={onChange}
                      disabled={saving}
                      className="h-11 w-full rounded-xl border border-(--theme-border) bg-(--theme-background) px-3 text-sm text-(--theme-text) outline-none transition focus:border-(--theme-primary) focus:ring-2 focus:ring-(--theme-primary)/10 disabled:cursor-not-allowed"
                    >
                      <option value="years">Years / साल</option>
                      <option value="months">Months / महीने</option>
                      <option value="days">Days / दिन</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Guarantee / Warranty Photo */}
              <SingleImageField
                title="Guarantee / Warranty Photo / गारंटी / वारंटी फोटो"
                subtitle="Optional / ऑप्शनल"
                image={form.guaranteePhoto}
                onCamera={onGuaranteeCamera}
                onFiles={onGuaranteeFile}
                onRemove={onRemoveGuarantee}
              />

              {/* Other Images */}
              <ImageSection
                title="Other Images / अदर इमेज"
                subtitle="Invoice, product image or other document / इनवॉइस, प्रोडक्ट इमेज या कोई अन्य डॉक्यूमेंट"
                images={form.otherImages}
                maxImages={5}
                onCamera={onOtherCamera}
                onFiles={onOtherFiles}
                onRemove={onRemoveOther}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Save */}
            <button
              type="submit"
              disabled={saving}
              className="flex min-w-[105px] items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <FiLoader size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseSection;
