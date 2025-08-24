const pool = require('../services/db');

var userModel = {
    getUsers: (callback) => {
     
        //code...
        const SQLSTATMENT = `
            SELECT * FROM user;
            `;

        pool.query(SQLSTATMENT, callback); 
    },

    getUserById: (data, callback) => {
 
        //code...
        const SQLSTATMENT = `
            SELECT * FROM user
            WHERE userID = ?;
            `;
        const VALUES = [data.userId];

        pool.query(SQLSTATMENT, VALUES, callback);
    },

    createNewUser: (data, callback) => {

        //code...
        const SQLSTATMENT = `
            INSERT INTO user (username, email, role, password)
            VALUES (?,?,?,?);
            `;
        const VALUES = [data.username, data.email, data.role, data.password];

        pool.query(SQLSTATMENT, VALUES, callback);
    },

    updateUserById : (data, callback) => {
     
        //code...
        const SQLSTATMENT = `
            UPDATE user
            SET email=?, password=?
            WHERE userID=?;
            `;

        const VALUES = [data.email, data.password, data.userId];

        pool.query(SQLSTATMENT, VALUES, callback);
    },

    deleteUserById : (data, callback) => {
        
        //code...
        const SQLSTATMENT = `
            DELETE FROM user
            WHERE userID = ?
            `;

        const VALUES = [data.userId];

        pool.query(SQLSTATMENT, VALUES, callback);
    },

    login : (data,callback) => {
        const SQLSTATEMENT = `
            SELECT * FROM user
            WHERE email = ? AND role = 'Admin'; 
            `;
    
        const VALUES = [data.email];
        pool.query(SQLSTATEMENT, VALUES, callback);
    }
}

module.exports = userModel;