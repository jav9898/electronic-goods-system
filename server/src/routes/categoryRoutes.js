const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

//define your routes

router.get('/', categoryController.readAllCategory);
router.post('/', jwtMiddleware.verifyToken, categoryController.createNewCategory);
router.get('/:categoryId', categoryController.getCategoryById);
router.put('/:categoryId', jwtMiddleware.verifyToken, categoryController.updateCategoryById);
router.delete('/:categoryId', jwtMiddleware.verifyToken, categoryController.deleteCategoryById);

module.exports = router;