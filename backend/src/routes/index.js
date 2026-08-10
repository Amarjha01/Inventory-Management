import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import kitchenRoutes from "./kitchen.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import requirementRoutes from "./requirement.routes.js";
import vehicleRoutes from "./vehicle.routes.js";
import driverRoutes from "./driver.routes.js";
import reports from "./report.routes.js"

const router = Router();

router.get("/health", (req, res) => {

    res.status(200).json({

        success: true,

        message: "Server is running"

    });

});

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/kitchens", kitchenRoutes);

router.use("/inventory", inventoryRoutes);

router.use("/requirements", requirementRoutes);

router.use("/vehicles", vehicleRoutes);

router.use("/drivers", driverRoutes);

router.use("/reports", reports);

export default router;