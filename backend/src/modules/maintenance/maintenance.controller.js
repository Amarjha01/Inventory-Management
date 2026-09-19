import ApiResponse from "../../utils/ApiResponse.js";
import maintenanceService from "./maintenance.service.js";


/*
|--------------------------------------------------------------------------
| Response Helper
|--------------------------------------------------------------------------
*/

const sendSuccess = (
  res,
  data,
  message = "Success"
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const getAllVisitorForAdmin = async (req, res, next) => {
  try {
    const filter = {
      visitor: {
        $exists: true,
        $ne: null,
      },
    };

    const data =
      await maintenanceService.findAllForAdmin(filter);

    return ApiResponse.success(
      res,
      "All visitor records fetched successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};


const getAllServiceForAdmin = async (req, res, next) => {
  try {
    const filter = {
      service: {
        $exists: true,
        $ne: null,
      },
    };

    const data =
      await maintenanceService.findAllForAdmin(filter);

    return ApiResponse.success(
      res,
      "All service records fetched successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};


const getAllPurchaseForAdmin = async (req, res, next) => {
  try {
    const filter = {
      purchaseRecord: {
        $exists: true,
        $ne: null,
      },
    };

    const data =
      await maintenanceService.findAllForAdmin(filter);

    return ApiResponse.success(
      res,
      "All purchase records fetched successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Maintenance
|--------------------------------------------------------------------------
*/

const getMaintenance = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    
    const data =
      await maintenanceService.findByUserId(
        userId
      );
      console.log("maintenance data:", data);
      
     return ApiResponse.success(
      res,
      "Maintenance records fetched successfully.",
       data
    );
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| Create Maintenance
|--------------------------------------------------------------------------
*/

const createMaintenance = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user._id;

    const data =
      await maintenanceService.createMaintenance(
        userId
      );

    return res.status(201).json({
      success: true,
      message:
        "Maintenance record created successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| SERVICE
|--------------------------------------------------------------------------
*/

const createService = async (
  req,
  res,
  next
) => {
  try {
    const userId = req?.user._id;
    const kitchenId = req?.user.kitchenId
    const { type, ...body } = req.body;
      body.images = req.files.images.map((element)=>element.filename)
        const data = {
          userId,
          kitchenId,
          service: body,
        };

     const savedData = await maintenanceService.create(data);

    return res.status(201).json({
      success: true,
      message:
        "Service record added successfully.",
      savedData,
    });
  } catch (error) {
    next(error);
  }
};


const updateService = async (
  req,
  res,
  next
) => {
  try {
    const {
      userId,
      serviceId,
    } = req.params;

    const data =
      await maintenanceService.updateService(
        userId,
        serviceId,
        req.body
      );

    return sendSuccess(
      res,
      data,
      "Service record updated successfully."
    );
  } catch (error) {
    next(error);
  }
};


const deleteService = async (
  req,
  res,
  next
) => {
  try {
    const {
      userId,
      serviceId,
    } = req.params;

    const data =
      await maintenanceService.deleteService(
        userId,
        serviceId
      );

    return sendSuccess(
      res,
      data,
      "Service record deleted successfully."
    );
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| VISITOR
|--------------------------------------------------------------------------
*/

const createVisitor = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user._id;
    const files = req.files;
     

    const body = { ...req.body };    
    body.otherImages =
      files?.otherImages?.map((element) => element.filename) || [];
    const kitchenId = req?.user.kitchenId
      const  data = {
          userId,
          kitchenId,
          visitor: body,
        };

    const savedData =
      await maintenanceService.addVisitor(data);

    return res.status(201).json({
      success: true,
      message:
        "Visitor record added successfully.",
      savedData,
    });
  } catch (error) {
    next(error);
  }
};


const updateVisitor = async (
  req,
  res,
  next
) => {
  try {
    const visitorId= req.params;
    const user = req.user;

    const data =
      await maintenanceService.updateVisitor(
        user._id,
        visitorId,
        req.body
      );

    return sendSuccess(
      res,
      data,
      "Visitor record updated successfully."
    );
  } catch (error) {
    next(error);
  }
};


const deleteVisitor = async (
  req,
  res,
  next
) => {
  try {
    const {
      userId,
      visitorId,
    } = req.params;

    const data =
      await maintenanceService.deleteVisitor(
        userId,
        visitorId
      );

    return sendSuccess(
      res,
      data,
      "Visitor record deleted successfully."
    );
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| PURCHASE RECORD
|--------------------------------------------------------------------------
*/

const createPurchaseRecord = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const body = { ...req.body };
    const kitchenId = req?.user.kitchenId
    const files = req.files;

    console.log("files" , files);

    // Add guarantee photo
    body.guaranteePhoto = files?.guaranteePhoto?.[0]?.filename;

    // Add other images
    body.otherImages =
      files?.otherImages?.map((element) => element.filename) || [];

    const data = {
      userId,
      kitchenId,
      purchaseRecord: body,
    };
    const savedData =
      await maintenanceService.addPurchaseRecord(data);

    return res.status(201).json({
      success: true,
      message: "Purchase record added successfully.",
      savedData,
    });
  } catch (error) {
    next(error);
  }
};



const updatePurchaseRecord = async (
  req,
  res,
  next
) => {
  try {
    const {
      userId,
      purchaseId,
    } = req.params;

    const data =
      await maintenanceService.updatePurchaseRecord(
        userId,
        purchaseId,
        req.body
      );

    return sendSuccess(
      res,
      data,
      "Purchase record updated successfully."
    );
  } catch (error) {
    next(error);
  }
};


const deletePurchaseRecord = async (
  req,
  res,
  next
) => {
  try {
    const {
      userId,
      purchaseId,
    } = req.params;

    const data =
      await maintenanceService.deletePurchaseRecord(
        userId,
        purchaseId
      );

    return sendSuccess(
      res,
      data,
      "Purchase record deleted successfully."
    );
  } catch (error) {
    next(error);
  }
};


export {
  getMaintenance,
  createMaintenance,
  getAllVisitorForAdmin,
  getAllServiceForAdmin,
  getAllPurchaseForAdmin,

  createService,
  updateService,
  deleteService,

  createVisitor,
  updateVisitor,
  deleteVisitor,

  createPurchaseRecord,
  updatePurchaseRecord,
  deletePurchaseRecord,
};