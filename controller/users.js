import * as userModule from "../modules/users.js";

export const createUser = async (req, res) => {
  console.log(req.body);
  try {
    // const { display_name, phone ,email, role } = req.body;
    // const user = await userModule.createUser(display_name ,phone ,email, role);
    // res.json({
    //   success: true,
    //   message: "User created successfully",
    //   data: user
    // });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModule.getAllUsers();
    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModule.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {display_name, phone, email, role } = req.body;
    const user = await userModule.updateUser(req.params.id,display_name, email, phone, role);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModule.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      message: "User deleted successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};