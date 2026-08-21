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
}

export default new NotificationRepository();