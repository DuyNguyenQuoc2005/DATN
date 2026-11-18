import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/NqdUserModel.js";
import { AppError } from "../utils/NqdAppError.js";

const toPublicUser = (user) => {
    return {
        id: user._id.toString(),
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

const findUserById = async (userId) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new AppError(
            "Mã tài khoản không hợp lệ",
            400,
            "INVALID_USER_ID"
        );
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(
            "Không tìm thấy tài khoản",
            404,
            "USER_NOT_FOUND"
        );
    }

    return user;
};

const ensureEmployee = (user) => {
    if (user.role === "ADMIN") {
        throw new AppError(
            "Chức năng này chỉ áp dụng cho tài khoản nhân viên",
            403,
            "ADMIN_ACCOUNT_PROTECTED"
        );
    }
};

export const createUser = async (data) => {
    const existingUser = await User.findOne({
        username: data.username
    });

    if (existingUser) {
        throw new AppError(
            "Tên đăng nhập đã tồn tại",
            409,
            "USERNAME_EXISTS"
        );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    try {
        const user = await User.create({
            username: data.username,
            password: hashedPassword,
            fullName: data.fullName,
            role: data.role,
            isActive: true
        });

        return toPublicUser(user);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.username) {
            throw new AppError(
                "Tên đăng nhập đã tồn tại",
                409,
                "USERNAME_EXISTS"
            );
        }

        throw error;
    }
};

export const getUsers = async () => {
    const users = await User.find()
        .sort({ createdAt: -1 });

    return users.map(toPublicUser);
};

export const getUser = async (userId) => {
    const user = await findUserById(userId);

    return toPublicUser(user);
};

export const updateUser = async (userId, data) => {
    const user = await findUserById(userId);

    ensureEmployee(user);

    if (data.fullName !== undefined) {
        user.fullName = data.fullName;
    }

    if (data.role !== undefined) {
        user.role = data.role;
    }

    await user.save();

    return toPublicUser(user);
};

export const updateUserStatus = async (userId, isActive) => {
    const user = await findUserById(userId);

    ensureEmployee(user);

    user.isActive = isActive;

    await user.save();

    return toPublicUser(user);
};

export const resetUserPassword = async (userId, password) => {
    const user = await findUserById(userId);

    ensureEmployee(user);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    return toPublicUser(user);
};