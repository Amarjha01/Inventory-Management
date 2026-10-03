import { DG, DGMonitoring } from "./DGMonitoring.model.js";

const createDG = async (data) => {
    return await DG.create(data);
};


const getAllDG = async (kitchenId) => {
    return await DG.find({
        kitchenId,
    }).sort({
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
};
