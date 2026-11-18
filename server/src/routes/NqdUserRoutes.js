import { Router } from "express";

import {
    createUserController,
    getUserController,
    getUsersController,
    resetUserPasswordController,
    updateUserController,
    updateUserStatusController
} from "../controllers/NqdUserController.js";

import {
    authenticate,
    authorize
} from "../middleware/NqdAuthMiddleware.js";

import {
    validateCreateUser,
    validateResetPassword,
    validateUpdateStatus,
    validateUpdateUser
} from "../middleware/NqdUserValidation.js";

const router = Router();

router.use(authenticate);

router.use(authorize("ADMIN"));

router.post(
    "/",
    validateCreateUser,
    createUserController
);

router.get(
    "/",
    getUsersController
);

router.get(
    "/:id",
    getUserController
);

router.patch(
    "/:id",
    validateUpdateUser,
    updateUserController
);

router.patch(
    "/:id/status",
    validateUpdateStatus,
    updateUserStatusController
);

router.patch(
    "/:id/password",
    validateResetPassword,
    resetUserPasswordController
);

export default router;