const pool = require("../services/db");
const bcrypt = require('bcrypt');

var userModel = {
  // Create Admin_Users table
  createUsersTable: (callback) => {
    const query = `
      CREATE TABLE IF NOT EXISTS fashion.Admin_Users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        googleId VARCHAR(255) NULL,
        picture VARCHAR(500) NULL,
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    pool.query(query, callback);
  },

  // Register new admin user
  registerUser: async (userData, callback) => {
    try {
      console.log("Starting user registration for:", userData.email);
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      console.log("Password hashed successfully");
      
      const query = `
        INSERT INTO fashion.Admin_Users 
        (username, email, password, firstName, lastName, role) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      console.log("Executing query:", query);
      console.log("With values:", [
        userData.username,
        userData.email,
        '[HASHED]',
        userData.firstName,
        userData.lastName,
        userData.role || 'admin'
      ]);
      
      pool.query(query, [
        userData.username,
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || 'admin'
      ], (error, results) => {
        if (error) {
          console.error("Database insert error:", error);
          callback(error, null);
        } else {
          console.log("Database insert successful:", results);
          callback(null, results);
        }
      });
    } catch (error) {
      console.error("Registration function error:", error);
      callback(error, null);
    }
  },

  // Find a user by email & password (legacy support)
  findUserByEmail: (data, callback) => {
    const query = "SELECT * FROM user WHERE Email=?";
    pool.query(query, [data.email], callback);
  },

  // Find admin user by email (new method)
  findAdminByEmail: (email, callback) => {
    const query = `
      SELECT userID, username, email, password, firstName, lastName, role, isActive 
      FROM fashion.Admin_Users 
      WHERE email = ? AND isActive = true
    `;
    pool.query(query, [email], callback);
  },

  // Get all users (legacy)
  getUsers: (callback) => {
    const query = "SELECT * FROM user";
    pool.query(query, [], callback);
  },

  // Get all admin users (new method)
  getAllAdminUsers: (callback) => {
    const query = `
      SELECT userID, username, email, firstName, lastName, role, isActive, createdAt 
      FROM fashion.Admin_Users 
      ORDER BY createdAt DESC
    `;
    pool.query(query, callback);
  },

  // Get user by email for Google auth
  getUserByEmail: (email, callback) => {
    const query = `
      SELECT userID, username, email, firstName, lastName, role, googleId, picture
      FROM fashion.Admin_Users 
      WHERE email = ? AND isActive = true
    `;
    pool.query(query, [email], callback);
  },

  // Create Google user without password
  createGoogleUser: (userData, callback) => {
    const query = `
      INSERT INTO fashion.Admin_Users 
      (username, email, firstName, lastName, role, googleId, picture) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    pool.query(query, [
      userData.username,
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.role || 'admin',
      userData.googleId,
      userData.picture
    ], callback);
  },

  // Update Google ID for existing user
  updateGoogleId: (userID, googleId, callback) => {
    const query = `
      UPDATE fashion.Admin_Users 
      SET googleId = ? 
      WHERE userID = ?
    `;
    pool.query(query, [googleId, userID], callback);
  }
};

module.exports = userModel;
