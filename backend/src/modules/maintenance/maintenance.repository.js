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

async updateService(serviceId, serviceData, userId) {
  console.log("serviceId, serviceData, userId", serviceId, serviceData, userId);

  // Construct dot-notation fields for the embedded service object
  const updateFields = {};
  for (const [key, value] of Object.entries(serviceData)) {
    updateFields[`service.${key}`] = value;
  }
  updateFields["service.updatedBy"] = userId;

  return await Maintenance.findByIdAndUpdate(
    serviceId,
    {
      $set: updateFields,
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

  async deleteService( serviceId) {
    return await Maintenance.deleteOne({_id:serviceId});
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

async updateVisitor(userId, { visitorId }, visitorData, images) {
  const updateFields = {};
  const pushFields = {};

  // 1. Handle status and text field updates
  if (visitorData.status !== undefined) {
    updateFields["visitor.status"] = visitorData.status;
  }
  if (visitorData.visitorName !== undefined) {
    updateFields["visitor.visitorName"] = visitorData.visitorName;
  }
  if (visitorData.phoneNumber !== undefined) {
    updateFields["visitor.phoneNumber"] = visitorData.phoneNumber;
  }
  if (visitorData.problemDate !== undefined) {
    updateFields["visitor.problemDate"] = visitorData.problemDate;
  }
  if (visitorData.reason !== undefined) {
    updateFields["visitor.reason"] = visitorData.reason;
  }

  // 2. Handle image updates (Combining existing kept images and newly uploaded files)
  if (visitorData.existingImages !== undefined) {
    let existing = visitorData.existingImages;
    if (typeof existing === "string") {
      existing = [existing];
    }
    
    // Extract filenames from newly uploaded multer files
    const newFileNames = images && images.length > 0 
      ? images.map((file) => file.filename || file) 
      : [];

    // Overwrite with the definitive list of final images using $set
    updateFields["visitor.otherImages"] = [...existing, ...newFileNames];
  } else if (images && images.length > 0) {
    // Fallback: If only pushing new files without existing image arrays
    const newFileNames = images.map((file) => file.filename || file);
    pushFields["visitor.otherImages"] = {
      $each: newFileNames,
    };
  }

  // 3. Handle Feedback Trail message append
  if (visitorData.message !== undefined && visitorData.message.trim() !== "") {
    pushFields["visitor.feedbackTrail"] = {
      sentBy: userId,
      message: visitorData.message,
      createdAt: new Date(),
    };
  }

  // 4. Construct final Mongoose update operators safely
  const updateQuery = {};

  if (Object.keys(updateFields).length > 0) {
    updateQuery.$set = updateFields;
  }

  if (Object.keys(pushFields).length > 0) {
    updateQuery.$push = pushFields;
  }

  console.log("Final updateQuery:", updateQuery);

  const updated = await Maintenance.findByIdAndUpdate(
    visitorId,
    updateQuery,
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: "visitor.feedbackTrail.sentBy",
    select: "name username email",
  });

  return updated;
}




  /*
  |--------------------------------------------------------------------------
  | Delete Visitor
  |--------------------------------------------------------------------------
  */

  async deleteVisitor( visitorId) {
    return await Maintenance.deleteOne({_id:visitorId});
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
async updatePurchaseRecord(userId, purchaseId, purchaseData, files) {
  const updateFields = {};
  const pushFields = {};

  // 1. Text fields mapping
  if (purchaseData.partName !== undefined) {
    updateFields["purchaseRecord.partName"] = purchaseData.partName;
  }
  if (purchaseData.companyName !== undefined) {
    updateFields["purchaseRecord.companyName"] = purchaseData.companyName;
  }
  if (purchaseData.partyName !== undefined) {
    updateFields["purchaseRecord.partyName"] = purchaseData.partyName;
  }
  if (purchaseData.purchaseDate !== undefined) {
    updateFields["purchaseRecord.purchaseDate"] = purchaseData.purchaseDate;
  }
  if (purchaseData.ReceivedDate !== undefined) {
    updateFields["purchaseRecord.ReceivedDate"] = purchaseData.ReceivedDate;
  }
  if (purchaseData.expiryWarrantyYear !== undefined) {
    updateFields["purchaseRecord.expiryWarrantyYear"] = purchaseData.expiryWarrantyYear;
  }
  if (purchaseData.narration !== undefined) {
    updateFields["purchaseRecord.narration"] = purchaseData.narration;
  }

  // 2. Handle Guarantee Photo file or existing URL retention
  const guaranteeFile = files?.guaranteePhoto?.[0];
  if (guaranteeFile) {
    updateFields["purchaseRecord.guaranteePhoto"] = guaranteeFile.filename || guaranteeFile;
  } else if (purchaseData.existingGuaranteePhoto !== undefined) {
    updateFields["purchaseRecord.guaranteePhoto"] = purchaseData.existingGuaranteePhoto;
  }

  // 3. Handle Other Attachments / Images
  if (purchaseData.existingOtherImages !== undefined) {
    let existing = purchaseData.existingOtherImages;
    if (typeof existing === "string") {
      existing = [existing];
    }
    const newFiles = files?.otherImages 
      ? files.otherImages.map((f) => f.filename || f) 
      : [];
    updateFields["purchaseRecord.otherImages"] = [...existing, ...newFiles];
  } else if (files?.otherImages && files.otherImages.length > 0) {
    const newFiles = files.otherImages.map((f) => f.filename || f);
    pushFields["purchaseRecord.otherImages"] = { $each: newFiles };
  }

  // 4. Construct Query
  const updateQuery = {};
  if (Object.keys(updateFields).length > 0) {
    updateQuery.$set = updateFields;
  }
  if (Object.keys(pushFields).length > 0) {
    updateQuery.$push = pushFields;
  }

  // Using the parent record's id (or purchaseRecord._id depending on your schema setup)
  const updated = await Maintenance.findOneAndUpdate(
    {
      $or: [
        { _id: purchaseId },
        { "purchaseRecord._id": purchaseId }
      ]
    },
    updateQuery,
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: "userId",
    select: "name username email",
  });

  return updated;
}

  /*
  |--------------------------------------------------------------------------
  | Delete Purchase Record
  |--------------------------------------------------------------------------
  */

  async deletePurchaseRecord(purchaseId) {
       return await Maintenance.deleteOne({_id:purchaseId});

  }
}

export default new MaintenanceRepository();
