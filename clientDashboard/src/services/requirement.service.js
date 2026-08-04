import requirements from "../mock/requirements";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createRequirement = async (payload) => {
    await delay(500);

    const requirement = {
        id: `REQ-${Date.now()}`,
        createdAt: new Date().toLocaleString(),
        status: "SUBMITTED",
        vehicle: null,
        timeline: [
            {
                status: "SUBMITTED",
                time: new Date().toLocaleString(),
            },
            {
                status: "APPROVED",
                time: null,
            },
            {
                status: "PACKING",
                time: null,
            },
            {
                status: "PACKED",
                time: null,
            },
            {
                status: "OUT_FOR_DELIVERY",
                time: null,
            },
            {
                status: "DELIVERED",
                time: null,
            },
            {
                status: "RECEIVED",
                time: null,
            },
        ],
        receivingLetter: null,
        ...payload,
    };

    requirements.unshift(requirement);

    return requirement;
};

export const getCurrentRequirement = async () => {

    await delay(500);

    return requirements.find(
        (item) =>
            item.status !== "DELIVERED" &&
            item.status !== "RECEIVED"
    );

};

export const getRequirements = async () => {

    await delay(500);

    return requirements.filter(
        (item) =>
            item.status === "DELIVERED" ||
            item.status === "RECEIVED"
    );

};

export const getRequirementById = async (id) => {

    await delay(500);

    return requirements.find(
        (item) => item.id === id
    );

};

export const getAllRequirements = async () => {

    await delay(500);

    return requirements;

};