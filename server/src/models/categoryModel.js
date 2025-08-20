const pool = require("../services/db");

var categoryModel = {
    // Create a new category
    insertNewCategory: (data, callback) => {
      const query = "INSERT INTO fashion.`Category_Table` (CategoryName, CategoryDescription) VALUES (?, ?)";
      pool.query(query, [data.categoryName, data.categoryDescription || ''], callback); 
    },
    
    // Get all categories
    getAllCategories: (callback) => {
        const query = "SELECT * FROM fashion.`Category_Table`";
        pool.query(query, callback);
    },
    
    // Get category by ID
    getCategoryById: (categoryId, callback) => {
        const query = "SELECT * FROM fashion.`Category_Table` WHERE CategoryID = ?";
        pool.query(query, [categoryId], callback);
    }
};

module.exports = categoryModel;
