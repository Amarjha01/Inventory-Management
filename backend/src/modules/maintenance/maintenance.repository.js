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
      ?.populate({
        path: "visitor.feedbackTrail.sentBy",
        select: "name",
      })
      .sort({ createdAt: -1 });
  }

  
  /*
  |--------------------------------------------------------------------------
  | Find maintenance document by user ID
  |--------------------------------------------------------------------------
  */

  async findByUserId(userId , filter) {
    const data = await Maintenance.find({userId , ...filter})
      .populate({
        path: "userId",
        select: "_id name",
      })
      .populate({
        path: "kitchenId",
        select: "_id name",
      })
      ?.populate({
        path: "visitor.feedbackTrail.sentBy",
        select: "name",
      })
      .sort({ createdAt: -1 });
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

async updateVisitor(userId, { visitorId }, visitorData , images) {
  const updateFields = {};

  if (visitorData.status !== undefined) {
    updateFields["visitor.status"] = visitorData.status;
  }

  const updateQuery = {};

  if (Object.keys(updateFields).length) {
    updateQuery.$set = updateFields;
  }


if (images && images.length > 0) {
  updateQuery.$push = {
    "visitor.otherImages": {
      $each: images
    }
  };
}

  if (visitorData.message !== undefined) {
    console.log("visitorData.message" , visitorData.message);
    
    updateQuery.$push = {
      "visitor.feedbackTrail": {
        sentBy: userId,
        message: visitorData.message,
        createdAt: new Date(),
      },
    };
  }

  console.log("updateQuery" , updateQuery);
  
  const updated = await Maintenance.findByIdAndUpdate(
    visitorId,
    updateQuery,
    {
      new: true,
      runValidators: true,
    }
  )
  .populate({
    path: "visitor.feedbackTrail.sentBy", 
    select: "name"
  })

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
