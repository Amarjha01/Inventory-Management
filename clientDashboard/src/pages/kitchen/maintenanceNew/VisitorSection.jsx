import React from "react";
import {
  FiCalendar,
  FiFileText,
  FiPhone,
  FiUser,
  FiUsers,
  FiX,
  FiSave,
} from "react-icons/fi";

import { Input, Textarea, ImageSection } from "../../../components/shared/MaintenanceCommon.jsx";


const VisitorSection = ({
  form,
  onChange,
  onCamera,
  onFiles,
  onRemoveImage,
  onCancel,
  onSubmit,
  saving = false,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm">
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
        {/* Header */}
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
              <FiUsers size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Visitor Details
              </h2>

              <p className="text-xs text-gray-500">
                Add or update visitor information
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

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-5">
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
          </div>

          {/* Footer */}
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

export default VisitorSection;
