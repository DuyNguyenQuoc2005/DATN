import {
    createUser,
    getUser,
    getUsers,
    resetUserPassword,
    updateUser,
    updateUserStatus
} from "../services/NqdUserService.js";

import { sendResponse } from "../utils/NqdResponse.js";

export const createUserController = async (req, res, next) => {
    try {
        const user = await createUser(req.body);

        return sendResponse(res, 201, {
            success: true,
            data: user,
            message: "Tạo tài khoản nhân viên thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const getUsersController = async (req, res, next) => {
    try {
        const users = await getUsers();

        return sendResponse(res, 200, {
            success: true,
            data: users,
            message: "Lấy danh sách tài khoản thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const getUserController = async (req, res, next) => {
    try {
        const user = await getUser(req.params.id);

        return sendResponse(res, 200, {
            success: true,
            data: user,
            message: "Lấy thông tin tài khoản thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateUserController = async (req, res, next) => {
    try {
        const user = await updateUser(
            req.params.id,
            req.body
        );

        return sendResponse(res, 200, {
            success: true,
            data: user,
            message: "Cập nhật tài khoản thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateUserStatusController = async (req, res, next) => {
    try {
        const user = await updateUserStatus(
            req.params.id,
            req.body.isActive
        );

        return sendResponse(res, 200, {
            success: true,
            data: user,
            message: user.isActive
                ? "Mở khóa tài khoản thành công"
                : "Khóa tài khoản thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const resetUserPasswordController = async (req, res, next) => {
    try {
        const user = await resetUserPassword(
            req.params.id,
            req.body.password
        );

        return sendResponse(res, 200, {
            success: true,
            data: user,
            message: "Đặt lại mật khẩu thành công"
        });
    } catch (error) {
        return next(error);
    }
};