# Google Sign-In API Implementation Guide

## Overview
This guide explains how to set up and use Google Sign-In authentication in your React application with Node.js backend.

## Prerequisites
- Google Cloud Console account
- React application with Tailwind CSS
- Node.js backend with MySQL database

## Setup Instructions

### 1. Google Cloud Console Setup

1. **Create/Select Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized origins: `http://localhost:3000`
   - Copy the Client ID

### 2. Environment Configuration

1. **Frontend (.env)**
   ```bash
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
   ```

2. **Backend (.env)**
   ```bash
   JWT_SECRET=your_jwt_secret_key
   ```

### 3. Database Schema Updates

The database schema has been updated to support Google authentication:

```sql
CREATE TABLE IF NOT EXISTS fashion.Admin_Users (
  userID INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NULL,          -- Now nullable for Google users
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  role ENUM('admin', 'super_admin') DEFAULT 'admin',
  googleId VARCHAR(255) NULL,          -- New: Google user ID
  picture VARCHAR(500) NULL,           -- New: Profile picture URL
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Implementation Details

### Frontend Components

1. **useGoogleAuth Hook** (`/src/hooks/useGoogleAuth.js`)
   - Loads Google Identity Services script
   - Handles Google Sign-In initialization
   - Manages authentication flow

2. **Updated LoginForm** (`/src/components/ui/login-form.tsx`)
   - Integrated Google Sign-In button
   - Handles both email/password and Google authentication
   - Decodes JWT tokens from Google response

### Backend Endpoints

1. **Google Authentication** (`POST /user/google-auth`)
   - Accepts Google user data
   - Creates new users or authenticates existing ones
   - Returns JWT token for session management

2. **Updated User Model**
   - `getUserByEmail()`: Find users by email
   - `createGoogleUser()`: Create users without password
   - `updateGoogleId()`: Link Google ID to existing accounts

## Authentication Flow

### Google Sign-In Process

1. **User clicks "Sign in with Google"**
2. **Google Identity Services popup opens**
3. **User authenticates with Google**
4. **Google returns JWT credential**
5. **Frontend decodes JWT to extract user info**
6. **Frontend sends user data to `/user/google-auth`**
7. **Backend creates/authenticates user**
8. **Backend returns app JWT token**
9. **User is logged into the application**

### Data Flow

```javascript
// Google Response (decoded JWT)
{
  email: "user@gmail.com",
  given_name: "John",
  family_name: "Doe",
  sub: "google_user_id",
  picture: "https://profile_picture_url"
}

// Sent to Backend
{
  email: "user@gmail.com",
  firstName: "John",
  lastName: "Doe",
  googleId: "google_user_id",
  picture: "https://profile_picture_url",
  isGoogleAuth: true
}

// Backend Response
{
  message: "Google authentication successful",
  token: "jwt_token_here",
  user: {
    userID: 123,
    username: "user",
    email: "user@gmail.com",
    firstName: "John",
    lastName: "Doe",
    role: "admin",
    picture: "https://profile_picture_url"
  }
}
```

## Security Considerations

1. **JWT Token Validation**
   - Google JWT tokens are decoded client-side
   - Backend generates its own JWT for session management
   - Tokens expire after 24 hours

2. **User Data Protection**
   - Google ID stored securely in database
   - Profile pictures loaded from Google's CDN
   - No password stored for Google users

3. **Account Linking**
   - Existing email accounts can be linked to Google
   - Google ID added to existing user records
   - Prevents duplicate accounts

## Testing

1. **Setup Test Environment**
   - Add `http://localhost:3000` to authorized origins
   - Use test Google account
   - Verify database schema updates

2. **Test Scenarios**
   - New user Google sign-in
   - Existing user Google sign-in
   - Account linking
   - Error handling

## Troubleshooting

### Common Issues

1. **"Google Sign-In is loading"**
   - Check internet connection
   - Verify Google Client ID in .env
   - Check browser console for errors

2. **"Failed to create user account"**
   - Verify database schema is updated
   - Check backend logs for SQL errors
   - Ensure googleId and picture columns exist

3. **CORS Errors**
   - Add domain to Google Cloud Console authorized origins
   - Check backend CORS configuration

### Debug Steps

1. **Check Browser Console**
   ```javascript
   // Verify Google script loaded
   console.log(window.google);
   
   // Check environment variables
   console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
   ```

2. **Check Backend Logs**
   ```bash
   # Monitor server logs
   npm start
   ```

3. **Database Verification**
   ```sql
   -- Check table structure
   DESCRIBE fashion.Admin_Users;
   
   -- Check Google users
   SELECT * FROM fashion.Admin_Users WHERE googleId IS NOT NULL;
   ```

## Production Deployment

1. **Update Authorized Origins**
   - Add production domain to Google Cloud Console
   - Update environment variables for production

2. **Security Hardening**
   - Use strong JWT secrets
   - Enable HTTPS
   - Implement rate limiting

3. **Monitoring**
   - Log authentication attempts
   - Monitor failed sign-ins
   - Track user creation/linking

## Support

For issues with this implementation:
1. Check browser console for client-side errors
2. Review server logs for backend issues
3. Verify Google Cloud Console configuration
4. Test with different Google accounts
