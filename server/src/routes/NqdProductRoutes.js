import { Router } from "express";

import {
    createProductController,
    getAllProductsController,
    getPublicProductByIdController,
    getPublicProductsController,
    updateProductController,
    updateProductStatusController
} from "../controllers/NqdProductController.js";

import {
    authenticate,
    authorize
} from "../middleware/NqdAuthMiddleware.js";

import {
    validateCreateProduct,
    validateProductQuery,
    validateProductStatus,
    validateUpdateProduct
} from "../middleware/NqdProductValidation.js";

const router = Router();

router.get(
    "/admin/all",
    authenticate,
    authorize("ADMIN"),
    getAllProductsController
);

router.get(
    "/",
    validateProductQuery,
    getPublicProductsController
);

router.get(
    "/:id",
    getPublicProductByIdController
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validateCreateProduct,
    createProductController
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validateUpdateProduct,
    updateProductController
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("ADMIN"),
    validateProductStatus,
    updateProductStatusController
);

export default router;