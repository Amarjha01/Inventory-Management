import Card from "../../shared/ui/Card";
import { storage } from "../../../utils/storage";

const KitchenInfo = () => {
  const user = storage.getUser();
  const kitchen = user?.kitchenId;

  return (
    <Card className="p-3">
      <h2 className="text-base font-semibold text-gray-800 mb-3">
        Kitchen Details
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <InfoBox label="Kitchen" value={kitchen?.name} />
        <InfoBox label="Incharge" value={user?.name} />
        <InfoBox label="Contact" value={kitchen?.contactPerson} />
        <InfoBox label="Phone" value={kitchen?.phone} />
        <InfoBox label="District" value={kitchen?.district} />

        <div className="col-span-2 lg:col-span-3">
          <InfoBox label="Address" value={kitchen?.address} />
        </div>
      </div>
    </Card>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="rounded-md border border-gray-200 bg-white px-3 py-2">
    <p className="text-[10px] uppercase font-medium tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-0.5 text-sm font-semibold text-gray-800 truncate">
      {value || "-"}
    </p>
  </div>
);

export default KitchenInfo;