const productModel = require("../models/productModel");

var productController = {
  // Get all products
  getAllProducts: (req, res) => {
    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
          error: "Database error occurred while fetching products",
        });
      } else {
        res.status(200).json({
          count: results.length,
          data: results,
        });
      }
    };

    productModel.getAllProducts(callback);
  },

  // Unified search for products using query parameters
  searchProducts: (req, res) => {
    const { name, categoryID } = req.query;
    console.log("Unified search with params:", { name, categoryID });
    
    // Validate that at least one search parameter is provided
    if (!name && !categoryID) {
      return res.status(400).json({
        error: "At least one search parameter (name or categoryID) is required"
      });
    }
    
    // Create params object for the model
    const params = {};
    
    if (name) {
      params.name = name;
    } else if (categoryID) {
      // Validate categoryID is a number if provided
      const categoryIDNum = parseInt(categoryID, 10);
      if (isNaN(categoryIDNum)) {
        return res.status(400).json({
          error: "Valid category ID is required"
        });
      }
      params.categoryID = categoryIDNum;
    }
    
    productModel.searchProducts(params, (error, results) => {
      if (error) {
        console.error("Error in unified product search:", error);
        return res.status(500).json({
          error: "Database error occurred while searching products"
        });
      }
      
      // Apply additional filtering for products from current year onwards
      const currentYear = new Date().getFullYear();
      const filteredResults = results.filter(product => 
        !product.year || product.year >= currentYear
      );
      
      console.log("Unified search results:", filteredResults.length, "products found");
      
      return res.status(200).json({
        message: "Search results retrieved successfully",
        count: filteredResults.length,
        data: filteredResults
      });
    });
  },
  
  // Create a new product
  createNewProduct: (req, res) => {
    const data = req.body;

    // Basic validation
    if (!data.name || !data.description || !data.brand || !data.categoryID) {
      return res.status(400).json({
        error:
          "Missing required fields: name, description, brand, and categoryID are required",
      });
    }

    // Ensure imageURL has a default value if not provided
    if (!data.imageURL) {
      data.imageURL = 'https://via.placeholder.com/300x300?text=No+Image';
    }

    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error creating new product:", error);

        // Handle specific database errors
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
          res.status(400).json({
            error: "Invalid categoryID: Category does not exist",
          });
        } else if (error.code === "ER_DUP_ENTRY") {
          res.status(409).json({
            error: "Product name already exists",
          });
        } else {
          res.status(500).json({
            error: "Database error occurred while creating product",
          });
        }
      } else {
        res.status(201).json({
          message: "New Product created successfully",
          productID: results.insertId,
          data: {
            productID: results.insertId,
            name: data.name,
            description: data.description,
            brand: data.brand,
            categoryID: data.categoryID,
            imageURL: data.imageURL || null,
          },
        });
      }
    };

    productModel.insertNewFashionProduct(data, callback);
  },

  // // Get product by ID
  // getProductById: (req, res) => {
  //   const productID = req.params.id;

  //   if (!productID || isNaN(productID)) {
  //     return res.status(400).json({
  //       error: "Invalid product ID",
  //     });
  //   }

  //   const callback = (error, results, fields) => {
  //     if (error) {
  //       console.error("Error fetching product:", error);
  //       res.status(500).json({
  //         error: "Database error occurred while fetching product",
  //       });
  //     } else if (results.length === 0) {
  //       res.status(404).json({
  //         error: "Product not found",
  //       });
  //     } else {
  //       res.status(200).json({
  //         message: "Product retrieved successfully",
  //         data: results[0],
  //       });
  //     }
  //   };

  //   productModel.getProductById(productID, callback);
  // },

  // Update product
  updateProduct: (req, res) => {
    const productID = req.params.id;
    const data = req.body;

    if (!productID || isNaN(productID)) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }
    
    // Check if user is attempting to modify the productID
    if (data.productID !== undefined && data.productID != productID) {
      return res.status(400).json({
        error: "Product ID cannot be modified",
      });
    }

    if (!data.name || !data.description || !data.brand || !data.categoryID) {
      return res.status(400).json({
        error:
          "Missing required fields: name, description, brand, and categoryID are required",
      });
    }

    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
          error: "Database error occurred while updating product",
        });
      } else if (results.affectedRows === 0) {
        res.status(404).json({
          error: "Product not found",
        });
      } else {
        res.status(200).json({
          message: "Product updated successfully",
          productID: parseInt(productID),
        });
      }
    };

    productModel.updateProduct({ ...data, productID }, callback);
  },

  // Delete product
  deleteProduct: (req, res) => {
    const productID = req.params.id;

    if (!productID || isNaN(productID)) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }

    const callback = (error, results, fields) => {
      if (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
          error: "Database error occurred while deleting product",
        });
      } else if (results.affectedRows === 0) {
        res.status(404).json({
          error: "Product not found",
        });
      } else {
        res.status(200).json({
          message: "Product deleted successfully",
          productID: parseInt(productID),
        });
      }
    };

    productModel.deleteProduct({ productID }, callback);
  }

};

module.exports = productController;
