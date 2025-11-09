import express from "express";
import * as unitController from "../controller/units.js";

const router = express.Router();

// Basic CRUD operations
router.post("/",  unitController.createUnit);
router.get("/", unitController.getAllUnits);
router.get("/:id", unitController.getUnitById);
router.put("/:id",  unitController.updateUnit);
router.delete("/:id",  unitController.deleteUnit);

// Class-specific routes
router.get("/class/:classId", unitController.getUnitsByClass);
router.post("/class/:classId/reorder",  unitController.reorderUnits);

export default router;