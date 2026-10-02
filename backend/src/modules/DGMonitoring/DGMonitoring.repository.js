// DGMonitoring.repository.js
import {DGMonitoring} from "./DGMonitoring.model.js";

const createMonitoring = async (data) => {
    return await DGMonitoring.create(data);
};

const findActiveByDGId = async (DGID) => {
    return await DGMonitoring.findOne({
        DGID,
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

const getHistoryByDGId = async (DGID, limit = 50, skip = 0) => {
    return await DGMonitoring.find({ DGID })
        .sort({ start: -1 })
        .skip(skip)
        .limit(limit);
};

const getLatest = async (DGID) => {
    return await DGMonitoring.findOne({ DGID })
        .sort({ start: -1 });
};

export default {
    createMonitoring,
    findActiveByDGId,
    findById,
    stopMonitoring,
    getHistoryByDGId,
    getLatest,
};