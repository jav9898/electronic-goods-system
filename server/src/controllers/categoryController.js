const model = require('../models/categoryModel.js');

var categoryController = {
    
    readAllCategory: (req, res) => {
        const callback = (error, results) => {
            if (error) {
                console.error("Error fetching category:", error);
                res.status(500).json(error);
            } else {
                res.status(200).json(results);
            }
        };
        model.getAllCategories(callback);
    },

    createNewCategory: (req, res) => {
        const data = {
            name: req.body.name,
            description: req.body.description,
           
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error creating category:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json({
                    message: "Category created successfully",
                    categoryID: results.insertId
                });
            }
        };

        model.createCategory(data, callback);
    },

    getCategoryById: (req, res) => {
        const data = {
            categoryId: req.params.categoryId
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error fetching category by ID:", error);
                res.status(500).json(error);
            } else if (results.length === 0) {
                res.status(404).json({ message: "Category not found" });
            } else {
                res.status(200).json(results[0]);
            }
        };

        model.getCategoryById(data, callback);
    },

    updateCategoryById: (req, res) => {
        const data = {
            categoryId: req.params.categoryId,
            ...req.body
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error updating category:", error);
                res.status(500).json(error);
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ message: "Category not found" });
                } else {
                    res.status(200).json({ message: "Category updated successfully" });
                }
            }
        };

        model.updateCategoryById(data, callback);
    },

     deleteCategoryById: (req, res) => {
        const data = {
            categoryId: req.params.categoryId
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error deleting category:", error);
                res.status(500).json(error);
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ message: "Category not found" });
                } else {
                    res.status(200).json({ message: "Category deleted successfully" });
                }
            }
        };

        model.deleteCategoryById(data, callback);
    },

};

module.exports = categoryController;