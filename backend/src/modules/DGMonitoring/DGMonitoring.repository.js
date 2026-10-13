import mongoose from "mongoose";
import { DG, DGMonitoring } from "./DGMonitoring.model.js";

const createDG = async (data) => {
    return await DG.create(data);
};


const getAllDG = async (kitchenId) => {
    return await DG.find().sort({
        DGID: 1,
    });
};


const findDGByKitchenAndId = async (kitchenId, DGID) => {
    return await DG.findOne({
        kitchenId,
        DGID: Number(DGID),
    });
};


// Find DG master record using numeric DGID
const findDGByDGID = async (DGID) => {
    return await DG.findOne({
        DGID: Number(DGID),
    });
};


// Create monitoring record
const createMonitoring = async (data) => {
    return await DGMonitoring.create(data);
};


// DGMonitoring.DGID is ObjectId
const findActiveByDGId = async (DGObjectId) => {
    return await DGMonitoring.findOne({
        DGID: DGObjectId,
        status: "RUNNING",
        stop: null,
    });
};


const findById = async (id) => {
    return await DGMonitoring.findById(id);
};


const stopMonitoring = async (id, data) => {
    return await DGMonitoring.findByIdAndUpdate(
        id,
        {
            $set: data,
        },
        {
            new: true,
            runValidators: true,
        }
    );
};


const getHistoryByDGId = async (
    DGObjectId,
    limit = 50,
    skip = 0
) => {

    return await DGMonitoring.find({
        DGID: DGObjectId,
    })
        .sort({ start: -1 })
        .skip(skip)
        .limit(limit);
};


const getLatest = async (DGObjectId) => {

    return await DGMonitoring.findOne({
        DGID: DGObjectId,
    })
        .sort({ start: -1 });
};

const getDailyRuntime = async (
  DGObjectId = "6ac0c6adcde799bc04f9fda3",
) => {
  const match = {};

  if (DGObjectId) {
    match.DGID = new mongoose.Types.ObjectId(DGObjectId);
  }

  const DGMonitoringData = await DGMonitoring.aggregate([
    {
      $match: match,
    },

    // ---------------------------------------------
    // Group by DG + calendar day
    // ---------------------------------------------
    {
      $group: {
        _id: {
          DGID: "$DGID",

          day: {
            $dateTrunc: {
              date: "$start",
              unit: "day",
              timezone: "Asia/Kolkata",
            },
          },
        },

        // Simply ADD all stored runtimeSeconds
        runtimeSeconds: {
          $sum: {
            $ifNull: ["$runtimeSeconds", 0],
          },
        },
      },
    },

    // ---------------------------------------------
    // Get DG information
    // ---------------------------------------------
    {
      $lookup: {
        from: "dgs",
        localField: "_id.DGID",
        foreignField: "_id",
        as: "dg",
      },
    },

    {
      $unwind: "$dg",
    },

    // ---------------------------------------------
    // Final response
    // ---------------------------------------------
    {
      $project: {
        _id: 0,

        DGObjectId: "$_id.DGID",

        DGID: "$dg.DGID",

        date: "$_id.day",

        runtimeSeconds: {
          $round: [
            "$runtimeSeconds",
            0,
          ],
        },

        runtimeMinutes: {
          $round: [
            {
              $divide: [
                "$runtimeSeconds",
                60,
              ],
            },
            2,
          ],
        },

        runtimeHours: {
          $round: [
            {
              $divide: [
                "$runtimeSeconds",
                3600,
              ],
            },
            2,
          ],
        },
      },
    },

    {
      $sort: {
        date: 1,
      },
    },
  ]);

  return DGMonitoringData;
};

// Update DG health report
const updateDGHealth = async (DGID, data) => {
  return await DG.findOneAndUpdate(
    {
      DGID: Number(DGID),
    },
    {
      $set: {
        wifiConnected: data.wifiConnected,
        uptimeSeconds: data.uptimeSeconds,
        freeHeapBytes: data.freeHeapBytes,
        dgState: data.dgState,
        lastApiSuccess: data.lastApiSuccess,
        lastHealthReportAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// Get DG health report
const getDGHealth = async (DGID) => {
  return await DG.findOne(
    {
      DGID: Number(DGID),
    },
    {
      deviceId: 1,
      deviceStatus: 1,
      wifiConnected: 1,
      uptimeSeconds: 1,
      freeHeapBytes: 1,
      dgState: 1,
      lastApiSuccess: 1,
      lastHealthReportAt: 1,
    }
  );
};

export default {
    createDG,
    getAllDG,
    findDGByKitchenAndId,
    findDGByDGID,

    createMonitoring,
    findActiveByDGId,
    findById,
    stopMonitoring,
    getHistoryByDGId,
    getLatest,
    getDailyRuntime,

    updateDGHealth,
    getDGHealth,
};
