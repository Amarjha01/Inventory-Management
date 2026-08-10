import { randomUUID } from "crypto";

const generateRequirementNumber = () => {

    return `REQ-${Date.now()}-${randomUUID().slice(0,6).toUpperCase()}`;

};

export default generateRequirementNumber;