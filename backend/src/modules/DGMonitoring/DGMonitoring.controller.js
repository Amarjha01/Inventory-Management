
 // DGMonitoring.controller.js
import DGMonitoringService from "./DGMonitoring.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

// =====================================================
// Add DG
// =====================================================
const addDG = async (req, res) => {
  try {
    const {
      kitchenId,
      DGID,
      DGModel,
      voltage,
      SRNO,
      KVA,
      phase,
      current,
      fuelConsumptionHr,
    } = req.body;

    if (!kitchenId) {
      return res.status(400).json({
        success: false,
        message: "kitchenId is required",
      });
    }

    if (DGID === undefined || DGID === null || DGID === "") {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    const dg = await DGMonitoringService.addDG({
      kitchenId,
      DGID,
      DGModel,
      voltage,
      SRNO,
      KVA,
      phase,
      current,
      fuelConsumptionHr,
    });

    return ApiResponse.success(
      res,
      "DG added successfully",
      dg
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get all DGs
// =====================================================
const getAllDG = async (req, res) => {
  try {
    const dgs = await DGMonitoringService.getAllDG();

    return ApiResponse.success(
      res,
      "DGs retrieved successfully",
      dgs
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get daily runtime
// =====================================================
const getDailyRuntime = async (req, res) => {
  try {
    const runtime = await DGMonitoringService.getDailyRuntime();

    return ApiResponse.success(
      res,
      "Daily DG runtime retrieved successfully",
      runtime
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Start DG
// =====================================================
const startDG = async (req, res) => {
  try {
    const { DGID } = req.params;

    if (!DGID) {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    const monitoring = await DGMonitoringService.startDG(DGID);

    return ApiResponse.success(
      res,
      "DG started successfully",
      monitoring
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Stop DG
// =====================================================
const stopDG = async (req, res) => {
  try {
    const { DGID } = req.params;

    if (!DGID) {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    const monitoring = await DGMonitoringService.stopDG(DGID);

    return ApiResponse.success(
      res,
      "DG stopped successfully",
      monitoring
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get active DG session
// =====================================================
const getActiveDG = async (req, res) => {
  try {
    const { DGID } = req.params;

    if (!DGID) {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    const monitoring = await DGMonitoringService.getActiveDG(DGID);

    return ApiResponse.success(
      res,
      "Active DG session retrieved successfully",
      monitoring
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get DG history
// =====================================================
const getDGHistory = async (req, res) => {
  try {
    const { DGID } = req.params;

    if (!DGID) {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 50, 1),
      100
    );

    const skip = Math.max(
      Number(req.query.skip) || 0,
      0
    );

    const monitoring = await DGMonitoringService.getDGHistory(
      DGID,
      limit,
      skip
    );

    return ApiResponse.success(
      res,
      "DG history retrieved successfully",
      monitoring
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get latest DG session
// =====================================================
const getLatestDGSession = async (req, res) => {
  try {
    const { DGID } = req.params;

    if (!DGID) {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    const monitoring =
      await DGMonitoringService.getLatestDGSession(DGID);

    return ApiResponse.success(
      res,
      "Latest DG session retrieved successfully",
      monitoring
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// POST: Update DG health
// =====================================================
const updateDGHealth = async (req, res) => {
  try {
    const { DGID } = req.params;
    const {
      kitchenId,
      deviceId,
      wifiConnected,
      uptimeSeconds,
      freeHeapBytes,
      dgState,
      lastApiSuccess,
    } = req.body;

    if (!DGID) {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    if (!kitchenId) {
      return res.status(400).json({
        success: false,
        message: "kitchenId is required",
      });
    }

    const health = await DGMonitoringService.updateDGHealth(
      kitchenId,
      DGID,
      {
        deviceId,
        wifiConnected,
        uptimeSeconds,
        freeHeapBytes,
        dgState,
        lastApiSuccess,
      }
    );

    return ApiResponse.success(
      res,
      "DG health updated successfully",
      health
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET: DG health
// =====================================================
const getDGHealth = async (req, res) => {
  try {
    const { DGID } = req.params;
    const { kitchenId } = req.query;

    if (!DGID) {
      return res.status(400).json({
        success: false,
        message: "DGID is required",
      });
    }

    if (!kitchenId) {
      return res.status(400).json({
        success: false,
        message: "kitchenId is required",
      });
    }

    const health = await DGMonitoringService.getDGHealth(
      kitchenId,
      DGID
    );

    if (!health) {
      return res.status(404).json({
        success: false,
        message: "DG health record not found",
      });
    }

    return ApiResponse.success(
      res,
      "DG health retrieved successfully",
      health
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addDG,
  getAllDG,
  getDailyRuntime,
  startDG,
  stopDG,
  getActiveDG,
  getDGHistory,
  getLatestDGSession,
  updateDGHealth,
  getDGHealth,
};
