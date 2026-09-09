import React from "react";
import {
  FiCalendar,
  FiClock,
  FiTool,
  FiTruck,
} from "react-icons/fi";

import {
  Input,
  Textarea,
  ImageSection,
} from "./MaintenanceCommon";

const ServiceSection = ({
  form,
  onChange,
  onCamera,
  onFiles,
  onRemoveImage,
}) => {
  return (
    <div className="space-y-4">
      <Input
        label="Part Name"
        name="partName"
        value={form.partName}
        onChange={onChange}
        placeholder="e.g. Engine Oil"
        icon={FiTool}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Service Date"
          name="serviceDate"
          type="date"
          value={form.serviceDate}
          onChange={onChange}
          icon={FiCalendar}
        />

        <Input
          label="Next Service Date"
          name="nextServiceDate"
          type="date"
          value={form.nextServiceDate}
          onChange={onChange}
          icon={FiClock}
        />
      </div>

      <Input
        label="Party Name"
        name="partyName"
        value={form.partyName}
        onChange={onChange}
        placeholder="Service provider / party"
        icon={FiTruck}
      />

      <Textarea
        label="Narration"
        name="narration"
        value={form.narration}
        onChange={onChange}
        placeholder="
          Describe the service performed, parts replaced,
          observations, etc.
        "
      />

      <ImageSection
        title="Service Images"
        subtitle="Maximum 2 images"
        images={form.images}
        maxImages={2}
        onCamera={onCamera}
        onFiles={onFiles}
        onRemove={onRemoveImage}
      />
    </div>
  );
};

export default ServiceSection;