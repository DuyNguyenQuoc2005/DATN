import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/NqdUserModel.js";
import { env } from "../config/NqdEnv.js";
import { AppError } from "../utils/NqdAppError.js";

export const authenticate = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            throw new AppError(
                "Vui lòng đăng nhập để tiếp tục",
                401,
                "UNAUTHORIZED"
            );
        }

        const token = authorization.slice(7).trim();

        if (!token) {
            throw new AppError(
                "Token không hợp lệ",
                401,
                "INVALID_TOKEN"
            );
        }

        let payload;

        try {
            payload = jwt.verify(token, env.jwtSecret, {
                algorithms: ["HS256"]
            });
        } catch {
            throw new AppError(
                "Token không hợp lệ hoặc đã hết hạn",
                401,
                "INVALID_TOKEN"
            );
        }

        if (
            typeof payload !== "object" ||
            !payload.sub ||
            !mongoose.isValidObjectId(payload.sub)
        ) {
            throw new AppError(
                "Token không hợp lệ",
                401,
                "INVALID_TOKEN"
            );
        }

        const user = await User.findById(payload.sub);

        if (!user || !user.isActive) {
            throw new AppError(
                "Tài khoản không tồn tại hoặc đã bị khóa",
                401,
                "UNAUTHORIZED"
            );
        }

        req.user = user;

        return next();
    } catch (error) {
        return next(error);
    }
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(
                new AppError(
                    "Bạn không có quyền thực hiện chức năng này",
                    403,
                    "FORBIDDEN"
                )
            );
        }

        return next();
    };
};