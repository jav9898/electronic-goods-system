const userModel = require("../models/userModel");

const userController = {
  verifyAdminCredentials: (req, res, next) => {
    const data = req.body;

    if (!data.email || !data.password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const callback = (error, results, fields) => {
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
          // console.log("User found:", user);
          // console.log("Role in DB:", user.Role, "Type:", typeof user.Role);
          
          // Make comparison case-insensitive
          if (user.Role && user.Role.toString().toLowerCase() != "admin") {
            res.status(403).json({ message: "Access denied: Admin role required" });
            return;
          }
          
          // Check if password matches (plain text comparison for now)
          if (req.body.password !== user.Password) {
            res.status(401).json({ message: "Wrong password" });
            return;
          }
          
          // Store user info for token generation (skip bcrypt middleware)
          res.locals.userid = user.userID;
          res.locals.role = user.Role;
          res.locals.message = "Admin verification successful";
          next();
        }
      }
    };

    userModel.findUserByEmail({ email: data.email }, callback);
  }, 

  getAllUsers: (req, res, next) => {
    const callback = (error, results, fields) => {
      if (error) {
        console.log("Error readAllUser:", error);
        res.status(500).json(error);
      } else {
        res.status(200).json({
          count: results.length,
          data: results
        });
      }
    };

    userModel.getUsers(callback);
  }
};

module.exports = userController;