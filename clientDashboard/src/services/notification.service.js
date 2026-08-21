import api from "../api/axios";

const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY;


function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


export const registerServiceWorker = async () => {

  if (!("serviceWorker" in navigator)) {
    throw new Error(
      "Service workers are not supported by this browser.",
    );
  }

  return await navigator.serviceWorker.register(
    "/sw.js",
  );
};


export const requestNotificationPermission = async () => {

  if (!("Notification" in window)) {
    throw new Error(
      "Notifications are not supported by this browser.",
    );
  }

  return await Notification.requestPermission();
};


export const subscribeToPushNotifications = async () => {

  const registration =
    await navigator.serviceWorker.ready;

  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {

    if (!VAPID_PUBLIC_KEY) {
      throw new Error(
        "VAPID public key is missing.",
      );
    }

    subscription =
      await registration.pushManager.subscribe({
        userVisibleOnly: true,

        applicationServerKey:
          urlBase64ToUint8Array(
            VAPID_PUBLIC_KEY,
          ),
      });
  }

  return subscription;
};


export const savePushSubscription = async (
  subscription,
) => {

  const response = await api.post(
    "/notifications/subscribe",
    subscription.toJSON(),
  );

  return response.data;
};


export const enablePushNotifications = async () => {

  await registerServiceWorker();

  const permission =
    await requestNotificationPermission();

  if (permission !== "granted") {
    throw new Error(
      "Notification permission was not granted.",
    );
  }

  const subscription =
    await subscribeToPushNotifications();
  console.log(subscription);
  
  await savePushSubscription(
    subscription,
  );

  return subscription;
};


export const unsubscribeFromPushNotifications =
  async () => {

    const registration =
      await navigator.serviceWorker.ready;

    const subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      return;
    }

    await api.post(
      "/notifications/unsubscribe",
      {
        endpoint: subscription.endpoint,
      },
    );

    await subscription.unsubscribe();
  };