import React from "react";
import {
  FiCalendar,
  FiClock,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

import {
  ImageSection,
  Input,
  SingleImageField,
} from "../../../components/shared/MaintenanceCommon";

const PurchaseSection = ({
  form,
  onChange,

  onGuaranteeCamera,
  onGuaranteeFile,
  onRemoveGuarantee,

  onOtherCamera,
  onOtherFiles,
  onRemoveOther,
}) => {
  return (
    <div className="space-y-4">
      <Input
        label="Part Name / पार्ट का नाम"
        name="partName"
        placeholder="Part Name / पार्ट का नाम"
        value={form.partName}
        onChange={onChange}
        icon={FiPackage}
      />
      <Input
        label="Purchase Date / परचेज डेट"
        name="purchaseDate"
        type="date"
        value={form.purchaseDate}
        onChange={onChange}
        icon={FiCalendar}
      />

      <Input
        label="Received Date / प्राप्त डेट"
        name="ReceivedDate"
        type="date"
        value={form.ReceivedDate}
        onChange={onChange}
        icon={FiCalendar}
      />

      <Input
        label="Party Name / पार्टी नेम"
        name="partyName"
        value={form.partyName}
        onChange={onChange}
        placeholder="Supplier / party name / सप्लायर / पार्टी नेम"
        icon={FiTruck}
      />

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
          className="
            h-11
            w-full
            rounded-xl
            border
            border-(--theme-border)
            bg-(--theme-background)
            px-3
            text-sm
            text-(--theme-text)
            outline-none
            transition
            focus:border-(--theme-primary)
            focus:ring-2
            focus:ring-(--theme-primary)/10
          "
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
              className="
                h-11
                w-full
                rounded-xl
                border
                border-(--theme-border)
                bg-(--theme-background)
                px-3
                text-sm
                text-(--theme-text)
                outline-none
                transition
                focus:border-(--theme-primary)
                focus:ring-2
                focus:ring-(--theme-primary)/10
              "
            >
              <option value="years">Years / साल</option>
              <option value="months">Months / महीने</option>
              <option value="days">Days / दिन</option>
            </select>
          </div>
        </div>
      )}

      <SingleImageField
        title="Guarantee / Warranty Photo / गारंटी / वारंटी फोटो"
        subtitle="Optional / ऑप्शनल"
        image={form.guaranteePhoto}
        onCamera={onGuaranteeCamera}
        onFiles={onGuaranteeFile}
        onRemove={onRemoveGuarantee}
      />

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
  );
};

export default PurchaseSection;
