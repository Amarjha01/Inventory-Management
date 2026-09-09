import User from "../../models/user.js";
import PushSubscription from "./notification.model.js";

class NotificationRepository {
  async create(data) {
    return await PushSubscription.create(data);
  }

  async findByEndpoint(endpoint) {
    return await PushSubscription.findOne({
      endpoint,
    });
  }

  async findByUserId(userId) {
    return await PushSubscription.find({
      userId,
    }).lean();
  }
  async findByUserIds(userIds) {
    return await PushSubscription.find({
        userId: {
            $in: userIds,
        },
    }).lean();
}

  async deleteByEndpoint(endpoint) {
    return await PushSubscription.deleteOne({
      endpoint,
    });
  }

  async deleteByUserIdAndEndpoint(userId, endpoint) {
    return await PushSubscription.deleteOne({
      userId,
      endpoint,
    });
  }

  async deleteById(id) {
    return await PushSubscription.deleteOne({
     id
    });
  }

async findAllUnsubscribedUsers() {
  const subscriptions = await PushSubscription.find().select("userId");

  const subscribedUserIds = subscriptions.map(sub => sub.userId);

  const unsubscribed = await User.find({
    _id: { $nin: subscribedUserIds },
    role: "Store Incharge"
  }).select("name");

  return unsubscribed;
}

}

export default new NotificationRepository();