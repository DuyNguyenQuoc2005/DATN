import {
    createCategory,
    getAllCategories,
    getPublicCategories,
    updateCategory,
    updateCategoryStatus
} from "../services/NqdCategoryService.js";

import { sendResponse } from "../utils/NqdResponse.js";

export const getPublicCategoriesController = async (
    req,
    res,
    next
) => {
    try {
        const categories = await getPublicCategories();

        return sendResponse(res, 200, {
            success: true,
            data: categories,
            message: "Lấy danh sách danh mục thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllCategoriesController = async (
    req,
    res,
    next
) => {
    try {
        const categories = await getAllCategories();

        return sendResponse(res, 200, {
            success: true,
            data: categories,
            message: "Lấy tất cả danh mục thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const createCategoryController = async (
    req,
    res,
    next
) => {
    try {
        const category = await createCategory(req.body);

        return sendResponse(res, 201, {
            success: true,
            data: category,
            message: "Tạo danh mục thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateCategoryController = async (
    req,
    res,
    next
) => {
    try {
        const category = await updateCategory(
            req.params.id,
            req.body
        );

        return sendResponse(res, 200, {
            success: true,
            data: category,
            message: "Cập nhật danh mục thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateCategoryStatusController = async (
    req,
    res,
    next
) => {
    try {
        const category = await updateCategoryStatus(
            req.params.id,
            req.body.isActive
        );

        return sendResponse(res, 200, {
            success: true,
            data: category,
            message: category.isActive
                ? "Hiển thị danh mục thành công"
                : "Ẩn danh mục thành công"
        });
    } catch (error) {
        return next(error);
    }
};