import Maintenance from "./maintenance.model.js";

class MaintenanceRepository {


    async findAllForAdmin(filter) {
    return await Maintenance.find(filter)
      .populate({
        path: "userId",
        select: "_id name",
      })
      .populate({
        path: "kitchenId",
        select: "_id name",
      })
      .sort({ createdAt: -1 });
  }

  
  /*
  |--------------------------------------------------------------------------
  | Find maintenance document
  |--------------------------------------------------------------------------
  */

  async findByUserId(userId) {
    console.log(userId , "at repo");
    
    const data = await Maintenance.find( {userId} );
    console.log(data , "at repo");
    return data;
    
  }

  /*
  |--------------------------------------------------------------------------
  | Create maintenance document
  |--------------------------------------------------------------------------
  */

  async create(data) {
    return await Maintenance.create(
      data
    );
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

  async addVisitor(data) {
    return await Maintenance.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Visitor
  |--------------------------------------------------------------------------
  */

async updateVisitor(userId,  {visitorId} , visitorData) {
  console.log("visitorId:", visitorId);
  console.log("visitorData:", visitorData);

  const updateFields = {};

  if (visitorData.status !== undefined) {
    updateFields["visitor.status"] = visitorData.status;
  }

  if (visitorData.feedbackTrail !== undefined) {
    updateFields["visitor.feedbackTrail"] =
      visitorData.feedbackTrail;
  }

  const updated = await Maintenance.findByIdAndUpdate(visitorId,
    {
      $set: updateFields,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  console.log("updated:", updated);

  return updated;
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

  async addPurchaseRecord(data) {
    return await Maintenance.create(data);
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
