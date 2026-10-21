
import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";

import { createGpsTrackingToken } from "./trip.service.js";

const GPS_TRACKING_URL = "https://esfserver.axeiro.com/api/v1/trips";

const DISTANCE_FILTER_METERS = 50;
const MIN_INTERVAL_MS = 30_000;

let activeTripId = null;
let startingTripId = null;

export const startBackgroundGpsTracking = async (tripId, onLocation) => {
  if (!Capacitor.isNativePlatform()) return false;

  if (activeTripId === tripId) return true;

  if (startingTripId) {
    if (startingTripId === tripId) return false;
    throw new Error("Another GPS tracking session is starting.");
  }

  startingTripId = tripId;

  try {
    await BackgroundGeolocation.stop().catch(() => {});
    activeTripId = null;

    const token = await createGpsTrackingToken(tripId);

    const permissions = await BackgroundGeolocation.checkPermissions();
    console.log("Background GPS permissions:", permissions);

    await BackgroundGeolocation.requestPermissions({
      permissions: ["location", "notification"],
    });

    await BackgroundGeolocation.start(
      {
        backgroundTitle: "ESF Trip — GPS Tracking",
        backgroundMessage:
          "Your active trip is sharing location with the server.",

        requestPermissions: true,
        stale: false,

        // Suppress small movements and stationary GPS drift.
        distanceFilter: DISTANCE_FILTER_METERS,

        // Limit how frequently native HTTP uploads occur.
        minIntervalMs: MIN_INTERVAL_MS,

        backgroundLocation: true,

        url: `${GPS_TRACKING_URL}/${tripId}/gpstrail/native`,
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
          !Number.isFinite(Number(location.latitude)) ||
          !Number.isFinite(Number(location.longitude))
        ) {
          return;
        }

        const capturedAt = new Date(location.time ?? Date.now());
        if (Number.isNaN(capturedAt.getTime())) return;

        // This callback is for local UI updates.
        // Native HTTP uploads are handled by the plugin's URL option.
        onLocation?.({
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
          accuracy:
            location.accuracy == null
              ? undefined
              : Number(location.accuracy),
          capturedAt: capturedAt.toISOString(),
        });
      },
    );

    activeTripId = tripId;
    return true;
  } catch (error) {
    activeTripId = null;
    throw error;
  } finally {
    startingTripId = null;
  }
};

export const stopBackgroundGpsTracking = async () => {
  if (!Capacitor.isNativePlatform()) return;

  await BackgroundGeolocation.stop();
  activeTripId = null;
};
