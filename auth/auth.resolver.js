const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { users } = require('./auth.db');


function signJWT(payload) {
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}

const createUser = async (args) => {
    const username = args.username;
    const password = await bcrypt.hash(args.password, 12);
    const createdAt = new Date();

    const existingUser = await users.findOne({ username: username });
    if(existingUser) throw new Error("Username already taken");

    const response = await users.insert({
        username: username,
        password: password,
        createdAt: createdAt
    })

    const payload = {
        _id: response._id
    }

    const jwt = await signJWT(payload);

    return {username, jwt};
}

const login = async (args) => {
    const username = args.username;
    const password = args.password;

    const existingUser = await users.findOne({ username: username });
    if(!existingUser) throw new Error("Could not login");

    const valid = await bcrypt.compare(password, existingUser.password);
    if(!valid) throw new Error("Could not login");

    const token = await signJWT({ _id: existingUser._id });
    return { username: existingUser.username, jwt: token };
}


module.exports = {
    createUser,
    login
}