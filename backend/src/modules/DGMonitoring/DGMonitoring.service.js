// DGMonitoring.service.js
import DGMonitoringRepository from "./DGMonitoring.repository.js";


const addDG = async (data) => {

    const existingDG =
        await DGMonitoringRepository.findDGByKitchenAndId(
            data.kitchenId,
            data.DGID
        );


    if (existingDG) {
        throw new Error(
            "DG with this DGID already exists in this kitchen"
        );
    }


    const dg =
        await DGMonitoringRepository.createDG(data);


    return dg;
};

const getAllDG = async () => {

    return await DGMonitoringRepository.getAllDG();
};


const startDG = async (DGID) => {

    const existingSession =
        await DGMonitoringRepository.findActiveByDGId(DGID);

    if (existingSession) {
        throw new Error("DG is already running");
    }

    const monitoring =
        await DGMonitoringRepository.createMonitoring({
            DGID,
            start: new Date(),
            stop: null,
            status: "RUNNING",
            runtimeSeconds: null,
        });

    return monitoring;
};


const stopDG = async (DGID) => {

    const activeSession =
        await DGMonitoringRepository.findActiveByDGId(DGID);

    if (!activeSession) {
        throw new Error("No active DG session found");
    }

    const stopTime = new Date();

    const runtimeSeconds = Math.floor(
        (stopTime.getTime() - activeSession.start.getTime()) / 1000
    );

    const monitoring =
        await DGMonitoringRepository.stopMonitoring(
            activeSession._id,
            {
                stop: stopTime,
                status: "STOPPED",
                runtimeSeconds,
            }
        );

    return monitoring;
};


const getActiveDG = async (DGID) => {

    return await DGMonitoringRepository.findActiveByDGId(DGID);
};


const getDGHistory = async (DGID, limit, skip) => {

    return await DGMonitoringRepository.getHistoryByDGId(
        DGID,
        limit,
        skip
    );
};


const getLatestDGSession = async (DGID) => {

    return await DGMonitoringRepository.getLatest(DGID);
};


export default {
    addDG,
    getAllDG,
    startDG,
    stopDG,
    getActiveDG,
    getDGHistory,
    getLatestDGSession,
};