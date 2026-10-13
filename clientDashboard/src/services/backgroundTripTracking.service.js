
import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let activeTripId = null;
let trackingStarted = false;

export async function startBackgroundTripTracking({
  tripId,
  trackingToken,
  onLocation,
  onError,
}) {
  if (!Capacitor.isNativePlatform()) {
    throw new Error(
      "Background GPS requires the installed Android app, not Chrome PWA."
    );
  }

  if (!tripId || !trackingToken) {
    throw new Error("Trip ID and tracking token are required.");
  }

  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  if (trackingStarted && activeTripId === tripId) {
    return;
  }

  // Avoid running two native trackers simultaneously.
  if (trackingStarted) {
    await BackgroundGeolocation.stop();
    trackingStarted = false;
    activeTripId = null;
  }

  const url =
    `${API_BASE_URL}/trips/${encodeURIComponent(tripId)}/gpstrail`;

  await BackgroundGeolocation.start(
    {
      requestPermissions: true,
      stale: false,
      distanceFilter: 0,

      // Minimum interval between native HTTP POSTs.
      minIntervalMs: 3000,

      backgroundTitle: "Trip GPS Tracking",
      backgroundMessage:
        "Your active trip is sharing its location with the fleet.",
      
      // Native delivery continues independently of the WebView.
      url,

      // Use a server-issued, trip-scoped token.
      headers: {
        Authorization: `Bearer ${trackingToken}`,
        "Content-Type": "application/json",
      },
    },
    (location, error) => {
      if (error) {
        console.error("Background GPS error:", error);
        onError?.(error);
        return;
      }

      if (!location) return;

      // This callback updates the UI while JavaScript is available.
      // Native POST delivery is configured separately above.
      onLocation?.({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        capturedAt: location.time
          ? new Date(location.time).toISOString()
          : new Date().toISOString(),
      });
    }
  );

  activeTripId = tripId;
  trackingStarted = true;
}

export async function stopBackgroundTripTracking() {
  if (!trackingStarted) return;

  await BackgroundGeolocation.stop();

  trackingStarted = false;
  activeTripId = null;
}
