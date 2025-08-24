const model = require('../models/productModel.js');

const productController = {

    readAllProduct: (req, res) => {
        const callback = (error, results) => {
            if (error) {
                console.error("Error fetching products:", error);
                res.status(500).json(error);
            } else {
                res.status(200).json(results);
            }
        };
        model.getAllProducts(callback);
    },

    createNewProduct: (req, res) => {
        const data = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            categoryID: req.body.categoryID,
            imageURL: req.body.imageURL
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error creating product:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json({
                    message: "Product created successfully",
                    productID: results.insertId
                });
            }
        };

        model.createProduct(data, callback);
    },

    getProductById: (req, res) => {
        const data = {
            productId: req.params.productId
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error fetching product by ID:", error);
                res.status(500).json(error);
            } else if (results.length === 0) {
                res.status(404).json({ message: "Product not found" });
            } else {
                res.status(200).json(results[0]);
            }
        };

        model.selectProductById(data, callback);
    
    },

    updateProductById: (req, res) => {
        const data = {
            productId: req.params.productId,
            ...req.body
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error updating product:", error);
                res.status(500).json(error);
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ message: "Product not found" });
                } else {
                    res.status(200).json({ message: "Product updated successfully" });
                }
            }
        };

        model.updateProductById(data, callback);
    },

    deleteProductById: (req, res) => {
        const data = {
            productId: req.params.productId
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error deleting product:", error);
                res.status(500).json(error);
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ message: "Product not found" });
                } else {
                    res.status(200).json({ message: "Product deleted successfully" });
                }
            }
        };

        model.deleteProductById(data, callback);
    },

    getProductByIdWithCategory: (req, res) => {
        const data = {
            productId: req.params.productId
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error fetching product with category info:", error);
                res.status(500).json(error);
            } else if (results.length === 0) {
                res.status(404).json({ message: "Product not found" });
            } else {
                res.status(200).json(results[0]); // return single product with category
            }
        };

        model.selectByIdWithCategoryInfo(data, callback);
    },

    searchProducts: (req, res) => {
    const query = {
        name: req.query.name,
        categoryID: req.query.categoryID
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error searching products:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    model.searchProducts(query, callback);
}


};

module.exports = productController;
