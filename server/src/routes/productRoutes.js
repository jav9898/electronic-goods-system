const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

//define your routes

router.get('/search', productController.searchProducts);
router.get('/', productController.readAllProduct);
router.post('/', jwtMiddleware.verifyToken, productController.createNewProduct);
router.put('/:productId', jwtMiddleware.verifyToken, productController.updateProductById);
router.delete('/:productId', jwtMiddleware.verifyToken, productController.deleteProductById);
router.get('/:productId', productController.getProductById);
router.get('/details/:productId', productController.getProductByIdWithCategory);



module.exports = router;
