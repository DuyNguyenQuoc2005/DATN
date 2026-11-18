import {
    createProduct,
    getAllProducts,
    getPublicProductById,
    getPublicProducts,
    updateProduct,
    updateProductStatus
} from "../services/NqdProductService.js";

import { sendResponse } from "../utils/NqdResponse.js";

export const getPublicProductsController = async (req, res, next) => {
    try {
        const products = await getPublicProducts(
            req.validatedProductQuery
        );

        return sendResponse(res, 200, {
            success: true,
            data: products,
            message: "Lấy thực đơn thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const getPublicProductByIdController = async (req, res, next) => {
    try {
        const product = await getPublicProductById(req.params.id);

        return sendResponse(res, 200, {
            success: true,
            data: product,
            message: "Lấy thông tin món ăn thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllProductsController = async (req, res, next) => {
    try {
        const products = await getAllProducts();

        return sendResponse(res, 200, {
            success: true,
            data: products,
            message: "Lấy danh sách món ăn thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const createProductController = async (req, res, next) => {
    try {
        const product = await createProduct(req.body);

        return sendResponse(res, 201, {
            success: true,
            data: product,
            message: "Tạo món ăn thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateProductController = async (req, res, next) => {
    try {
        const product = await updateProduct(
            req.params.id,
            req.body
        );

        return sendResponse(res, 200, {
            success: true,
            data: product,
            message: "Cập nhật món ăn thành công"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateProductStatusController = async (req, res, next) => {
    try {
        const product = await updateProductStatus(
            req.params.id,
            req.body
        );

        return sendResponse(res, 200, {
            success: true,
            data: product,
            message: "Cập nhật trạng thái món ăn thành công"
        });
    } catch (error) {
        return next(error);
    }
};