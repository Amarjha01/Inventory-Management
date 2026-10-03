// DGMonitoring.service.js
import DGMonitoringRepository from "./DGMonitoring.repository.js";

const addDG = async (data) => {
  const existingDG = await DGMonitoringRepository.findDGByKitchenAndId(
    data.kitchenId,
    data.DGID,
  );

  if (existingDG) {
    throw new Error("DG with this DGID already exists in this kitchen");
  }

  const dg = await DGMonitoringRepository.createDG(data);

  return dg;
};

const getAllDG = async () => {
  return await DGMonitoringRepository.getAllDG();
};

const getDailyRuntime = async (date) => {

    const startDate = new Date(`${date}T00:00:00.000Z`);

    const endDate = new Date(`${date}T23:59:59.999Z`);

    return await DGMonitoringRepository.getDailyRuntime(
        startDate,
        endDate
    );
};

const startDG = async (DGID) => {
  const dg = await DGMonitoringRepository.findDGByDGID(DGID);

  if (!dg) {
    throw new Error(`DG ${DGID} not found`);
  }

  const existingSession = await DGMonitoringRepository.findActiveByDGId(dg._id);

  if (existingSession) {
    throw new Error("DG is already running");
  }

  const monitoring = await DGMonitoringRepository.createMonitoring({
    DGID: dg._id,
    start: new Date(),
    stop: null,
    status: "RUNNING",
    runtimeSeconds: null,
  });

  return monitoring;
};

const stopDG = async (DGID) => {
  const dg = await DGMonitoringRepository.findDGByDGID(DGID);

  if (!dg) {
    throw new Error(`DG ${DGID} not found`);
  }

  const activeSession = await DGMonitoringRepository.findActiveByDGId(dg._id);

  if (!activeSession) {
    throw new Error("No active DG session found");
  }

  const stopTime = new Date();

  const runtimeSeconds = Math.floor(
    (stopTime.getTime() - activeSession.start.getTime()) / 1000,
  );

  const monitoring = await DGMonitoringRepository.stopMonitoring(
    activeSession._id,
    {
      stop: stopTime,
      status: "STOPPED",
      runtimeSeconds,
    },
  );

  return monitoring;
};

const getActiveDG = async (DGID) => {
  return await DGMonitoringRepository.findActiveByDGId(DGID);
};

const getDGHistory = async (DGID, limit, skip) => {
  return await DGMonitoringRepository.getHistoryByDGId(DGID, limit, skip);
};

const getLatestDGSession = async (DGID) => {
  return await DGMonitoringRepository.getLatest(DGID);
};

export default {
  addDG,
  getAllDG,
  getDailyRuntime,
  startDG,
  stopDG,
  getActiveDG,
  getDGHistory,
  getLatestDGSession,
};
