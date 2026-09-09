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
        label="Purchase Date"
        name="purchaseDate"
        type="date"
        value={form.purchaseDate}
        onChange={onChange}
        icon={FiCalendar}
      />

      <Input
        label="Party Name"
        name="partyName"
        value={form.partyName}
        onChange={onChange}
        placeholder="Supplier / party name"
        icon={FiTruck}
      />

      <Input
        label="Company Name"
        name="companyName"
        value={form.companyName}
        onChange={onChange}
        placeholder="Manufacturer / company"
        icon={FiPackage}
      />

      <Input
        label="Expiry / Warranty Year"
        name="expiryWarrantyYear"
        value={form.expiryWarrantyYear}
        onChange={onChange}
        placeholder="e.g. 2028 or 2 years"
        icon={FiClock}
      />

      <SingleImageField
        title="Guarantee / Warranty Photo"
        subtitle="Optional"
        image={form.guaranteePhoto}
        onCamera={onGuaranteeCamera}
        onFiles={onGuaranteeFile}
        onRemove={onRemoveGuarantee}
      />

      <SingleImageField
        title="Other Image"
        subtitle="Invoice, product image or other document"
        image={form.otherImages?.[0]}
        onCamera={onOtherCamera}
        onFiles={onOtherFiles}
        onRemove={onRemoveOther}
      />
    </div>
  );
};

export default PurchaseSection;