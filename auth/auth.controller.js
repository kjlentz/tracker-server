const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { users } = require('./auth.db');

const createTokenSendResponse = async (payload, res, next) => {

    jwt.sign(
        payload,
        process.env.TOKEN_SECRET, {
            expiresIn: '1d',
        }, (err, token) => {

            if (err) {

                res.status(422);
                const error = Error('Unable to login');
                next(error);

            } else {

                return res
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                    })
                    .status(200)
                    .json({ ok: true, username: payload.username });

            }
        },
    );
  };


//root path
const get = (req, res) => {
    res.json({
        message: 'Auth',
    });
};
  


const signup = async (req, res, next) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const date = new Date().toUTCString();
        
        //create newUser Object
        const newUser = {
            username: req.body.username,
            password: hashedPassword,
            fullName: "",
            date_created: date
        };

        console.log("inserting user")

        //insert new user into database
        const insertedUser = await users.insert(newUser);

        //Create user for token
        const tokenUser = {
            _id: insertedUser._id,
            username: insertedUser.username
        }

        createTokenSendResponse(tokenUser, res, next);

    } catch (error) {
        res.status(500);
        next(error);
    }
};



const login = async (req, res, next) => {
    console.log("login");
    try {

      const result = await bcrypt.compare(
        req.body.password,
        req.loggingInUser.password
      );

      if (result) {

        const payload = {
            _id: req.loggingInUser._id,
            username: req.loggingInUser.username
        }

        delete req.loggingInUser;

        createTokenSendResponse(payload, res, next);

      } else {

        res.status(422);
        throw new Error('Unable to login');

      }
    } catch (error) {
      res.status(res.statusCode === 200 ? 500 : res.statusCode);
      next(error);
    }
};

module.exports = {
    get,
    signup,
    login
};