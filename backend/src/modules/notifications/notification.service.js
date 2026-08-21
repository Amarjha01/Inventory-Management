import kitchenRepository from "../../repositories/kitchen.repository.js";
import userRepository from "../../repositories/user.repository.js";
import notificationRepository from "./notification.repository.js";
import { sendPushNotification } from "./webPush.provider.js";

class NotificationService {

  async subscribe(userId, subscription, userAgent = "") {

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.p256dh ||
      !subscription?.keys?.auth
    ) {
      throw new Error("Invalid push subscription");
    }

    const existing =
      await notificationRepository.findByEndpoint(
        subscription.endpoint,
      );

    if (existing) {
      return existing;
    }

    return await notificationRepository.create({
      userId,

      endpoint: subscription.endpoint,

      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },

      userAgent,
    });
  }


  async unsubscribe(userId, endpoint) {

    return await notificationRepository
      .deleteByUserIdAndEndpoint(
        userId,
        endpoint,
      );
  }


  async sendToUser(userId, payload) {

    const subscriptions =
      await notificationRepository.findByUserId(userId);
    
    const results = [];

    for (const subscription of subscriptions) {

      try {

        await sendPushNotification(
          {
            endpoint: subscription.endpoint,

            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },

          payload,
        );

        results.push({
          endpoint: subscription.endpoint,
          success: true,
        });

      } catch (error) {

        /*
         * Browser has rejected/expired the subscription.
         * 404 and 410 generally mean the subscription
         * is no longer valid.
         */

        if (
          error.statusCode === 404 ||
          error.statusCode === 410
        ) {
          await notificationRepository
            .deleteByEndpoint(
              subscription.endpoint,
            );
        }

        results.push({
          endpoint: subscription.endpoint,
          success: false,
        });
      }
    }

    return results;
  }

  async notifyRequirementCreated(userIds , payload) {

    const data = {
  title: "New Kitchen Requirement",
  body: `${payload.kitchen.name} has created a new requirement.`,
  data: {
    url: "/",
    requirementId: payload._id,
    kitchenId: payload.kitchen._id,
    kitchenName: payload.kitchen.name,
  },
};

        const subscriptions =
    await notificationRepository.findByUserIds(
        userIds,
    );
    
    const results = [];

    for (const subscription of subscriptions) {

      try {

        await sendPushNotification(
          {
            endpoint: subscription.endpoint,

            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },

          data,
        );

        results.push({
          endpoint: subscription.endpoint,
          success: true,
        });

      } catch (error) {

        /*
         * Browser has rejected/expired the subscription.
         * 404 and 410 generally mean the subscription
         * is no longer valid.
         */

        if (
          error.statusCode === 404 ||
          error.statusCode === 410
        ) {
          await notificationRepository
            .deleteByEndpoint(
              subscription.endpoint,
            );
        }

        results.push({
          endpoint: subscription.endpoint,
          success: false,
        });
      }
    }

    return results;
  }

  async notifyRequirementDispatched(userIds , payload) {
    console.log('users at notificationn 178' , userIds , payload);

    const data = {
  title: "Requirement bhej di gayi hai.",
  body: `${payload.kitchen.name} Kitchen aap ki requirement bhej di gayi hai!`,
  data: {
    url: "/",
    requirementId: payload._id,
    kitchenId: payload.kitchen._id,
    kitchenName: payload.kitchen.name,
  },
};

        const subscriptions =
    await notificationRepository.findByUserIds(
        userIds,
    );
    
    const results = [];

    for (const subscription of subscriptions) {

      try {

        await sendPushNotification(
          {
            endpoint: subscription.endpoint,

            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },

          data,
        );

        results.push({
          endpoint: subscription.endpoint,
          success: true,
        });

      } catch (error) {

        /*
         * Browser has rejected/expired the subscription.
         * 404 and 410 generally mean the subscription
         * is no longer valid.
         */

        if (
          error.statusCode === 404 ||
          error.statusCode === 410
        ) {
          await notificationRepository
            .deleteByEndpoint(
              subscription.endpoint,
            );
        }

        results.push({
          endpoint: subscription.endpoint,
          success: false,
        });
      }
    }

    return results;
  }

async sendAdminNotification(data) {
  const {
    audience,
    kitchenId,
    districtId,
    title,
    body,
    data: notificationData,
  } = data;

  let users = [];

  console.log("send notification:", {
    audience,
    kitchenId,
    districtId,
    title,
    body,
    data: notificationData,
  });

  switch (audience) {
    case "kitchen":
      users =
        await userRepository.findByKitchenId(
          kitchenId
        );
      break;

    case "all_kitchens": {
      const kitchens =
        await kitchenRepository.findMany();

      const kitchenIds = kitchens.map(
        (kitchen) => kitchen._id
      );

      users =
        await userRepository.findByKitchenIds(
          kitchenIds
        );

      break;
    }

    case "all_users":
      users = await userRepository.findAll();
      break;

    default:
      throw new Error(
        "Invalid notification audience"
      );
  }

  console.log(
    "Users found:",
    users.length
  );

  if (!users.length) {
    return {
      recipients: 0,
      subscriptions: 0,
      message: "No users found",
    };
  }

  const userIds = users.map(
    (user) => user._id
  );

  // Get push subscriptions for those users
  const subscriptions =
    await notificationRepository.findByUserIds(
      userIds
    );

  console.log(
    "Subscriptions found:",
    subscriptions.length,
    subscriptions
  );

  const notification = {
    title,
    body,
    data: notificationData || {},
  };

  let sent = 0;
  let failed = 0;

  for (const subscription of subscriptions) {
    try {
      await sendPushNotification(
          {
            endpoint: subscription.endpoint,

            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },

          notification,
        );

      sent++;

    } catch (error) {
      failed++;

      console.error(
        `Failed to send notification`,
        {
          subscriptionId: subscription._id,
          userId: subscription.user,
          statusCode: error.statusCode,
          message: error.message,
        }
      );

      // Subscription expired/unsubscribed
      if (
        error.statusCode === 404 ||
        error.statusCode === 410
      ) {
        await notificationRepository
          .deleteById(subscription._id);
      }
    }
  }

  return {
    recipients: users.length,
    subscriptions: subscriptions.length,
    sent,
    failed,
  };
}
}

export default new NotificationService();