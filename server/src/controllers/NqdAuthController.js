import {
    getCurrentUser,
    login
} from "../services/NqdAuthService.js";

import { sendResponse } from "../utils/NqdResponse.js";

export const loginController = async (req, res, next) => {
    try {
        const result = await login(req.body);

        return sendResponse(res, 200, {
            success: true,
            data: result,
            message: "Đăng nhập thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const getMeController = async (req, res, next) => {
    try {
        const user = await getCurrentUser(req.user._id);

        return sendResponse(res, 200, {
            success: true,
            data: user,
            message: "Lấy thông tin tài khoản thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const adminCheckController = (req, res) => {
    return sendResponse(res, 200, {
        success: true,
        data: null,
        message: "Tài khoản có quyền quản trị"
    });
};