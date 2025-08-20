const categoryModel = require("../models/categoryModel");

const categoryController = {
  // Create new category
  createNewCategory: (req, res) => {
    const data = req.body;

    // Validate required fields
    if (!data.categoryName || data.categoryName.trim() === "") {
      return res.status(400).json({
        error: "Category name is required"
      });
    }
    
    // Validate category description is required
    if (!data.categoryDescription || data.categoryDescription.trim() === "") {
      return res.status(400).json({
        error: "Category description is required"
      });
    }

    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error creating new category:", error);

        // Handle duplicate category name error
        if (error.code === "ER_DUP_ENTRY") {
          res.status(409).json({
            error: "Category name already exists, please use a different category name",
          });
        } else {
          res.status(500).json({
            error: "Database error occurred while creating category",
          });
        }
      } else {
        res.status(201).json({
          message: "New Category created successfully",
          data: {
            categoryID: results.insertId,
            categoryName: data.categoryName,
            categoryDescription: data.categoryDescription
          },
        });
      }
    };

    categoryModel.insertNewCategory(data, callback);
  },

  // Get all categories
  getAllCategory: (req, res) => {
    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error readAllCategory:", error);
        res.status(500).json(error);
      } else 
        res.status(200).json({
          count: results.length,
          data: results,
        });
    };

    categoryModel.getAllCategories(callback);
  },
};

module.exports = categoryController;
