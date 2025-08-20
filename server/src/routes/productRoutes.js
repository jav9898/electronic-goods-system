const express = require("express");
const productController = require("../controllers/productController.js");
const router = express.Router();


// Route to get all fashion products
router.get("/", productController.getAllProducts);

// Unified search route that supports both name and categoryId query parameters
router.get("/search", productController.searchProducts);

// Route to create a new fashion product
router.post("/create", productController.createNewProduct);

router.delete("/delete/:id", productController.deleteProduct);

router.put("/update/:id", productController.updateProduct);

// // Route to search by name (name is required path parameter)
// router.get("/search/name/:name", productController.searchProductsByName);

// // Route to search by category (categoryID is required path parameter)
// router.get("/search/category/:categoryID", productController.searchProductsByCategory);

module.exports = router;