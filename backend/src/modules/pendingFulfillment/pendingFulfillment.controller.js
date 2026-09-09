import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import pendingFulfillmentService from "./pendingFulfillment.service.js";

// ======================================================
// CREATE PENDING ITEM
// ======================================================

export const createPendingFulfillment =
  asyncHandler(async (req, res) => {
   

    const pending =
      await pendingFulfillmentService.createFromRequirement(
        req.body.payload,
        req.user,
      );

    return ApiResponse.success(
      res,
      "Item added to pending fulfillment successfully",
      pending,
    );
  });

// ======================================================
// getUndispatchedRequirementId PENDING ITEM
// ======================================================

export const getUndispatchedRequirementId =
  asyncHandler(async (req, res) => {
   
     const kitchenId = req.query.kitchenId;
    
    const allUndispatchedRequirementId =
      await pendingFulfillmentService.fetchUnDispatchedRequirementByKitchenId(
        kitchenId,
      );
      console.log("allUndispatchedRequirementId" , allUndispatchedRequirementId);
      
    return ApiResponse.success(
      res,
      "fetched allUndispatchedRequirementId successfully",
      allUndispatchedRequirementId,
    );
  });


// ======================================================
// GET ACTIVE PENDING ITEMS
// ======================================================

export const getPendingFulfillments =
  asyncHandler(async (req, res) => {

    const filter = {};

    if (req.query.kitchenId) {
      filter.kitchenId = req.query.kitchenId;
    }

    const pending =
      await pendingFulfillmentService.getPending(
        filter,
      );

    return ApiResponse.success(
      res,
      "Pending fulfillment items fetched successfully",
      pending,
    );
  });


// ======================================================
// GET ONE KITCHEN'S PENDING FULFILLMENT
// ======================================================

export const getPendingFulfillment =
  asyncHandler(async (req, res) => {

    const pending =
      await pendingFulfillmentService.getById(
        req.params.id,
      );

    return ApiResponse.success(
      res,
      "Pending fulfillment fetched successfully",
      pending,
    );
  });


// ======================================================
// MARK PENDING ITEM AS FULFILLED
// ======================================================

export const fulfillPendingItem =
  asyncHandler(async (req, res) => {

    const {
      pendingItemId,
      dispatchedRequirementId,
    } = req.body;

    const pending =
      await pendingFulfillmentService.markItemFulfilled(
        req.params.id,
        pendingItemId,
        dispatchedRequirementId,
        req.user._id,
      );

    return ApiResponse.success(
      res,
      "Pending item fulfilled successfully",
      pending,
    );
  });


// ======================================================
// CANCEL PENDING ITEM
// ======================================================

export const cancelPendingItem =
  asyncHandler(async (req, res) => {

    const {
      pendingItemId,
    } = req.body;

    const pending =
      await pendingFulfillmentService.cancelItem(
        req.params.id,
        pendingItemId,
        req.user._id,
      );

    return ApiResponse.success(
      res,
      "Pending item cancelled successfully",
      pending,
    );
  });

export const mergeItems =
  asyncHandler(async(req , res)=>{
   const id  = req.body.id;
   const payload = req.body.payload
   const user = req.user._id
   const merged = await pendingFulfillmentService.mergePendingItem(id , payload , user)
    // console.log("data at controller" ,id , payload);
    
    return ApiResponse.success(
      res,
      "item merged",
      merged
    )
  })