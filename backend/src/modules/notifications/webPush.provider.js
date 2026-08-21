import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

export const sendPushNotification = async (
  subscription,
  payload,
) => {
  const data = JSON.stringify(payload)
  console.log("web push subscription:", subscription);
console.log("web push payload:",  data);
  return await webpush.sendNotification(
    subscription,
    data
  );
};