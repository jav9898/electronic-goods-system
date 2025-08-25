const express = require("express");
const userController = require("../controllers/userController");
const { googleAuth } = require("../controllers/googleAuthController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");

const router = express.Router();

// Initialize users table (run once)
router.post("/init", userController.initializeUsersTable);

// Add Google columns to existing table
router.post("/add-google-columns", (req, res) => {
  const userModel = require("../models/userModel");
  userModel.addGoogleColumns((error, results) => {
    if (error) {
      console.error("Error adding Google columns:", error);
      return res.status(500).json({
        error: "Failed to add Google columns"
      });
    }
    
    res.status(200).json({
      message: "Google columns added successfully"
    });
  });
});

// Public routes (no authentication required)
router.post("/register", userController.registerUser);
router.post("/google-auth", googleAuth);

// Admin authentication endpoint - verify admin credentials and provide JWT token
router.post("/login", userController.verifyAdminCredentials, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

// Protected routes (authentication required)
router.get("/", 
  jwtMiddleware.verifyToken, jwtMiddleware.verifyAdmin, userController.getAllUsers
);

module.exports = router;