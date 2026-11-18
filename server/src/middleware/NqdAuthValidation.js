import { z } from "zod";
import { sendResponse } from "../utils/NqdResponse.js";

const loginSchema = z.object({
    username: z.string().trim().min(1).max(50),
    password: z.string().min(1).max(200)
});

export const validateLogin = (req, res, next) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return sendResponse(res, 400, {
            success: false,
            message: "Tên đăng nhập hoặc mật khẩu không hợp lệ",
            error: "VALIDATION_ERROR"
        });
    }

    req.body = result.data;

    return next();
};