import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";

import { createGpsTrackingToken, getNativeGpsTrailUrl } from "./trip.service.js";

let activeTripId = null;

export const startBackgroundGpsTracking = async (tripId, onLocation) => {
  // A browser/PWA cannot provide the same native background guarantee.
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  // Avoid starting the same native tracker twice.
  if (activeTripId === tripId) {
    return true;
  }

  // Refresh any previous native tracking session.
  await BackgroundGeolocation.stop().catch(() => {});

  const token = await createGpsTrackingToken(tripId);
const permissions =
  await BackgroundGeolocation.checkPermissions();

console.log(
  "Background GPS permissions:",
  JSON.stringify(permissions)
);

const result =
  await BackgroundGeolocation.requestPermissions({
    permissions: ["location", "notification"],
  });

console.log(
  "Permission request result:",
  JSON.stringify(result)
);

await BackgroundGeolocation.start(
  {
    backgroundTitle: "ESF Trip — GPS Tracking",
    backgroundMessage:
      "Your active trip is sharing location with the server.",

    requestPermissions: true,
    stale: false,
    distanceFilter: 10,

    // Required for native HTTP delivery on Android.
    backgroundLocation: true,

    // Sends each location directly from native code.
    url:  `https://esfserver.axeiro.com/api/v1/trips/${tripId}/gpstrail/native`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
  (location, error) => {
    if (error) {
      console.error("Background GPS error:", error);
      return;
    }

    if (!location) return;

    console.log("GPS location received:", {
      latitude: location.latitude,
      longitude: location.longitude,
      time: location.time,
    });

    onLocation?.({
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      capturedAt: new Date(location.time ?? Date.now()).toISOString(),
    });
  },
);

  activeTripId = tripId;
  return true;
};

export const stopBackgroundGpsTracking = async () => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await BackgroundGeolocation.stop();
  activeTripId = null;
};
