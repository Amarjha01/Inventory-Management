import express from "express";



import {
  createService,
  updateService,
  deleteService,

  createVisitor,
  updateVisitor,
  deleteVisitor,
  createPurchaseRecord,
  updatePurchaseRecord,
  deletePurchaseRecord,

  getMaintenance,
  getAllVisitorForAdmin,
  getAllServiceForAdmin,
  getAllPurchaseForAdmin,
} from "./maintenance.controller.js";
import { uploadMaintenance } from "../../middleware/upload.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { ROLE } from "../../constants/roles.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

router.use(authenticate)

router.get(
  "/",
  getMaintenance
);

router.get(
  "/admin/purchase",
  authorize(
    ROLE.ADMIN,
    ROLE.CHIEF_COORDINATOR,
    ROLE.DISTRICT_COORDINATOR,
    ROLE.STORE_SUPERVISOR
  ),
  getAllPurchaseForAdmin
);
router.get(
  "/admin/service",
  authorize(
    ROLE.ADMIN,
    ROLE.CHIEF_COORDINATOR,
    ROLE.DISTRICT_COORDINATOR,
    ROLE.STORE_SUPERVISOR
  ),
  getAllServiceForAdmin
);
router.get(
  "/admin/visitor",
  authorize(
    ROLE.ADMIN,
    ROLE.CHIEF_COORDINATOR,
    ROLE.DISTRICT_COORDINATOR,
    ROLE.STORE_SUPERVISOR
  ),
  getAllVisitorForAdmin
);


/*
|--------------------------------------------------------------------------
| Service
|--------------------------------------------------------------------------
*/

router.post(
  "/service",
  uploadMaintenance.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  createService
);


router.put(
  "/service/:serviceId",
  uploadMaintenance.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  updateService
);


router.delete(
  "/service/:serviceId",
  deleteService
);


/*
|--------------------------------------------------------------------------
| Visitor
|--------------------------------------------------------------------------
*/

router.post(
  "/visitor",
  uploadMaintenance.fields([
    {
      name: "otherImages",
      maxCount: 3,
    },
  ]),
  createVisitor
);


router.patch(
  "/visitor/:visitorId",
  updateVisitor
);


router.delete(
  "/visitor/:visitorId",
  deleteVisitor
);


/*
|--------------------------------------------------------------------------
| Purchase
|--------------------------------------------------------------------------
*/

router.post(
  "/purchase-record",
  uploadMaintenance.fields([
    {
      name: "guaranteePhoto",
      maxCount: 1,
    },
    {
      name: "otherImages",
      maxCount: 5,
    },
  ]),
  createPurchaseRecord
);


router.put(
  "/purchase-record/:purchaseId",
  uploadMaintenance.fields([
    {
      name: "guaranteePhoto",
      maxCount: 1,
    },
    {
      name: "otherImages",
      maxCount: 5,
    },
  ]),
  updatePurchaseRecord
);


router.delete(
  "/purchase-record/:purchaseId",
  deletePurchaseRecord
);


export default router;