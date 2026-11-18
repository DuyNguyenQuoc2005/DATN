import mongoose from "mongoose";

import Category from "../models/NqdCategoryModel.js";
import { AppError } from "../utils/NqdAppError.js";

const toCategoryResponse = (category) => {
    return {
        id: category._id.toString(),
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
    };
};

const findCategoryById = async (categoryId) => {
    if (!mongoose.isValidObjectId(categoryId)) {
        throw new AppError(
            "Mã danh mục không hợp lệ",
            400,
            "INVALID_CATEGORY_ID"
        );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new AppError(
            "Không tìm thấy danh mục",
            404,
            "CATEGORY_NOT_FOUND"
        );
    }

    return category;
};

export const getPublicCategories = async () => {
    const categories = await Category.find({
        isActive: true
    }).sort({
        name: 1
    });

    return categories.map(toCategoryResponse);
};

export const getAllCategories = async () => {
    const categories = await Category.find().sort({
        createdAt: -1
    });

    return categories.map(toCategoryResponse);
};

export const createCategory = async (data) => {
    const category = await Category.create({
        name: data.name,
        description: data.description || "",
        isActive: true
    });

    return toCategoryResponse(category);
};

export const updateCategory = async (categoryId, data) => {
    const category = await findCategoryById(categoryId);

    if (data.name !== undefined) {
        category.name = data.name;
    }

    if (data.description !== undefined) {
        category.description = data.description;
    }

    await category.save();

    return toCategoryResponse(category);
};

export const updateCategoryStatus = async (
    categoryId,
    isActive
) => {
    const category = await findCategoryById(categoryId);

    category.isActive = isActive;

    await category.save();

    return toCategoryResponse(category);
};