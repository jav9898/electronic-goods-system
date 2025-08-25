const jwt = require('jsonwebtoken');

const jwtMiddleware = {
  // Generate JWT token
  generateToken: (req, res, next) => {
    const payload = {
      userID: res.locals.userid,
      role: res.locals.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    res.locals.token = token;
    next();
  },

  // Send token response
  sendToken: (req, res) => {
    res.status(200).json({
      message: res.locals.message || "Authentication successful",
      token: res.locals.token,
      user: {
        userID: res.locals.userid,
        role: res.locals.role
      }
    });
  },

  // Verify JWT token
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: "Access denied. No token provided."
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        error: "Invalid token."
      });
    }
  },

  // Verify admin role
  verifyAdmin: (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        error: "Access denied. Admin role required."
      });
    }
    next();
  }
};

module.exports = jwtMiddleware;
