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


/*
|--------------------------------------------------------------------------
| Get Maintenance
|--------------------------------------------------------------------------
*/

const getMaintenance = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const data =
      await maintenanceService.getMaintenance(
        userId
      );

    return sendSuccess(
      res,
      data,
      "Maintenance records fetched successfully."
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
    const userId = req.params.userId;

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
    const userId = req.params.userId;

    const data =
      await maintenanceService.createService(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Service record added successfully.",
      data,
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
    const userId = req.params.userId;

    const data =
      await maintenanceService.createVisitor(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Visitor record added successfully.",
      data,
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
    const {
      userId,
      visitorId,
    } = req.params;

    const data =
      await maintenanceService.updateVisitor(
        userId,
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

const createPurchaseRecord = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.params.userId;

    const data =
      await maintenanceService.createPurchaseRecord(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Purchase record added successfully.",
      data,
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


module.exports = {
  getMaintenance,
  createMaintenance,

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