const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const bcryptMiddleware = require('../middleware/bcryptMiddleware');

// Use the correct method names from userController.js

// User CRUD
router.get('/', userController.getAllUser);
router.get('/:userId', userController.getUserById);
router.post('/', bcryptMiddleware.hashPassword, userController.createNewUser);
router.put('/:userId', userController.updateUserById);
router.delete('/:userId', userController.deleteUserById);

// Authenticated login with JWT
router.post('/login', userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);


module.exports = router;
