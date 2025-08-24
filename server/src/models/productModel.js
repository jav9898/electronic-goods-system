const pool = require('../services/db');

var productModel = {

    // Get all product
    getAllProducts: (callback) => {
        const SQLSTATMENT = `
            SELECT * FROM product;
            `;

        pool.query(SQLSTATMENT, callback); 
    },

    // Get product by ID
    selectProductById : (data, callback) => {
        const SQLSTATMENT = `
            SELECT * FROM product
            WHERE productID = ?;
            `;
        const VALUES = [data.productId];

        pool.query(SQLSTATMENT, VALUES, callback);
    },
    
    // Get product by ID with category info
    selectByIdWithCategoryInfo: (data, callback) => {
        const SQLSTATMENT = `
        SELECT p.*, c.name AS categoryName, c.description AS categoryDescription
            FROM product p
            JOIN category c ON p.categoryID = c.categoryID
            WHERE p.productID = ?;
        `;
    
        const VALUES = [data.productId];

        pool.query(SQLSTATMENT, VALUES, callback);
    },

    // Create a new product
    createProduct: (data, callback) => {
        const SQLSTATEMENT = `
            INSERT INTO product (name, description, brand, categoryID, imageURL)
            VALUES (?, ?, ?, ?, ?);
        `;
        const VALUES = [data.name, data.description, data.brand, data.categoryID, data.imageURL];
        pool.query(SQLSTATEMENT, VALUES, callback);
    },

    // Update product
    updateProductById: (data, callback) => {
        const SQLSTATEMENT = `
            UPDATE product
            SET name = ?, description = ?, brand = ?, categoryID = ?, imageURL = ?
            WHERE productID = ?;
        `;
        const VALUES = [
            data.name, data.description, data.brand,
            data.categoryID, data.imageURL, data.productId
        ];
        pool.query(SQLSTATEMENT, VALUES, callback);
    },

    // Delete product
    deleteProductById: (data, callback) => {
        const SQLSTATEMENT = `
            DELETE FROM product
            WHERE productID = ?;
        `;
        const VALUES = [data.productId];
        pool.query(SQLSTATEMENT, VALUES, callback);
    },

    // SearchProduct
    searchProducts: (query, callback) => {
        let SQLSTATEMENT = `
            SELECT * FROM product
            WHERE 1 = 1
        `;
        const VALUES = [];

        // If searching by name
        if (query.name) {
            SQLSTATEMENT += ` AND name LIKE ?`;
            VALUES.push(`%${query.name}%`);
        }

        // If searching by categoryID
        if (query.categoryID) {
            SQLSTATEMENT += ` AND categoryID = ?`;
            VALUES.push(query.categoryID);
        }

        // Sort by year ascending (from current year onward)
        SQLSTATEMENT += ` AND YEAR(dateInserted) >= YEAR(CURDATE()) ORDER BY YEAR(dateInserted) ASC;`;

        pool.query(SQLSTATEMENT, VALUES, callback);
    }

};


module.exports = productModel;