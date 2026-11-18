import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { env } from "../config/NqdEnv.js";
import { connectDatabase } from "../config/NqdDatabase.js";
import User from "../models/NqdUserModel.js";

const seedAdmin = async () => {
    const username = env.adminUsername?.trim().toLowerCase();
    const password = env.adminPassword;
    const fullName = env.adminFullName?.trim();

    if (!username || !password || !fullName) {
        throw new Error(
            "Cần cấu hình ADMIN_USERNAME, ADMIN_PASSWORD và ADMIN_FULL_NAME"
        );
    }

    if (username.length < 3 || username.length > 50) {
        throw new Error(
            "ADMIN_USERNAME phải có từ 3 đến 50 ký tự"
        );
    }

    if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
        throw new Error(
            "ADMIN_PASSWORD phải có ít nhất 12 ký tự và tối đa 72 byte"
        );
    }

    await connectDatabase();

    const existingAdmin = await User.findOne({
        role: "ADMIN"
    });

    if (existingAdmin) {
        console.log(
            "Hệ thống đã có tài khoản Admin. Không tạo thêm tài khoản."
        );

        return;
    }

    const existingUsername = await User.findOne({
        username
    });

    if (existingUsername) {
        throw new Error(
            "Tên đăng nhập đã tồn tại. Hãy chọn ADMIN_USERNAME khác."
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        username,
        password: hashedPassword,
        fullName,
        role: "ADMIN",
        isActive: true
    });

    console.log("Tạo tài khoản Admin đầu tiên thành công");
};

try {
    await seedAdmin();
} catch (error) {
    console.error("Không thể tạo Admin:", error.message);

    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}