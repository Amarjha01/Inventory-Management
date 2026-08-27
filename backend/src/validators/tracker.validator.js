// validator/tracker.validator.js

import requirementRepository from "../repositories/requirement.repository.js";
import { REQUIREMENT_STATUS } from "../constants/status.js";

const validateTrackerRequirement = async (req, res, next) => {
  try {
    const { id } = req.query;
    console.log("req.params" , req.query);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Requirement id is required",
      });
    }

    const requirement =
      await requirementRepository.findById(id);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    if (
      requirement.status !==
      REQUIREMENT_STATUS.OUT_FOR_DELIVERY
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Vehicle tracking is only available when the requirement is out for delivery",
      });
    }

    if (!requirement.dispatch?.vehicle) {
      return res.status(404).json({
        success: false,
        message:
          "No vehicle is assigned to this requirement",
      });
    }

    req.requirement = requirement;
    req.vehicle = requirement.dispatch.vehicle;

    next();
  } catch (error) {
    console.error(
      "Tracker validator error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to validate vehicle tracking",
    });
  }
};

export default validateTrackerRequirement;