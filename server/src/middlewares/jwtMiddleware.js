require('dotenv').config(); //read .env file and set environment variables
const jwt = require('jsonwebtoken');

var jwtMiddleware = {
    //////////////////////////////////////////////////////
    // MIDDLEWARE FUNCTION FOR GENERATING JWT TOKEN
    //////////////////////////////////////////////////////
    generateToken: (req, res, next) => {
        const payload = {
            userid: res.locals.userid,
            role: res.locals.role,
            timestamp: new Date()
        };
        const options = {
            algorithm: process.env.JWT_ALGORITHM,
            expiresIn: process.env.JWT_EXPIRES_IN
        };
        const callback = (err, token) => {
            if (err) {
                console.error("Error jwt:", err);
                res.status(500).json(err);
            } else {
                res.locals.token = token;
                next();
            }
        };
        /*
    This function takes req, res, and next as parameters.
    Inside the function:
                Define the payload object containing the userId and timestamp.
    Set the options object with the algorithm and expiration.
    Define a callback function to handle errors and the generated token.
    Use the jwt.sign() method to generate a token using the payload, secret key,
                options, and callback.
    If there are no errors, store the generated token in res.locals.token and move
    to the next middleware or route handler.
    If there is an error, handle it by logging an error message and returning a
    500 status code.
            Step 5: Define the Middleware Function for Sending
        */
        // Generate a JWT token with the provided payload and duration
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options, callback);
    }//place after generateToken function within the same json object
    //////////////////////////////////////////////////////
    // MIDDLEWARE FUNCTION FOR SENDING JWT TOKEN
    //////////////////////////////////////////////////////
    , sendToken: (req, res, next) => {

        /*
        This function sends the JWT token in the JSON response.
        Set the response status to 200 and send the token along with an optional
            message.
                Step 6: Define the Middleware Function for Verifying
        JWT Token
        Create a middleware function named verifyToken:
        */
        res.status(200).json({
            message: res.locals.message,
            token: res.locals.token,
        });
    },

    //////////////////////////////////////////////////////
    // MIDDLEWARE FUNCTION FOR VERIFYING JWT TOKEN
    //////////////////////////////////////////////////////
    verifyToken: (req, res, next) => {
        // Get the token from the request headers
        const authHeader = req.headers.authorization;
        // Check if the Authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Check if the token exists
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
            /*
           This function verifies the JWT token sent in the request headers.
           Get the token from the Authorization header and remove the "Bearer " prefix.
           Check if the token exists, and if not, return a 401 error response.
           Use the jwt.verify() method to verify the token with the secret key and handle the
            callback.
           If there are no errors, store the decoded userid and timestamp in res.locals and
           move to the next middleware or route handler.
           If there is an error, handle it by returning a 401 error response.*/
        }
        const callback = (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            }
            // Token is valid, store the decoded information for later use
            res.locals.userid = decoded.userid;
            res.locals.role = decoded.role;
            res.locals.tokenTimestamp = decoded.timestamp;
            // Move to the next middleware or route handler
            next();
        };
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_KEY, callback);
    },
    verifyAdmin: (req, res, next) => {

        if(res.locals.role=="admin"){
            next();
        }else{
            return res.status(401).json({ error: "Invalid Role" });

        }
    }


}
module.exports = jwtMiddleware;
