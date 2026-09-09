import express from "express";



import {
  createService,
  updateService,
  deleteService,

  createVisitor,
  updateVisitor,
  deleteVisitor,

  // createPurchaseRecord,
  updatePurchaseRecord,
  deletePurchaseRecord,

  getMaintenance,
} from "./maintenance.controller.js";
import { uploadMaintenance } from "../../middleware/upload.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate)

router.get(
  "/",
  getMaintenance
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
      maxCount: 2,
    },
  ]),
  createService
);


router.put(
  "/service/:serviceId",
  uploadMaintenance.fields([
    {
      name: "images",
      maxCount: 2,
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
  createVisitor
);


router.put(
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

// router.post(
//   "/purchase-record",
//   uploadMaintenance.fields([
//     {
//       name: "guaranteePhoto",
//       maxCount: 1,
//     },
//     {
//       name: "otherImages",
//       maxCount: 1,
//     },
//   ]),
//   createPurchaseRecord
// );


router.put(
  "/purchase-record/:purchaseId",
  uploadMaintenance.fields([
    {
      name: "guaranteePhoto",
      maxCount: 1,
    },
    {
      name: "otherImages",
      maxCount: 1,
    },
  ]),
  updatePurchaseRecord
);


router.delete(
  "/purchase-record/:purchaseId",
  deletePurchaseRecord
);


export default router;