import trackingRepository from "./tracking.repository.js";

import dotrackProvider from "./providers/dotrack.provider.js";
import track360Provider from "./providers/track360.provider.js";

import {
  normalizeDotrack,
  normalizeTrack360,
} from "./tracking.normalizer.js";

const providers = {
  dotrack: {
    fetch: dotrackProvider.getLiveLocation,
    normalize: normalizeDotrack,
  },

  track360: {
    fetch: track360Provider.getLiveLocation,
    normalize: normalizeTrack360,
  },
};

const trackingService = {
  async getLiveLocations() {
    const vehicles =
      await trackingRepository.findActiveTrackerByVehicleNumber();
        console.log("vehicles having tracker" , vehicles);
        
    const results = await Promise.allSettled(
      vehicles?.map((vehicle) =>
        this.getVehicleLocation(vehicle)
      )
    );

    const successful = [];
    const failed = [];

    results.forEach((result, index) => {
      const vehicle = vehicles[index];

      if (result.status === "fulfilled") {
        successful.push(result.value);
      } else {
        failed.push({
          vehicleId: vehicle._id,
          provider: vehicle.tracker.provider,
          error: result.reason?.message ?? "Tracking failed",
        });
      }
    });

    return {
      vehicles: successful,
      errors: failed,
    };
  },

  async getLiveLocationsBYvehicle(Vehicle) {
    const vehicle =
      await trackingRepository.findActiveTrackerByVehicleNumber(Vehicle.vehicleNumber);
        console.log("vehicles having tracker" , vehicle);
        
    const result = await 
        this.getVehicleLocation(vehicle);
console.log("result at service" , result);

   
    return {
      result,
    };
  },

  async getVehicleLocation(vehicle) {
    const {
      provider: providerName,
      envKey,
    } = vehicle.tracker;

    const provider = providers[providerName];

    if (!provider) {
      throw new Error(
        `Unsupported tracking provider: ${providerName}`
      );
    }

    if (!envKey) {
      throw new Error(
        `Tracker envKey is missing for vehicle ${vehicle._id}`
      );
    }

    const url = process.env[envKey];

    if (!url) {
      throw new Error(
        `Environment variable ${envKey} is not configured`
      );
    }

    const response = await provider.fetch(url);

    const location = provider.normalize(response);

    return {
      ...location,

      vehicleId: vehicle._id,

      tracker: {
        provider: providerName,
      },
    };
  },
};

export default trackingService;