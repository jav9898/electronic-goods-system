const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Import route modules
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');

// Define authentication middleware that excludes specific paths
const authenticateExcept = (excludedPaths) => {
  return (req, res, next) => {
    // Check if the current path is in the excluded paths list
    const currentPath = req.originalUrl;
    console.log(`Checking path: ${currentPath}`);
    
    // More precise path matching
    const isExcluded = excludedPaths.some(path => {
      // For exact matches
      if (path.endsWith('$')) {
        const exactPath = path.slice(0, -1);
        return currentPath === exactPath;
      }
      // For prefix matches
      return currentPath.startsWith(path);
    });
    
    if (isExcluded) {
      console.log(`Path ${currentPath} is excluded from authentication`);
      // Skip authentication for excluded paths
      return next();
    }
    
    console.log(`Path ${currentPath} requires authentication`);
    // Apply JWT verification for all other paths
    jwtMiddleware.verifyToken(req, res, next);
  };
};

// Apply authentication middleware to all routes except login and public endpoints
router.use(authenticateExcept([
  '/user/login',              // Allow login without authentication
  '/products$',            // Removed - now requires authentication
  '/products/search'          // Allow searching products without authentication
  // All other endpoints will require authentication
]));

// Set up all routes
router.use('/user', userRoutes); 
router.use('/products', productRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
