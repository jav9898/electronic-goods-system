const express = require("express");
const userController = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");

const router = express.Router();

// Initialize users table (run once)
router.post("/init", userController.initializeUsersTable);

// Public routes (no authentication required)
router.post("/register", userController.registerUser);

// Admin authentication endpoint - verify admin credentials and provide JWT token
router.post("/login", 
  userController.verifyAdminCredentials, jwtMiddleware.generateToken, jwtMiddleware.sendToken
);

// Protected routes (authentication required)
router.get("/", 
  jwtMiddleware.verifyToken, jwtMiddleware.verifyAdmin, userController.getAllUsers
);

module.exports = router;