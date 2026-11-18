import { Router } from "express";

import { health } from "../controllers/NqdHealthController.js";

import authRoutes from "./NqdAuthRoutes.js";
import categoryRoutes from "./NqdCategoryRoutes.js";
import productRoutes from "./NqdProductRoutes.js";
import userRoutes from "./NqdUserRoutes.js";

const router = Router();

router.get("/health", health);

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/categories", categoryRoutes);

router.use("/products", productRoutes);

export default router;