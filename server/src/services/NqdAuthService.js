import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/NqdUserModel.js";
import { env } from "../config/NqdEnv.js";
import { AppError } from "../utils/NqdAppError.js";

const toPublicUser = (user) => {
    return {
        id: user._id.toString(),
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive
    };
};

export const login = async ({ username, password }) => {
    const normalizedUsername = username.trim().toLowerCase();

    const user = await User.findOne({
        username: normalizedUsername
    }).select("+password");

    if (!user || !user.isActive) {
        throw new AppError(
            "Tên đăng nhập hoặc mật khẩu không chính xác",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new AppError(
            "Tên đăng nhập hoặc mật khẩu không chính xác",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    const accessToken = jwt.sign(
        {
            sub: user._id.toString()
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn,
            algorithm: "HS256"
        }
    );

    return {
        accessToken,
        user: toPublicUser(user)
    };
};

export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
        throw new AppError(
            "Tài khoản không tồn tại hoặc đã bị khóa",
            401,
            "UNAUTHORIZED"
        );
    }

    return toPublicUser(user);
};