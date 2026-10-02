// DGMonitoring.controller.js
import DGMonitoringService from "./DGMonitoring.service.js";


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
    startDG,
    stopDG,
    getActiveDG,
    getDGHistory,
    getLatestDGSession,
};