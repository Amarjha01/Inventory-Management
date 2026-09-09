import React from "react";
import {
  FiCalendar,
  FiFileText,
  FiPhone,
  FiTool,
  FiUser,
} from "react-icons/fi";

import {
  Input,
  Textarea,
} from "./MaintenanceCommon";

const VisitorSection = ({
  form,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <Input
        label="Problem Date"
        name="problemDate"
        type="date"
        value={form.problemDate}
        onChange={onChange}
        icon={FiCalendar}
      />

      <Input
        label="Visitor Name"
        name="visitorName"
        value={form.visitorName}
        onChange={onChange}
        placeholder="Enter visitor name"
        icon={FiUser}
      />

      <Input
        label="Phone Number"
        name="phoneNumber"
        type="tel"
        value={form.phoneNumber}
        onChange={onChange}
        placeholder="Enter phone number"
        icon={FiPhone}
      />

      <Input
        label="Reason"
        name="reason"
        value={form.reason}
        onChange={onChange}
        placeholder="Reason for visit"
        icon={FiFileText}
      />

      <Textarea
        label="Any Part Changes / Narration"
        name="narration"
        value={form.narration}
        onChange={onChange}
        placeholder="
          Mention parts changed, work performed
          or other details...
        "
      />
    </div>
  );
};

export default VisitorSection;