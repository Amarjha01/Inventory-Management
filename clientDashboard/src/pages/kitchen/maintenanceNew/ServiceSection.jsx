import partName from "../../../constants/maintenancePartName.js";

import {
  FiCalendar,
  FiClock,
  FiTool,
  FiTruck,
  FiX,
  FiSave,
} from "react-icons/fi";

import { Input, Textarea, ImageSection } from "../../../components/shared/MaintenanceCommon.jsx";


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
  onCancel,
  onSubmit,
  saving = false,
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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm">

      {/* Floating Form Card */}
      <div
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-gray-200
          bg-white
          shadow-2xl
        "
      >

        {/* ================= HEADER ================= */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-3">

            {/* Icon */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-black
                text-white
              "
            >
              <FiTool size={19} />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Service Maintenance
              </h2>

              <p className="text-xs text-gray-500">
                Add or update service information
              </p>
            </div>
          </div>

          {/* X Button */}
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="Close"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FiX size={21} />
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">

            <div className="space-y-5">

              {/* Machine */}
              <Input
                label="Machine Name / मशीन नेम"
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
                    label={part.hindiName}
                  />
                ))}
              </datalist>

              {/* Dates */}
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

              {/* Party */}
              <Input
                label="Party Name / पार्टी नेम"
                name="partyName"
                value={form.partyName}
                onChange={onChange}
                placeholder="Service provider / party / सर्विस प्रोवाइडर / पार्टी"
                icon={FiTruck}
              />

              {/* Narration */}
              <Textarea
                label="Narration / नरेशन"
                name="narration"
                value={form.narration}
                onChange={onChange}
                placeholder="Describe the service performed, parts replaced, observations, etc. / की गई सर्विस, बदले गए पार्ट्स, ऑब्जर्वेशन आदि के बारे में लिखें।"
              />

              {/* Images */}
              <ImageSection
                title="Service Images / सर्विस इमेजेज"
                subtitle="Maximum 5 images / अधिकतम 5 इमेजेज"
                images={form.images}
                maxImages={5}
                onCamera={onCamera}
                onFiles={onFiles}
                onRemove={onRemoveImage}
              />

            </div>

          </div>

          {/* ================= FOOTER ================= */}
          <div
            className="
              flex
              shrink-0
              items-center
              justify-end
              gap-3
              border-t
              border-gray-200
              bg-white
              px-5
              py-4
            "
          >

            {/* Cancel */}
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="
                rounded-xl
                border
                border-gray-300
                px-5
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-100
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            {/* Save */}
            <button
              type="submit"
              disabled={saving}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gray-950
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-black
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-60
                cursor-pointer
              "
            >
              <FiSave size={17} />

              {saving ? "Saving..." : "Save"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ServiceSection;