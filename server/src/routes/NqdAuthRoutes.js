import { Router } from "express";

import {
    adminCheckController,
    getMeController,
    loginController
} from "../controllers/NqdAuthController.js";

import {
    authenticate,
    authorize
} from "../middleware/NqdAuthMiddleware.js";

import { validateLogin } from "../middleware/NqdAuthValidation.js";

const router = Router();

router.post("/login", validateLogin, loginController);

router.get("/me", authenticate, getMeController);

router.get(
    "/admin-check",
    authenticate,
    authorize("ADMIN"),
    adminCheckController
);

export default router;