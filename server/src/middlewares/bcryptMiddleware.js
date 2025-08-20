const bcrypt = require("bcrypt");

// Step 3: Set the number of salt rounds
const saltRounds = 10;

/**
 * Hashes a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

// Step 4: Create the middleware function for comparing passwords
var bcryptMiddleware = {
  comparePassword: (req, res, next) => {
    // Check password
    const callback = (err, isMatch) => {
      if (err) {
        console.error("Error bcrypt:", err);
        res.status(500).json(err);
      } else {
        if (isMatch) {
          next();
        } else {
          res.status(401).json({
            message: "Wrong password",
          });
        }
      }
    };
    bcrypt.compare(req.body.password, res.locals.hash, callback);
  },
  
  // Step 5: Create the middleware function for hashing passwords
  hashPassword: (req, res, next) => {
    const callback = (err, hash) => {
      if (err) {
        console.error("Error bcrypt:", err);
        res.status(500).json(err);
      } else {
        res.locals.hash = hash;
        next();
      }
    };
    
    bcrypt.hash(req.body.password, saltRounds, callback);
  }
}

// Make saltRounds available for other modules
bcryptMiddleware.saltRounds = saltRounds;

module.exports = bcryptMiddleware;
