import Maintenance from "./maintenance.model.js" 


/*
|--------------------------------------------------------------------------
| Find maintenance document
|--------------------------------------------------------------------------
*/

const findByUserId = async (userId) => {
  return await Maintenance.findOne({ userId });
};


/*
|--------------------------------------------------------------------------
| Create maintenance document
|--------------------------------------------------------------------------
*/

const create = async (data) => {
  return await Maintenance.create(data);
};


/*
|--------------------------------------------------------------------------
| Add Service
|--------------------------------------------------------------------------
*/

const addService = async (userId, serviceData) => {
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
};


/*
|--------------------------------------------------------------------------
| Update Service
|--------------------------------------------------------------------------
*/

const updateService = async (
  userId,
  serviceId,
  serviceData
) => {
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
};


/*
|--------------------------------------------------------------------------
| Delete Service
|--------------------------------------------------------------------------
*/

const deleteService = async (
  userId,
  serviceId
) => {
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
};


/*
|--------------------------------------------------------------------------
| Add Visitor
|--------------------------------------------------------------------------
*/

const addVisitor = async (
  userId,
  visitorData
) => {
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
};


/*
|--------------------------------------------------------------------------
| Update Visitor
|--------------------------------------------------------------------------
*/

const updateVisitor = async (
  userId,
  visitorId,
  visitorData
) => {
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
};


/*
|--------------------------------------------------------------------------
| Delete Visitor
|--------------------------------------------------------------------------
*/

const deleteVisitor = async (
  userId,
  visitorId
) => {
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
};


/*
|--------------------------------------------------------------------------
| Add Purchase Record
|--------------------------------------------------------------------------
*/

const addPurchaseRecord = async (
  userId,
  purchaseData
) => {
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
};


/*
|--------------------------------------------------------------------------
| Update Purchase Record
|--------------------------------------------------------------------------
*/

const updatePurchaseRecord = async (
  userId,
  purchaseId,
  purchaseData
) => {
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
};


/*
|--------------------------------------------------------------------------
| Delete Purchase Record
|--------------------------------------------------------------------------
*/

const deletePurchaseRecord = async (
  userId,
  purchaseId
) => {
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
};


module.exports = {
  findByUserId,
  create,

  addService,
  updateService,
  deleteService,

  addVisitor,
  updateVisitor,
  deleteVisitor,

  addPurchaseRecord,
  updatePurchaseRecord,
  deletePurchaseRecord,
};