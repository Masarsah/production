import * as classModule from "../modules/classes.js";

export const createClass = async (req, res) => {
  try {
    const { code, title, teacherId } = req.body;
    
    const newClass = await classModule.createClass(code, title, teacherId);
    res.json({
      success: true,
      message: "Class created successfully",
      data: newClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message
    });
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const classes = await classModule.getAllClasses();
    res.json({
      success: true,
      message: "Classes retrieved successfully",
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
      error: error.message
    });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classData = await classModule.getClassById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }
    res.json({
      success: true,
      message: "Class retrieved successfully",
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve class",
      error: error.message
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { code, title, teacherId } = req.body;
    const updatedClass = await classModule.updateClass(
      req.params.id,
      code,
      title,
      teacherId
    );
    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }
    res.json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await classModule.deleteClass(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }
    res.json({
      success: true,
      message: "Class deleted successfully",
      data: deletedClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message
    });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { userId, roleInClass } = req.body;
    const enrollment = await classModule.enrollUser(
      userId,
      req.params.id,
      roleInClass
    );
    res.json({
      success: true,
      message: "User enrolled successfully",
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to enroll user",
      error: error.message
    });
  }
};