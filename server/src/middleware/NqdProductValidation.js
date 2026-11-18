import { z } from "zod";

import { sendResponse } from "../utils/NqdResponse.js";

const objectIdSchema = z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Mã không hợp lệ");

const nameSchema = z
    .string()
    .trim()
    .min(2, "Tên món phải có ít nhất 2 ký tự")
    .max(150, "Tên món không được vượt quá 150 ký tự");

const priceSchema = z
    .number()
    .int("Giá món phải là số nguyên")
    .min(0, "Giá món không được âm")
    .max(100000000, "Giá món vượt quá giới hạn");

const imageUrlSchema = z
    .string()
    .trim()
    .max(2048, "Đường dẫn ảnh quá dài")
    .refine(
        (value) => {
            if (value === "") {
                return true;
            }

            try {
                const url = new URL(value);

                return url.protocol === "http:" || url.protocol === "https:";
            } catch {
                return false;
            }
        },
        {
            message: "Đường dẫn ảnh phải bắt đầu bằng http hoặc https"
        }
    );

const descriptionSchema = z
    .string()
    .trim()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự");

const createProductSchema = z.object({
    name: nameSchema,
    price: priceSchema,
    imageUrl: imageUrlSchema.optional(),
    description: descriptionSchema.optional(),
    categoryId: objectIdSchema
}).strict();

const updateProductSchema = z.object({
    name: nameSchema.optional(),
    price: priceSchema.optional(),
    imageUrl: imageUrlSchema.optional(),
    description: descriptionSchema.optional(),
    categoryId: objectIdSchema.optional()
}).strict().refine(
    (value) => Object.keys(value).length > 0,
    {
        message: "Cần cung cấp ít nhất một thông tin để cập nhật"
    }
);

const updateStatusSchema = z.object({
    isActive: z.boolean().optional(),
    isAvailable: z.boolean().optional()
}).strict().refine(
    (value) => Object.keys(value).length > 0,
    {
        message: "Cần cung cấp ít nhất một trạng thái"
    }
);

const publicQuerySchema = z.object({
    search: z.string().trim().max(100).optional(),
    categoryId: objectIdSchema.optional()
}).strict();

const validate = (schema, source) => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return sendResponse(res, 400, {
                success: false,
                data: null,
                message: result.error.issues[0]?.message || "Dữ liệu không hợp lệ",
                error: "VALIDATION_ERROR"
            });
        }

        if (source === "body") {
            req.body = result.data;
        } else {
            req.validatedProductQuery = result.data;
        }

        return next();
    };
};

export const validateCreateProduct = validate(
    createProductSchema,
    "body"
);

export const validateUpdateProduct = validate(
    updateProductSchema,
    "body"
);

export const validateProductStatus = validate(
    updateStatusSchema,
    "body"
);

export const validateProductQuery = validate(
    publicQuerySchema,
    "query"
);