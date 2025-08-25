const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Handle Google OAuth authentication
const googleAuth = async (req, res) => {
    const { email, firstName, lastName, googleId, picture } = req.body;

    // Validation
    if (!email || !firstName || !lastName || !googleId) {
      return res.status(400).json({
        error: "Missing required Google authentication data"
      });
    }

    try {
      console.log("Google auth request received:", { email, firstName, lastName, googleId });
      
      // First, ensure Google columns exist in the database
      userModel.addGoogleColumns((columnError) => {
        if (columnError && !columnError.message.includes('Duplicate column name')) {
          console.log('Note: Google columns may already exist or there was an issue adding them');
        }
      });

      // Check if user exists with this email
      console.log("Checking if user exists with email:", email);
      userModel.getUserByEmail(email, async (error, existingUser) => {
        if (error) {
          console.error("Error checking existing user:", error);
          return res.status(500).json({
            error: "Database error during authentication"
          });
        }
        
        console.log("getUserByEmail result - error:", error, "existingUser:", existingUser);

        let user;
        
        if (existingUser && existingUser.length > 0) {
          // User exists, update Google ID if not set
          if (!existingUser.googleId) {
            userModel.updateGoogleId(existingUser.userID, googleId, (updateError) => {
              if (updateError) {
                console.error("Error updating Google ID:", updateError);
              }
            });
          }
          user = existingUser;
        } else {
          // Create new user with Google data
          const userData = {
            username: email.split('@')[0], // Use email prefix as username
            email,
            password: null, // No password for Google users
            firstName,
            lastName,
            role: 'admin',
            googleId,
            picture
          };

          // Create user without password validation
          console.log("Creating new Google user with data:", userData);
          userModel.createGoogleUser(userData, (createError, results) => {
            if (createError) {
              console.error("Error creating Google user:", createError);
              return res.status(500).json({
                error: "Failed to create user account"
              });
            }
            
            console.log("Google user created successfully:", results);

            user = {
              userID: results.insertId,
              username: userData.username,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role,
              googleId: userData.googleId,
              picture: userData.picture
            };

            // Generate JWT token
            const token = jwt.sign(
              { 
                userID: user.userID, 
                email: user.email, 
                role: user.role 
              },
              process.env.JWT_SECRET || 'your-secret-key',
              { expiresIn: '24h' }
            );

            return res.status(200).json({
              message: "Google authentication successful",
              token,
              user: {
                userID: user.userID,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                picture: user.picture
              }
            });
          });
          return; // Exit early for new user creation
        }

        // Generate JWT token for existing user
        const token = jwt.sign(
          { 
            userID: user.userID, 
            email: user.email, 
            role: user.role 
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.status(200).json({
          message: "Google authentication successful",
          token,
          user: {
            userID: user.userID,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            picture: user.picture
          }
        });
      });

    } catch (error) {
      console.error("Google authentication error:", error);
      res.status(500).json({
        error: "Internal server error during Google authentication"
      });
    }
};

module.exports = { googleAuth };
