const bcrypt = require('bcrypt');
const model = require("../models/userModel.js");

const userController={
   getAllUser: (req, res, next) => {
       const callback = (error, results, fields) => {
           if (error) {
               console.error("Error get all user:", error);
               res.status(500).json(error);
           }  
           else res.status(200).json(results);
       }

       model.getUsers(callback);
    },
    
    getUserById: (req, res, next) => {
          const data = {
            userId: req.params.userId
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error get user by ID:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "User not found"
                    });
                }
                else res.status(200).json(results[0]);
            }
        }

        model.getUserById(data, callback);

    },
    
    createNewUser: (req, res, next) => {
        const data = {
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            password: res.locals.hash
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error create new user:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json({
                    message: "User created successfully",
                    userID: results.insertId
                });
            }
        }

        model.createNewUser(data, callback);
    },
    
    updateUserById: async (req, res, next) => {
        const data = {
            userId: req.params.userId,
    
        };

        // Only add fields if they are present in the request
        if (req.body.email) data.email = req.body.email;
        if (req.body.password) {
            try {
                data.password = await bcrypt.hash(req.body.password, 10);
            } catch (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ message: "Internal server error" });
            }
        }

        // If no updatable fields provided
        if (!data.email && !data.password) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const callback = (error, results) => {
            if (error) {
                console.error("Error update user by ID:", error);
                res.status(500).json({ message: "Internal server error" });
            } else {
                if (results.affectedRows == 0) {
                    res.status(404).json({ message: "User not found" });
                } else {
                    res.status(204).send(); // 204 No Content
                }
            }
        };

        model.updateUserById(data, callback);

    },
    
    deleteUserById: (req, res, next) => {
        const data = {
            userId: req.params.userId
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error delete user by ID:", error);
                res.status(500).json(error);
            } else {
                if(results.affectedRows == 0) 
                {
                    res.status(404).json({
                        message: "User not found"
                    });
                }
                else res.status(204).send(); // 204 No Content            
            }
        }

        model.deleteUserById(data, callback);
    },

    login: (req, res, next) => {

        const data = {
            email: req.body.email,
            password: req.body.password
        };

        const callback = (error, results, fields) => {
            if (error) {
                    console.error("Error Login:", error);
                    res.status(500).json(error);
            } else {
                if (results.length == 0) { //no match 
                    res.status(404).json({
                        message: "email/password wrong",
                    });

                } else { //match email and password
                    res.locals.userid = results[0].userid;  //saves userid from database in res.locals for use in jwt payload
                    res.locals.role = results[0].role;  //saves role from database in res.locals for use in jwt payload
                    res.locals.hash = results[0].password;  //for bcrypt compare
                    res.locals.message = "Login successful";

                    next(); //call next middleware to issue token
                }
            }
        }

        model.login(data, callback);
    }
}

module.exports=userController;