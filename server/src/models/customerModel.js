const pool = require("../services/db");
const bcrypt = require('bcrypt');

var customerModel = {
  // Create Customers table
  createCustomersTable: (callback) => {
    const query = `
      CREATE TABLE IF NOT EXISTS Customers (
        customerID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        phone VARCHAR(20) NULL,
        dateOfBirth DATE NULL,
        gender ENUM('male', 'female', 'other') NULL,
        googleId VARCHAR(255) NULL,
        picture VARCHAR(500) NULL,
        isActive BOOLEAN DEFAULT true,
        emailVerified BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    pool.query(query, callback);
  },

  // Register new customer
  registerCustomer: async (customerData, callback) => {
    try {
      console.log("Starting customer registration for:", customerData.email);
      let hashedPassword = null;
      
      if (customerData.password) {
        const saltRounds = 12;
        hashedPassword = await bcrypt.hash(customerData.password, saltRounds);
        console.log("Password hashed successfully");
      }
      
      const query = `
        INSERT INTO Customers 
        (username, email, password, firstName, lastName, phone, dateOfBirth, gender) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      pool.query(query, [
        customerData.username,
        customerData.email,
        hashedPassword,
        customerData.firstName,
        customerData.lastName,
        customerData.phone || null,
        customerData.dateOfBirth || null,
        customerData.gender || null
      ], (error, results) => {
        if (error) {
          console.error("Database insert error:", error);
          callback(error, null);
        } else {
          console.log("Customer registration successful:", results);
          callback(null, results);
        }
      });
    } catch (error) {
      console.error("Customer registration function error:", error);
      callback(error, null);
    }
  },

  // Find customer by email for login
  findCustomerByEmail: (email, callback) => {
    const query = `
      SELECT customerID, email, password, firstName, lastName, phone, 
             dateOfBirth, gender, googleId, picture, isActive, emailVerified
      FROM fashion.Customers 
      WHERE email = ? AND isActive = true
    `;
    pool.query(query, [email], callback);
  },

  // Get customer by email for Google auth
  getCustomerByEmail: (email, callback) => {
    const query = `
      SELECT customerID, email, firstName, lastName, phone, googleId, picture, emailVerified
      FROM fashion.Customers 
      WHERE email = ? AND isActive = true
    `;
    pool.query(query, [email], callback);
  },

  // Create Google customer without password
  createGoogleCustomer: (customerData, callback) => {
    const query = `
      INSERT INTO fashion.Customers 
      (email, firstName, lastName, googleId, picture, emailVerified) 
      VALUES (?, ?, ?, ?, ?, true)
    `;
    
    pool.query(query, [
      customerData.email,
      customerData.firstName,
      customerData.lastName,
      customerData.googleId,
      customerData.picture
    ], callback);
  },

  // Update Google ID for existing customer
  updateCustomerGoogleId: (customerID, googleId, callback) => {
    const query = `
      UPDATE fashion.Customers 
      SET googleId = ?, emailVerified = true 
      WHERE customerID = ?
    `;
    pool.query(query, [googleId, customerID], callback);
  },

  // Get all customers (for admin)
  getAllCustomers: (callback) => {
    const query = `
      SELECT customerID, email, firstName, lastName, phone, 
             isActive, emailVerified, createdAt 
      FROM fashion.Customers 
      ORDER BY createdAt DESC
    `;
    pool.query(query, callback);
  },

  // Update customer profile
  updateCustomerProfile: (customerID, updateData, callback) => {
    const fields = [];
    const values = [];
    
    if (updateData.firstName) {
      fields.push('firstName = ?');
      values.push(updateData.firstName);
    }
    if (updateData.lastName) {
      fields.push('lastName = ?');
      values.push(updateData.lastName);
    }
    if (updateData.phone) {
      fields.push('phone = ?');
      values.push(updateData.phone);
    }
    if (updateData.dateOfBirth) {
      fields.push('dateOfBirth = ?');
      values.push(updateData.dateOfBirth);
    }
    if (updateData.gender) {
      fields.push('gender = ?');
      values.push(updateData.gender);
    }
    
    if (fields.length === 0) {
      return callback(new Error('No fields to update'), null);
    }
    
    values.push(customerID);
    
    const query = `
      UPDATE fashion.Customers 
      SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP 
      WHERE customerID = ?
    `;
    
    pool.query(query, values, callback);
  }
};

module.exports = customerModel;
