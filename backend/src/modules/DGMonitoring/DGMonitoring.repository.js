// DGMonitoring.repository.js
import {DG, DGMonitoring} from "./DGMonitoring.model.js";

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
        DGID,
    });
};

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
    createDG,
    getAllDG,
    findDGByKitchenAndId,

    createMonitoring,
    findActiveByDGId,
    findById,
    stopMonitoring,
    getHistoryByDGId,
    getLatest,
};