import * as teacherModule from "../modules/teachers.js";

export const createTeacher = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    
    const teacher = await teacherModule.createTeacher(email, password, role);

    console.log(teacher);
    res.json({
      success: true,
      message: "Teacher created successfully",
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create teacher",
      error: error.message
    });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const teacher = await teacherModule.loginTeacher(email, password);
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModule.getAllTeachers();
    res.json({
      success: true,
      message: "Teachers retrieved successfully",
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve teachers",
      error: error.message
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await teacherModule.getTeacherById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }
    res.json({
      success: true,
      message: "Teacher retrieved successfully",
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher",
      error: error.message
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { email, password, name, subject } = req.body;
    const teacher = await teacherModule.updateTeacher(req.params.id, email, password, name, subject);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }
    res.json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update teacher",
      error: error.message
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await teacherModule.deleteTeacher(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }
    res.json({
      success: true,
      message: "Teacher deleted successfully",
      data: { id: teacher.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete teacher",
      error: error.message
    });
  }
}; 