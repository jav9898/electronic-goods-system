const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');

const userController = {
  // Initialize Admin_Users table
  initializeUsersTable: (req, res) => {
    userModel.createUsersTable((error, results) => {
      if (error) {
        console.error("Error creating users table:", error);
        return res.status(500).json({
          error: "Failed to initialize users table"
        });
      }
      
      res.status(200).json({
        message: "Admin_Users table initialized successfully"
      });
    });
  },

  // Register new admin user
  registerUser: async (req, res) => {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: "All fields are required: username, email, password, firstName, lastName"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long"
      });
    }

    try {
      userModel.registerUser({
        username,
        email,
        password,
        firstName,
        lastName,
        role: role || 'admin'
      }, (error, results) => {
        if (error) {
          console.error("Error registering user:", error);
          
          if (error.code === "ER_DUP_ENTRY") {
            if (error.sqlMessage.includes('username')) {
              return res.status(409).json({
                error: "Username already exists"
              });
            } else if (error.sqlMessage.includes('email')) {
              return res.status(409).json({
                error: "Email already exists"
              });
            }
          }
          
          return res.status(500).json({
            error: "Failed to register user"
          });
        }

        res.status(201).json({
          message: "Admin user registered successfully",
          data: {
            userID: results.insertId,
            username,
            email,
            firstName,
            lastName,
            role: role || 'admin'
          }
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Internal server error during registration"
      });
    }
  },

  verifyAdminCredentials: async (req, res, next) => {
    const data = req.body;

    if (!data.email || !data.password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const callback = async (error, results, fields) => {
      if (error) {
        console.log("Error finding admin:", error);
        res.status(500).json(error);
      } else {
        if (results.length == 0) {
          res.status(404).json({ message: "User not found" });
          return;
        } else {
          // User found, verify it's an admin
          const user = results[0];
          
          // Check if user is active
          if (!user.isActive) {
            res.status(401).json({ message: "Account is deactivated" });
            return;
          }
          
          // Check role (use new column names)
          if (user.role && user.role.toString().toLowerCase() !== "admin" && user.role.toString().toLowerCase() !== "super_admin") {
            res.status(403).json({ message: "Access denied: Admin role required" });
            return;
          }
          
          // Compare hashed password
          try {
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
              res.status(401).json({ message: "Wrong password" });
              return;
            }
            
            // Store user info for token generation
            res.locals.userid = user.userID;
            res.locals.role = user.role;
            res.locals.message = "Admin verification successful";
            next();
          } catch (error) {
            console.error("Password comparison error:", error);
            res.status(500).json({ message: "Authentication error" });
          }
        }
      }
    };

    // Use the new Admin_Users table
    userModel.findAdminByEmail(data.email, callback);
  }, 

  getAllUsers: (req, res, next) => {
    const callback = (error, results, fields) => {
      if (error) {
        console.log("Error readAllAdminUsers:", error);
        res.status(500).json(error);
      } else {
        res.status(200).json({
          count: results.length,
          data: results
        });
      }
    };

    userModel.getAllAdminUsers(callback);
  }
};

module.exports = userController;