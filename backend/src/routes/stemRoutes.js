import express from "express";
import goalRoutes from "./goalRoutes.js";
import taskRoutes from "./taskRoutes.js";
import routineRoutes from "./routineRoutes.js";

const router = express.Router();

// Mount all routes
router.use("/goals", goalRoutes);
router.use("/tasks", taskRoutes);
router.use("/routines", routineRoutes);

export default router;
