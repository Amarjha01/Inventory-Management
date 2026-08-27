import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const login = asyncHandler(async (req, res) => {
    
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

export const changePassword = asyncHandler(async (req, res) => {

    const { newPassword  , id } = req.body;
    console.log("newPassword" , newPassword);
    
    const user = await authService.changePassword(
        id,
        newPassword
    );
  console.log("user" , user);
  
    return ApiResponse.success(
        res,
        "Password changed successfully",
        user
    );
});

export const logout = asyncHandler(async(req , res)=>{
    res.clearCookie("accessToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});

return ApiResponse.success(
    res,
    MESSAGE.LOGOUT_SUCCESS
)
})