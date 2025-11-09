import express from "express";
import * as classController from "../controller/classes.js";
//import  } from "../modules/teachers.js";

const router = express.Router();

router.post("/", classController.createClass);
router.get("/", classController.getAllClasses);
router.get("/:id", classController.getClassById);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);
router.post("/:id/enroll", classController.enrollStudent);

export default router;