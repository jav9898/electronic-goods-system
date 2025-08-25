const bcrypt = require('bcrypt');

const bcryptMiddleware = {
  // Hash password before storing
  hashPassword: async (req, res, next) => {
    try {
      if (req.body.password) {
        const saltRounds = 12;
        req.body.hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      }
      next();
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).json({
        error: "Internal server error during password processing"
      });
    }
  },

  // Compare password for login
  comparePassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      const storedPassword = res.locals.storedPassword;

      if (!password || !storedPassword) {
        return res.status(400).json({
          error: "Password comparison failed"
        });
      }

      const isMatch = await bcrypt.compare(password, storedPassword);
      
      if (!isMatch) {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }

      next();
    } catch (error) {
      console.error("Error comparing password:", error);
      res.status(500).json({
        error: "Internal server error during authentication"
      });
    }
  }
};

module.exports = bcryptMiddleware;
