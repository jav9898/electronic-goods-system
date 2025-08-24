const pool = require('../services/db');

var categoryModel = {

    // Get all categories
    getAllCategories: (callback) => {
        const SQLSTATMENT = `
            SELECT * FROM category;
            `;

        pool.query(SQLSTATMENT, callback);
    },
    
    // Create new category list
    createCategory: (data, callback) => {
        const SQLSTATMENT = `
            INSERT INTO category (name, description)
            VALUES (?,?);
            `;
        const VALUES = [data.name, data.description];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    },

    // Select category by ID
    getCategoryById: (data, callback) => {
        const SQLSTATEMENT = `
            SELECT * FROM category
            WHERE categoryID = ?;
        `;
        const VALUES = [data.categoryId];
        pool.query(SQLSTATEMENT, VALUES, callback);
    },
    
     // Update category by ID
    updateCategoryById: (data, callback) => {
        const SQLSTATEMENT = `
            UPDATE category
            SET name = ?, description = ?
            WHERE categoryID = ?;
        `;
        const VALUES = [
            data.name, data.description, data.categoryId
        ];
        pool.query(SQLSTATEMENT, VALUES, callback);
    },

     // Delete category by ID
    deleteCategoryById: (data, callback) => {
        const SQLSTATEMENT = `
            DELETE FROM category
            WHERE categoryID = ?;
        `;
        const VALUES = [data.categoryId];
        pool.query(SQLSTATEMENT, VALUES, callback);
    },
}

module.exports = categoryModel;