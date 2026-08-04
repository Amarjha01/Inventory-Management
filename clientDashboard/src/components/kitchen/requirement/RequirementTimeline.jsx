import Card from "../../shared/ui/Card";
import { FiCheckCircle } from "react-icons/fi";

const LABELS = {
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  PACKING: "Packing",
  PACKED: "Packed",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  RECEIVED_PENDING_CONFIRMATION: "Pending Confirmation",
  RECEIVED: "Received",
};

const RequirementTimeline = ({ timeline = [], currentStatus }) => {
  return (
    <Card>

      <h2 className="text-lg font-semibold mb-5">
        Timeline
      </h2>

      <div className="space-y-5">

        {timeline.map((step) => {

          const completed = step.time !== null;

          return (

            <div
              key={step.status}
              className="flex gap-4 items-start"
            >

              {completed ? (
                <FiCheckCircle
                  className="text-green-600 mt-1"
                  size={20}
                />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-1"></div>
              )}

              <div>

                <p className="font-medium">
                  {LABELS[step.status]}
                </p>

                <p className="text-sm text-gray-500">
                  {step.time || "Waiting..."}
                </p>

              </div>

            </div>

          );
        })}

      </div>

    </Card>
  );
};

export default RequirementTimeline;