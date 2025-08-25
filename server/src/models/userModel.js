const pool = require("../services/db");
const bcrypt = require('bcrypt');

const userModel = {
  // Create users table if it doesn't exist
  createUsersTable: (callback) => {
    const query = `
      CREATE TABLE IF NOT EXISTS fashion.Admin_Users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
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
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const query = `
        INSERT INTO fashion.Admin_Users 
        (username, email, password, firstName, lastName, role) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      pool.query(query, [
        userData.username,
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || 'admin'
      ], callback);
    } catch (error) {
      callback(error, null);
    }
  },

  // Find user by email for login
  findUserByEmail: (email, callback) => {
    const query = `
      SELECT userID, username, email, password, firstName, lastName, role, isActive 
      FROM fashion.Admin_Users 
      WHERE email = ? AND isActive = true
    `;
    pool.query(query, [email], callback);
  },

  // Find user by username
  findUserByUsername: (username, callback) => {
    const query = `
      SELECT userID, username, email, firstName, lastName, role, isActive 
      FROM fashion.Admin_Users 
      WHERE username = ? AND isActive = true
    `;
    pool.query(query, [username], callback);
  },

  // Get all admin users
  getAllUsers: (callback) => {
    const query = `
      SELECT userID, username, email, firstName, lastName, role, isActive, createdAt 
      FROM fashion.Admin_Users 
      ORDER BY createdAt DESC
    `;
    pool.query(query, callback);
  },

  // Update user profile
  updateUser: (userID, userData, callback) => {
    const query = `
      UPDATE fashion.Admin_Users 
      SET firstName = ?, lastName = ?, email = ?, role = ? 
      WHERE userID = ?
    `;
    pool.query(query, [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.role,
      userID
    ], callback);
  },

  // Deactivate user
  deactivateUser: (userID, callback) => {
    const query = `
      UPDATE fashion.Admin_Users 
      SET isActive = false 
      WHERE userID = ?
    `;
    pool.query(query, [userID], callback);
  }
};

module.exports = userModel;