import * as unitModule from "../modules/units.js";

export const createUnit = async (req, res) => {
  try {
    const { classId, title, position } = req.body;
    const newUnit = await unitModule.createUnit(classId, title, position);
    res.json({
      success: true,
      message: "Unit created successfully",
      data: newUnit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create unit",
      error: error.message
    });
  }
};

export const getAllUnits = async (req, res) => {
  try {
    const units = await unitModule.getAllUnits();
    res.json({
      success: true,
      message: "Units retrieved successfully",
      data: units
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve units",
      error: error.message
    });
  }
};

export const getUnitById = async (req, res) => {
  try {
    const unit = await unitModule.getUnitById(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
      });
    }
    res.json({
      success: true,
      message: "Unit retrieved successfully",
      data: unit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve unit",
      error: error.message
    });
  }
};

export const getUnitsByClass = async (req, res) => {
  try {
    const units = await unitModule.getUnitsByClass(req.params.classId);
    res.json({
      success: true,
      message: "Class units retrieved successfully",
      data: units
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve class units",
      error: error.message
    });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const { title, position } = req.body;
    const updatedUnit = await unitModule.updateUnit(
      req.params.id,
      title,
      position
    );
    if (!updatedUnit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
      });
    }
    res.json({
      success: true,
      message: "Unit updated successfully",
      data: updatedUnit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update unit",
      error: error.message
    });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const deletedUnit = await unitModule.deleteUnit(req.params.id);
    if (!deletedUnit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found"
      });
    }
    res.json({
      success: true,
      message: "Unit deleted successfully",
      data: deletedUnit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete unit",
      error: error.message
    });
  }
};

export const reorderUnits = async (req, res) => {
  try {
    const { unitOrders } = req.body;
    const updatedUnits = await unitModule.reorderUnits(
      req.params.classId,
      unitOrders
    );
    res.json({
      success: true,
      message: "Units reordered successfully",
      data: updatedUnits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reorder units",
      error: error.message
    });
  }
};