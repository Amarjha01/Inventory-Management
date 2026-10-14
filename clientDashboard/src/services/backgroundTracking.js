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

  await BackgroundGeolocation.start(
    {
      backgroundTitle: "ESF Trip — GPS Tracking",
      backgroundMessage:
        "Your active trip is sharing location with the server.",

      requestPermissions: true,
      stale: false,

      // Request updates after meaningful movement.
      distanceFilter: 10,

      // Native Android service sends GPS directly to the backend.
      url: getNativeGpsTrailUrl(tripId),

      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    (location, error) => {
      if (error) {
        console.error("Background GPS error:", error);
        return;
      }

      if (
        !location ||
        !Number.isFinite(location.latitude) ||
        !Number.isFinite(location.longitude)
      ) {
        return;
      }

      // This callback updates the UI while the WebView is active.
      // Native POST delivery is configured separately above.
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
