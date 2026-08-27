import trackingService from "./tracking.service.js";

const getLiveLocations = async (req, res) => {
  try {
    const result =
      await trackingService.getLiveLocations("BR31GC5932");
    console.log("tracking URL" , result);
    
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),

      data: result.vehicles,

      errors: result.errors,
    });
  } catch (error) {
    console.error(
      "Tracking controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch vehicle locations",
    });
  }
};
const getLiveLocationsByVehicle = async (req, res) => {
  try {
    const result =
      await trackingService.getLiveLocationsBYvehicle(req.vehicle);
      console.log("result" , result);
      
    
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),

      data: result,

      errors: result.errors,
    });
  } catch (error) {
    console.error(
      "Tracking controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch vehicle locations",
    });
  }
};

export {
  getLiveLocations,
  getLiveLocationsByVehicle
};