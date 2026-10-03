// DGMonitoring.controller.js
import DGMonitoringService from "./DGMonitoring.service.js";




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


        if (!DGID) {
            return res.status(400).json({
                success: false,
                message: "DGID is required",
            });
        }


        const dg =
            await DGMonitoringService.addDG({
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


        return res.status(201).json({
            success: true,
            message: "DG added successfully",
            data: dg,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllDG = async (req, res) => {

    try {

        const dgs =
            await DGMonitoringService.getAllDG();

        return res.status(200).json({
            success: true,
            count: dgs.length,
            data: dgs,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDailyRuntime = async (req, res) => {

    try {

        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "date is required. Format: YYYY-MM-DD",
            });
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD",
            });
        }

        const runtime =
            await DGMonitoringService.getDailyRuntime(date);

        return res.status(200).json({
            success: true,
            date,
            data: runtime,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const startDG = async (req, res) => {

    try {

        const { DGID } = req.params;

        if (!DGID) {
            return res.status(400).json({
                success: false,
                message: "DGID is required",
            });
        }

        const monitoring =
            await DGMonitoringService.startDG(DGID);

        return res.status(201).json({
            success: true,
            message: "DG started successfully",
            data: monitoring,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const stopDG = async (req, res) => {

    try {

        const { DGID } = req.params;

        if (!DGID) {
            return res.status(400).json({
                success: false,
                message: "DGID is required",
            });
        }

        const monitoring =
            await DGMonitoringService.stopDG(DGID);

        return res.status(200).json({
            success: true,
            message: "DG stopped successfully",
            data: monitoring,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const getActiveDG = async (req, res) => {

    try {

        const { DGID } = req.params;

        const monitoring =
            await DGMonitoringService.getActiveDG(DGID);

        return res.status(200).json({
            success: true,
            data: monitoring,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getDGHistory = async (req, res) => {

    try {

        const { DGID } = req.params;

        const limit =
            Math.min(Number(req.query.limit) || 50, 100);

        const skip =
            Number(req.query.skip) || 0;

        const monitoring =
            await DGMonitoringService.getDGHistory(
                DGID,
                limit,
                skip
            );

        return res.status(200).json({
            success: true,
            data: monitoring,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getLatestDGSession = async (req, res) => {

    try {

        const { DGID } = req.params;

        const monitoring =
            await DGMonitoringService.getLatestDGSession(DGID);

        return res.status(200).json({
            success: true,
            data: monitoring,
        });

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
};