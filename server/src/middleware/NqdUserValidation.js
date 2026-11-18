import { z } from "zod";

import { sendResponse } from "../utils/NqdResponse.js";

const usernameSchema = z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9._-]+$/)
    .transform((value) => value.toLowerCase());

const fullNameSchema = z
    .string()
    .trim()
    .min(1)
    .max(100);

const passwordSchema = z
    .string()
    .min(8)
    .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        {
            message: "Mật khẩu không được vượt quá 72 byte"
        }
    );

const roleSchema = z.enum(["STAFF", "KITCHEN"]);

const createUserSchema = z.object({
    username: usernameSchema,
    password: passwordSchema,
    fullName: fullNameSchema,
    role: roleSchema
}).strict();

const updateUserSchema = z.object({
    fullName: fullNameSchema.optional(),
    role: roleSchema.optional()
}).strict().refine(
    (value) => Object.keys(value).length > 0,
    {
        message: "Cần cung cấp ít nhất một thông tin để cập nhật"
    }
);

const updateStatusSchema = z.object({
    isActive: z.boolean()
}).strict();

const resetPasswordSchema = z.object({
    password: passwordSchema
}).strict();

const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const firstError = result.error.issues[0];

            return sendResponse(res, 400, {
                success: false,
                message: firstError?.message || "Dữ liệu không hợp lệ",
                error: "VALIDATION_ERROR"
            });
        }

        req.body = result.data;

        return next();
    };
};

export const validateCreateUser = validateBody(createUserSchema);

export const validateUpdateUser = validateBody(updateUserSchema);

export const validateUpdateStatus = validateBody(updateStatusSchema);

export const validateResetPassword = validateBody(resetPasswordSchema);