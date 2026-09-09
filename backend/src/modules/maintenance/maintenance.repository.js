import Maintenance from "./maintenance.model.js";

class MaintenanceRepository {
  /*
  |--------------------------------------------------------------------------
  | Find maintenance document
  |--------------------------------------------------------------------------
  */

  async findByUserId(userId) {
    return await Maintenance.findOne({ userId });
  }

  /*
  |--------------------------------------------------------------------------
  | Create maintenance document
  |--------------------------------------------------------------------------
  */

  async create(data) {
    return await Maintenance.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Add Service
  |--------------------------------------------------------------------------
  */

  async addService(userId, serviceData) {
    return await Maintenance.findOneAndUpdate(
      { userId },
      {
        $push: {
          service: serviceData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Service
  |--------------------------------------------------------------------------
  */

  async updateService(userId, serviceId, serviceData) {
    return await Maintenance.findOneAndUpdate(
      {
        userId,
        "service._id": serviceId,
      },
      {
        $set: {
          "service.$": serviceData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Service
  |--------------------------------------------------------------------------
  */

  async deleteService(userId, serviceId) {
    return await Maintenance.findOneAndUpdate(
      { userId },
      {
        $pull: {
          service: {
            _id: serviceId,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Add Visitor
  |--------------------------------------------------------------------------
  */

  async addVisitor(userId, visitorData) {
    return await Maintenance.findOneAndUpdate(
      { userId },
      {
        $push: {
          visitor: visitorData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Visitor
  |--------------------------------------------------------------------------
  */

  async updateVisitor(userId, visitorId, visitorData) {
    return await Maintenance.findOneAndUpdate(
      {
        userId,
        "visitor._id": visitorId,
      },
      {
        $set: {
          "visitor.$": visitorData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Visitor
  |--------------------------------------------------------------------------
  */

  async deleteVisitor(userId, visitorId) {
    return await Maintenance.findOneAndUpdate(
      { userId },
      {
        $pull: {
          visitor: {
            _id: visitorId,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Add Purchase Record
  |--------------------------------------------------------------------------
  */

  async addPurchaseRecord(userId, purchaseData) {
    return await Maintenance.findOneAndUpdate(
      { userId },
      {
        $push: {
          purchaseRecord: purchaseData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Purchase Record
  |--------------------------------------------------------------------------
  */

  async updatePurchaseRecord(
    userId,
    purchaseId,
    purchaseData
  ) {
    return await Maintenance.findOneAndUpdate(
      {
        userId,
        "purchaseRecord._id": purchaseId,
      },
      {
        $set: {
          "purchaseRecord.$": purchaseData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Purchase Record
  |--------------------------------------------------------------------------
  */

  async deletePurchaseRecord(userId, purchaseId) {
    return await Maintenance.findOneAndUpdate(
      { userId },
      {
        $pull: {
          purchaseRecord: {
            _id: purchaseId,
          },
        },
      },
      {
        new: true,
      }
    );
  }
}

export default new MaintenanceRepository();
