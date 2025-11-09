import express from "express";
import * as teacherController from "../controller/teachers.js";

const router = express.Router();

router.post("/", teacherController.createTeacher);
router.post("/login", teacherController.loginTeacher);
router.get("/", teacherController.getAllTeachers);
router.get("/:id", teacherController.getTeacherById);
router.put("/:id", teacherController.updateTeacher);
router.delete("/:id", teacherController.deleteTeacher);

export default router;