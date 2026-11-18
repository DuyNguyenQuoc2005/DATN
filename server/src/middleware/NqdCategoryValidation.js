import { z } from "zod";

import { sendResponse } from "../utils/NqdResponse.js";

const nameSchema = z
    .string()
    .trim()
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được vượt quá 100 ký tự");

const descriptionSchema = z
    .string()
    .trim()
    .max(500, "Mô tả không được vượt quá 500 ký tự");

const createCategorySchema = z.object({
    name: nameSchema,
    description: descriptionSchema.optional()
}).strict();

const updateCategorySchema = z.object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional()
}).strict().refine(
    (value) => Object.keys(value).length > 0,
    {
        message: "Cần cung cấp ít nhất một thông tin để cập nhật"
    }
);

const updateCategoryStatusSchema = z.object({
    isActive: z.boolean()
}).strict();

const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const firstError = result.error.issues[0];

            return sendResponse(res, 400, {
                success: false,
                data: null,
                message: firstError?.message || "Dữ liệu không hợp lệ",
                error: "VALIDATION_ERROR"
            });
        }

        req.body = result.data;

        return next();
    };
};

export const validateCreateCategory = validateBody(
    createCategorySchema
);

export const validateUpdateCategory = validateBody(
    updateCategorySchema
);

export const validateCategoryStatus = validateBody(
    updateCategoryStatusSchema
);