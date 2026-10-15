import { Capacitor } from "@capacitor/core";
import { Camera } from "@capacitor/camera";
import { BackgroundGeolocation } from "@capgo/background-geolocation";

export async function requestAppPermissions() {
  if (!Capacitor.isNativePlatform()) {
    return { native: false };
  }

  // Request camera access.
  const camera = await Camera.requestPermissions({
    permissions: ["camera"],
  });

  // Request foreground location and notification access.
  const gps = await BackgroundGeolocation.requestPermissions({
    permissions: ["location", "notification"],
  });

  console.log("Camera permission:", camera);
  console.log("GPS permissions:", gps);

  return { native: true, camera, gps };
}
