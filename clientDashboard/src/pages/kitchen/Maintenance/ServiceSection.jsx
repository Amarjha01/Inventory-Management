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
        label="Part Name / पार्ट नेम"
        name="partName"
        value={form.partName}
        onChange={onChange}
        placeholder="e.g. Engine Oil / जैसे: इंजन ऑयल"
        icon={FiTool}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Service Date / सर्विस डेट"
          name="serviceDate"
          type="date"
          value={form.serviceDate}
          onChange={onChange}
          icon={FiCalendar}
        />

        <Input
          label="Next Service Date / नेक्स्ट सर्विस डेट"
          name="nextServiceDate"
          type="date"
          value={form.nextServiceDate}
          onChange={onChange}
          icon={FiClock}
        />
      </div>

      <Input
        label="Party Name / पार्टी नेम"
        name="partyName"
        value={form.partyName}
        onChange={onChange}
        placeholder="Service provider / party / सर्विस प्रोवाइडर / पार्टी"
        icon={FiTruck}
      />

      <Textarea
        label="Narration / नरेशन"
        name="narration"
        value={form.narration}
        onChange={onChange}
        placeholder="Describe the service performed, parts replaced, observations, etc. / की गई सर्विस, बदले गए पार्ट्स, ऑब्जर्वेशन आदि के बारे में लिखें।"
      />

      <ImageSection
        title="Service Images / सर्विस इमेजेज"
        subtitle="Maximum 2 images / अधिकतम 2 इमेजेज"
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
