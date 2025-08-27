const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// list with search/sort/pagination
router.get('/', productController.readAllProduct);

// single delete
router.delete('/:productId', productController.deleteProductById);

// bulk delete
router.delete('/', productController.deleteProductsBulk);

module.exports = router;

