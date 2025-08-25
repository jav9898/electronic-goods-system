const express = require("express");
const userController = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");

const router = express.Router();

// Admin authentication endpoint - verify admin credentials and provide JWT token
router.post("/login", 
  userController.verifyAdminCredentials, jwtMiddleware.generateToken, jwtMiddleware.sendToken
);

// Get all users
router.get("/", 
  jwtMiddleware.verifyToken, jwtMiddleware.verifyAdmin, userController.getAllUsers
);

module.exports = router;