import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const login = asyncHandler(async (req, res) => {
    console.log("req data:" , req.body);
    
    const result = await authService.login(req.body);

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success(
        res,
        MESSAGE.LOGIN_SUCCESS,
        result.user
    );
});