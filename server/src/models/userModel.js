const pool = require("../services/db");

var userModel = {
  // Find a user by email & password
  findUserByEmail: (data, callback) => {
    const query = "SELECT * FROM user WHERE Email=?";
    pool.query(query, [data.email], callback);
  },

  // Get all users
  getUsers: (callback) => {
    const query = "SELECT * FROM user";
    pool.query(query, [], callback);
  },
};

module.exports = userModel;
