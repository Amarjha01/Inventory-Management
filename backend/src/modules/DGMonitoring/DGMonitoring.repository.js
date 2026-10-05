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

const getDailyRuntime = async (DGObjectId = null) => {
    const match = {};

    // Optional: get runtime for one DG only
    if (DGObjectId) {
        match.DGID = DGObjectId;
    }

    return await DGMonitoring.aggregate([
        {
            $match: match,
        },

        {
            $project: {
                DGID: 1,
                start: 1,
                stop: {
                    $ifNull: ["$stop", new Date()],
                },
            },
        },

        /*
         * Find the first and last day of each
         * monitoring session.
         */
        {
            $project: {
                DGID: 1,
                start: 1,
                stop: 1,

                startDay: {
                    $dateTrunc: {
                        date: "$start",
                        unit: "day",
                    },
                },

                stopDay: {
                    $dateTrunc: {
                        date: "$stop",
                        unit: "day",
                    },
                },
            },
        },

        /*
         * Generate every day touched by
         * this monitoring session.
         */
        {
            $project: {
                DGID: 1,
                start: 1,
                stop: 1,

                days: {
                    $map: {
                        input: {
                            $range: [
                                0,
                                {
                                    $add: [
                                        {
                                            $dateDiff: {
                                                startDate: "$startDay",
                                                endDate: "$stopDay",
                                                unit: "day",
                                            },
                                        },
                                        1,
                                    ],
                                },
                            ],
                        },

                        as: "dayOffset",

                        in: {
                            $dateAdd: {
                                startDate: "$startDay",
                                unit: "day",
                                amount: "$$dayOffset",
                            },
                        },
                    },
                },
            },
        },

        {
            $unwind: "$days",
        },

        /*
         * Calculate the actual start/end time
         * inside each individual day.
         */
        {
            $project: {
                DGID: 1,

                day: "$days",

                dayStart: {
                    $cond: [
                        {
                            $gt: ["$start", "$days"],
                        },
                        "$start",
                        "$days",
                    ],
                },

                dayEnd: {
                    $cond: [
                        {
                            $lt: [
                                "$stop",
                                {
                                    $dateAdd: {
                                        startDate: "$days",
                                        unit: "day",
                                        amount: 1,
                                    },
                                },
                            ],
                        },
                        "$stop",
                        {
                            $dateAdd: {
                                startDate: "$days",
                                unit: "day",
                                amount: 1,
                            },
                        },
                    ],
                },
            },
        },

        /*
         * Runtime for this particular day.
         */
        {
            $project: {
                DGID: 1,
                day: 1,

                runtimeSeconds: {
                    $max: [
                        0,
                        {
                            $divide: [
                                {
                                    $subtract: [
                                        "$dayEnd",
                                        "$dayStart",
                                    ],
                                },
                                1000,
                            ],
                        },
                    ],
                },
            },
        },

        /*
         * Multiple START/STOP sessions can exist
         * on the same day.
         *
         * Add them together.
         */
        {
            $group: {
                _id: {
                    DGID: "$DGID",
                    day: "$day",
                },

                runtimeSeconds: {
                    $sum: "$runtimeSeconds",
                },
            },
        },

        /*
         * Get DG master information.
         */
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

        /*
         * Final response.
         */
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
                DGID: 1,
                date: 1,
            },
        },
    ]);
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
    getDailyRuntime
};
