import React from "react";
import {
  FiCalendar,
  FiFileText,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import {
  Input,
  Textarea,
  ImageSection,
} from "../../../components/shared/MaintenanceCommon";

const VisitorSection = ({
  form,
  onChange,
  onCamera,
  onFiles,
  onRemoveImage,
}) => {
  return (
    <div className="space-y-4">
      <Input
        label="Problem Date / प्रॉब्लम डेट"
        name="problemDate"
        type="date"
        value={form.problemDate}
        onChange={onChange}
        icon={FiCalendar}
      />

      <Input
        label="Visitor Name / विजिटर नेम"
        name="visitorName"
        value={form.visitorName}
        onChange={onChange}
        placeholder="Enter visitor name / विजिटर का नाम दर्ज करें"
        icon={FiUser}
      />

      <Input
        label="Phone Number / फोन नंबर"
        name="phoneNumber"
        type="tel"
        value={form.phoneNumber}
        onChange={onChange}
        placeholder="Enter phone number / फोन नंबर दर्ज करें"
        icon={FiPhone}
      />

      <Input
        label="Reason / रीजन"
        name="reason"
        value={form.reason}
        onChange={onChange}
        placeholder="Reason for visit / विजिट का रीजन"
        icon={FiFileText}
      />

      <Textarea
        label="Any Part Changes / Narration / कोई पार्ट चेंज / नरेशन"
        name="narration"
        value={form.narration}
        onChange={onChange}
        placeholder="Mention parts changed, work performed or other details... / बदले गए पार्ट्स, किए गए काम या अन्य डिटेल्स लिखें..."
      />

      <ImageSection
        title="Other Photos / अदर फोटो"
        subtitle="Maximum 3 photos / अधिकतम 3 फोटो"
        images={form.otherImages}
        maxImages={3}
        onCamera={onCamera}
        onFiles={onFiles}
        onRemove={onRemoveImage}
      />
    </div>
  );
};

export default VisitorSection;