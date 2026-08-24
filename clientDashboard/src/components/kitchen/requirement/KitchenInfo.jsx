import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiHome,
  FiBriefcase,
} from "react-icons/fi";

import Card from "../../shared/ui/Card";
import { storage } from "../../../utils/storage";

const KitchenInfo = () => {
  const user = storage.getUser();
  const kitchen = user?.kitchenId;

  return (
    <div className="space-y-3">
      {/* ================= PROFILE HEADER ================= */}
      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-(--theme-border)
          bg-(--theme-surface)
          p-4
          shadow-sm
          transition-colors
          duration-300
        "
      >
        {/* Avatar */}
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-(--theme-primary)
            text-lg
            font-bold
            text-white
            shadow-sm
          "
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* User Information */}
        <div className="min-w-0 flex-1">
          <h2
            className="
              truncate
              text-base
              font-bold
              text-(--theme-text)
            "
          >
            {user?.name || "User"}
          </h2>

          <p
            className="
              mt-0.5
              text-xs
              text-(--theme-text-secondary)
            "
          >
            Kitchen Incharge
          </p>

          {kitchen?.name && (
            <div
              className="
                mt-1
                flex
                items-center
                gap-1
                text-xs
                font-medium
                text-(--theme-primary)
              "
            >
              <FiHome size={12} />

              <span className="truncate">
                {kitchen.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ================= KITCHEN DETAILS ================= */}
      <Card className="!overflow-hidden !p-0">
        {/* Section Header */}
        <div
          className="
            border-b
            border-(--theme-border)
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-(--theme-primary-light)
                text-(--theme-primary)
              "
            >
              <FiBriefcase size={16} />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-bold
                  text-(--theme-text)
                "
              >
                Kitchen Details
              </h3>

              <p
                className="
                  text-[11px]
                  text-(--theme-text-secondary)
                "
              >
                Your registered kitchen information
              </p>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-2 gap-2 bg-(--theme-surface) p-3">
          <InfoBox
            icon={FiHome}
            label="Kitchen"
            value={kitchen?.name}
          />

          <InfoBox
            icon={FiUser}
            label="Incharge"
            value={user?.name}
          />

          <InfoBox
            icon={FiUser}
            label="Contact Person"
            value={kitchen?.contactPerson}
          />

          <InfoBox
            icon={FiPhone}
            label="Phone"
            value={kitchen?.phone}
          />

          <InfoBox
            icon={FiMapPin}
            label="District"
            value={kitchen?.district}
          />

          {/* Address */}
          <div className="col-span-2">
            <InfoBox
              icon={FiMapPin}
              label="Address"
              value={kitchen?.address}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const InfoBox = ({
  icon: Icon,
  label,
  value,
}) => (
  <div
    className="
      rounded-xl
      border
      border-(--theme-border)
      bg-(--theme-surface-alt)
      p-3
      transition-colors
      duration-300
    "
  >
    {/* Label */}
    <div className="flex items-center gap-1.5">
      <Icon
        size={13}
        className="
          shrink-0
          text-(--theme-primary)
        "
      />

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wide
          text-(--theme-text-secondary)
        "
      >
        {label}
      </p>
    </div>

    {/* Value */}
    <p
      className="
        mt-1
        truncate
        text-sm
        font-semibold
        text-(--theme-text)
      "
      title={value || "-"}
    >
      {value || "-"}
    </p>
  </div>
);

export default KitchenInfo;