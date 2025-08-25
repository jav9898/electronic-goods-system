const express = require("express");
const userController = require("../controllers/userController");
const googleAuthController = require("../controllers/googleAuthController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");

const router = express.Router();

// Initialize users table (run once)
router.post("/init", userController.initializeUsersTable);

// Public routes (no authentication required)
router.post("/register", userController.registerUser);
router.post("/google-auth", googleAuthController.googleAuth);

// Admin authentication endpoint - verify admin credentials and provide JWT token
router.post("/login", userController.loginUser);

// Protected routes (authentication required)
router.get("/", 
  jwtMiddleware.verifyToken, jwtMiddleware.verifyAdmin, userController.getAllUsers
);

module.exports = router;