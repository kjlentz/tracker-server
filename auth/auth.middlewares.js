const jwt = require('jsonwebtoken');

const { users } = require('./auth.db');




/*
* checks if the request has an authorization token and sets the user for next middlewares
*/
async function checkTokenSetUser(req, res, next) {

    //get the auth header from the request
    const token = req.cookies.access_token;

    //if there is a header
    if(token){

        //verify the token with the token secret
        jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {

            //log the error
            if(error){
                res.status(401);
                next(error);
            }

            //get the corresponding user from the db
            req.user = user;

            //call the next middleware
            next();

        })
    
    //if there is no token, call next middleware
    } else {
        next();
    }
}



/*
* Validates the submitted user data for SIGNUP
*/
const validateSignUpUser = (defaultErrorMessage) => (req, res, next) => {

    if(!req.body.username || !req.body.password) {
        console.log("error");
        const error = new Error("Unable to sign up.");
        res.status(422);
        next(error);
        return;
    }

    next();
}; 

/*
* Validates the submitted user data for SIGNUP
*/
const validateLoginUser = (defaultErrorMessage = '') => (req, res, next) => {

    if(!req.body.username || !req.body.password){
        const error = defaultErrorMessage ? new Error(defaultErrorMessage) : result.error;
        res.status(422);
        next(error);
    }

    next();
};


const findUser = (defaultLoginError, isError, errorCode = 422) => async (req, res, next) => {
    try {
        const user = await users.findOne({
            username: req.body.username,
        });

        if (isError(user)) {

            console.log("error " + errorCode)

            res.status(errorCode);
            next(new Error(defaultLoginError));

        } else {

            req.loggingInUser = user;
            next();

        }
    } catch (error) {
        res.status(500);
        next(error);
    }
};


function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        unAuthorized(res, next);
    }
}

function unAuthorized(res, next) {
    const error = new Error('Unauthorized');
    res.status(401);
    next(error);
}


module.exports = {
    checkTokenSetUser,
    validateSignUpUser,
    validateLoginUser,
    findUser,
    isLoggedIn,
    unAuthorized
}