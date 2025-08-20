const pool = require("../services/db");

var productModel = {
  // Get all products
  getAllProducts: (callback) => {
    const query = `
      SELECT p.*, c.CategoryName as category 
      FROM fashion.Fashion_Product_Table p 
      LEFT JOIN fashion.Category_Table c ON p.CategoryID = c.CategoryID
    `;
    pool.query(query, callback);
  },
  
  // Search products by name substring or category ID
  searchProducts: (params, callback) => {
    console.log("searchProducts model received params:", params);

    // Base query - join with Category table
    let query =
      "SELECT p.*, c.CategoryName FROM fashion.`Fashion_Product_Table` p " +
      "JOIN fashion.`Category_Table` c ON p.CategoryID = c.CategoryID ";
    let queryParams = [];

    // Filter by name or category ID
    if (params.name) {
      query += "WHERE p.name LIKE ? ";
      queryParams.push(`%${params.name}%`);
      console.log("Searching by name:", params.name);
    } else if (params.categoryID) {
      query += "WHERE p.CategoryID = ? ";
      queryParams.push(params.categoryID);
      console.log("Searching by categoryID:", params.categoryID);
    }

    // Sort by name as a fallback since year might not exist
    query += "ORDER BY p.name ASC";

    console.log("Final SQL query:", query);
    console.log("With parameters:", queryParams);

    pool.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Database error in searchProducts:", error);
      } else {
        console.log(
          "Search returned",
          results ? results.length : 0,
          "products"
        );
      }
      callback(error, results);
    });
  },

  // Create a new fashion product
  insertNewFashionProduct: (data, callback) => {
    const query =
      "INSERT INTO fashion.`Fashion_Product_Table` (name, description, brand, CategoryID, ImageURL) VALUES (?, ?, ?, ?, ?)";
    pool.query(
      query,
      [data.name, data.description, data.brand, data.categoryID, data.imageURL],
      callback
    );
  },

  deleteProduct: (data, callback) => {
    // Use a transaction to ensure both operations complete together
    pool.getConnection((err, connection) => {
      if (err) {
        callback(err, null);
        return;
      }

      connection.beginTransaction(err => {
        if (err) {
          connection.release();
          callback(err, null);
          return;
        }

        // First delete the product
        const deleteQuery = "DELETE FROM fashion.`Fashion_Product_Table` WHERE productID = ?";
        connection.query(deleteQuery, [data.productID], (error, results) => {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              callback(error, null);
            });
          }

          // If deletion was successful, reset the auto increment
          const resetQuery = "ALTER TABLE fashion.`Fashion_Product_Table` AUTO_INCREMENT = 1";
          connection.query(resetQuery, (error, resetResults) => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                callback(error, null);
              });
            }

            // Commit the transaction if both operations succeeded
            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  callback(err, null);
                });
              }

              connection.release();
              callback(null, results);
            });
          });
        });
      });
    });
  },

  updateProduct: (data, callback) => {
    // Build dynamic query based on provided fields
    const updateFields = [];
    const queryParams = [];
    
    // Check which fields are provided and add them to the update
    if (data.name !== undefined) {
      updateFields.push("name = ?");
      queryParams.push(data.name);
    }
    
    if (data.description !== undefined) {
      updateFields.push("description = ?");
      queryParams.push(data.description);
    }
    
    if (data.brand !== undefined) {
      updateFields.push("brand = ?");
      queryParams.push(data.brand);
    }
    
    if (data.categoryID !== undefined) {
      updateFields.push("CategoryID = ?");
      queryParams.push(data.categoryID);
    }
    
    if (data.imageURL !== undefined) {
      updateFields.push("ImageURL = ?");
      queryParams.push(data.imageURL);
    }
    
    // If no fields to update, return error
    if (updateFields.length === 0) {
      return callback(new Error("No fields provided for update"), null);
    }
    
    // Build the query with only the fields that need updating
    const query = `UPDATE fashion.\`Fashion_Product_Table\` SET ${updateFields.join(", ")} WHERE productID = ?`;
    
    // Add the productID to the query parameters (for the WHERE clause)
    queryParams.push(data.productID);
    
    // Execute the query
    pool.query(query, queryParams, callback);
  }

};

module.exports = productModel;