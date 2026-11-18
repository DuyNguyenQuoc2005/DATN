import { Router } from "express";

import {
    createCategoryController,
    getAllCategoriesController,
    getPublicCategoriesController,
    updateCategoryController,
    updateCategoryStatusController
} from "../controllers/NqdCategoryController.js";

import {
    authenticate,
    authorize
} from "../middleware/NqdAuthMiddleware.js";

import {
    validateCategoryStatus,
    validateCreateCategory,
    validateUpdateCategory
} from "../middleware/NqdCategoryValidation.js";

const router = Router();

router.get(
    "/",
    getPublicCategoriesController
);

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    getAllCategoriesController
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validateCreateCategory,
    createCategoryController
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validateUpdateCategory,
    updateCategoryController
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("ADMIN"),
    validateCategoryStatus,
    updateCategoryStatusController
);

export default router;