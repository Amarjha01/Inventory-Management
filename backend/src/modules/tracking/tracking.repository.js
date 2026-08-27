import Vehicle from "../../models/vehicle.js";

const trackingRepository = {
  async findActiveTrackers() {
    return Vehicle.find({
      "tracker.isActive": true,
      "tracker.provider": {
        $in: ["dotrack", "track360"],
      },
    }).lean();
  },

  async findActiveTrackerByVehicleNumber(vehicleNumber) {
    return Vehicle.findOne({
      vehicleNumber,
      "tracker.isActive": true,
      "tracker.provider": {
        $in: ["dotrack", "track360"],
      },
    }).lean();
  },
};

export default trackingRepository;