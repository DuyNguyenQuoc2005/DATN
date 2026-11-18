import mongoose from "mongoose";

import Category from "../models/NqdCategoryModel.js";
import Product from "../models/NqdProductModel.js";
import { AppError } from "../utils/NqdAppError.js";

const isObjectId = (value) => {
    return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
};

const toProductResponse = (product) => {
    const category = product.category;

    return {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        category: category
            ? {
                id: category._id.toString(),
                name: category.name,
                isActive: category.isActive
            }
            : null,
        isActive: product.isActive,
        isAvailable: product.isAvailable,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    };
};

const findProductById = async (productId) => {
    if (!isObjectId(productId)) {
        throw new AppError(
            "Mã món ăn không hợp lệ",
            400,
            "INVALID_PRODUCT_ID"
        );
    }

    const product = await Product.findById(productId).populate(
        "category",
        "name isActive"
    );

    if (!product) {
        throw new AppError(
            "Không tìm thấy món ăn",
            404,
            "PRODUCT_NOT_FOUND"
        );
    }

    return product;
};

const findActiveCategory = async (categoryId) => {
    if (!isObjectId(categoryId)) {
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

    if (!category.isActive) {
        throw new AppError(
            "Không thể chọn danh mục đang bị ẩn",
            400,
            "CATEGORY_INACTIVE"
        );
    }

    return category;
};

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getPublicProducts = async ({ search, categoryId }) => {
    const categoryFilter = {
        isActive: true
    };

    if (categoryId) {
        categoryFilter._id = new mongoose.Types.ObjectId(categoryId);
    }

    const categories = await Category.find(categoryFilter)
        .select("_id")
        .lean();

    const productFilter = {
        isActive: true,
        category: {
            $in: categories.map((category) => category._id)
        }
    };

    if (search) {
        productFilter.name = {
            $regex: escapeRegex(search),
            $options: "i"
        };
    }

    const products = await Product.find(productFilter)
        .populate("category", "name isActive")
        .sort({ name: 1 });

    return products
        .filter((product) => product.category?.isActive)
        .map(toProductResponse);
};

export const getPublicProductById = async (productId) => {
    const product = await findProductById(productId);

    if (
        !product.isActive ||
        !product.category ||
        !product.category.isActive
    ) {
        throw new AppError(
            "Không tìm thấy món ăn",
            404,
            "PRODUCT_NOT_FOUND"
        );
    }

    return toProductResponse(product);
};

export const getAllProducts = async () => {
    const products = await Product.find()
        .populate("category", "name isActive")
        .sort({ createdAt: -1 });

    return products.map(toProductResponse);
};

export const createProduct = async (data) => {
    const category = await findActiveCategory(data.categoryId);

    const product = await Product.create({
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl || "",
        description: data.description || "",
        category: category._id,
        isActive: true,
        isAvailable: true
    });

    await product.populate("category", "name isActive");

    return toProductResponse(product);
};

export const updateProduct = async (productId, data) => {
    const product = await findProductById(productId);

    if (data.categoryId !== undefined) {
        const category = await findActiveCategory(data.categoryId);

        product.category = category._id;
    }

    if (data.name !== undefined) {
        product.name = data.name;
    }

    if (data.price !== undefined) {
        product.price = data.price;
    }

    if (data.imageUrl !== undefined) {
        product.imageUrl = data.imageUrl;
    }

    if (data.description !== undefined) {
        product.description = data.description;
    }

    await product.save();

    await product.populate("category", "name isActive");

    return toProductResponse(product);
};

export const updateProductStatus = async (productId, data) => {
    const product = await findProductById(productId);

    if (data.isActive !== undefined) {
        product.isActive = data.isActive;
    }

    if (data.isAvailable !== undefined) {
        product.isAvailable = data.isAvailable;
    }

    await product.save();

    return toProductResponse(product);
};