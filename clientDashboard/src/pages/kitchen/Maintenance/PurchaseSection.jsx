import React from "react";
import {
  FiCalendar,
  FiClock,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

import {
  Input,
  SingleImageField,
} from "./MaintenanceCommon";

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
        label="Purchase Date / परचेज डेट"
        name="purchaseDate"
        type="date"
        value={form.purchaseDate}
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

      <Input
        label="Expiry / Warranty Year / एक्सपायरी / वारंटी ईयर"
        name="expiryWarrantyYear"
        value={form.expiryWarrantyYear}
        onChange={onChange}
        placeholder="e.g. 2028 or 2 years / जैसे: 2028 या 2 साल"
        icon={FiClock}
      />

      <SingleImageField
        title="Guarantee / Warranty Photo / गारंटी / वारंटी फोटो"
        subtitle="Optional / ऑप्शनल"
        image={form.guaranteePhoto}
        onCamera={onGuaranteeCamera}
        onFiles={onGuaranteeFile}
        onRemove={onRemoveGuarantee}
      />

      <SingleImageField
        title="Other Image / अदर इमेज"
        subtitle="Invoice, product image or other document / इनवॉइस, प्रोडक्ट इमेज या कोई अन्य डॉक्यूमेंट"
        image={form.otherImages?.[0]}
        onCamera={onOtherCamera}
        onFiles={onOtherFiles}
        onRemove={onRemoveOther}
      />
    </div>
  );
};

export default PurchaseSection;
