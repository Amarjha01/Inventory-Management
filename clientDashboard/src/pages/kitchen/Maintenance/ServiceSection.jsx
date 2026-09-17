import partName from "../../../constants/maintenancePartName.js";

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


// Add maintenance timing to a date
const calculateNextServiceDate = (serviceDate, maintenanceTiming) => {
  if (!serviceDate || !maintenanceTiming) {
    return "";
  }

  const date = new Date(`${serviceDate}T00:00:00`);

  const [value, unit] = maintenanceTiming.split(" ");

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "";
  }

  if (unit.startsWith("month")) {
    // Preserve day while handling things like Jan 31 + 1 month
    const originalDay = date.getDate();

    date.setDate(1);
    date.setMonth(date.getMonth() + amount);

    const lastDayOfTargetMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    date.setDate(Math.min(originalDay, lastDayOfTargetMonth));
  }

  if (unit.startsWith("year")) {
    const originalMonth = date.getMonth();
    const originalDay = date.getDate();

    date.setDate(1);
    date.setFullYear(date.getFullYear() + amount);
    date.setMonth(originalMonth);

    const lastDayOfTargetMonth = new Date(
      date.getFullYear(),
      originalMonth + 1,
      0
    ).getDate();

    date.setDate(Math.min(originalDay, lastDayOfTargetMonth));
  }

  return date.toISOString().split("T")[0];
};


const ServiceSection = ({
  form,
  onChange,
  onCamera,
  onFiles,
  onRemoveImage,
}) => {

  // Handle part selection / typing
  const handlePartChange = (e) => {
    const value = e.target.value;

    const selectedPart = partName.find(
      (part) =>
        part.name.toLowerCase() === value.toLowerCase()
    );

    let nextServiceDate = "";

    if (selectedPart && form.serviceDate) {
      nextServiceDate = calculateNextServiceDate(
        form.serviceDate,
        selectedPart.maintenanceTiming
      );
    }

    onChange({
      target: {
        name: "partName",
        value,
      },
    });

    onChange({
      target: {
        name: "nextServiceDate",
        value: nextServiceDate,
      },
    });
  };


  // Handle service date change
  const handleServiceDateChange = (e) => {
    const serviceDate = e.target.value;

    const selectedPart = partName.find(
      (part) =>
        part.name.toLowerCase() ===
        form.partName.toLowerCase()
    );

    let nextServiceDate = "";

    if (selectedPart && serviceDate) {
      nextServiceDate = calculateNextServiceDate(
        serviceDate,
        selectedPart.maintenanceTiming
      );
    }

    onChange(e);

    onChange({
      target: {
        name: "nextServiceDate",
        value: nextServiceDate,
      },
    });
  };


  return (
    <div className="space-y-4">

      <Input
        label="Part Name / पार्ट नेम"
        name="partName"
        value={form.partName}
        onChange={handlePartChange}
        placeholder="e.g. Engine Oil / जैसे: इंजन ऑयल"
        icon={FiTool}
        list="maintenance-parts"
      />

      <datalist id="maintenance-parts">
        {partName.map((part) => (
          <option
            key={part.name}
            value={part.name}
          >
            {part.hindiName}
          </option>
        ))}
      </datalist>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <Input
          label="Service Date / सर्विस डेट"
          name="serviceDate"
          type="date"
          value={form.serviceDate}
          onChange={handleServiceDateChange}
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