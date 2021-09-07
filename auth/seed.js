const bcrypt = require("bcrypt");
const { users } = require("./auth.db")

const pw = async (p) => {
    return await bcrypt.hash(p, 12);
}

const defaultUser = {
    username: process.env.ROOT_USER,
    password: pw(process.env.ROOT_PW),
    date_created: new Date().toUTCString()
}

const seed = async () => {

    console.log("Checking if Root User exists");

    const db_result = await users.findOne({
        username: process.env.ROOT_USER
    })

    if(db_result) return;

    console.log("Creating Root User");

    const user = {
        username: process.env.ROOT_USER,
        password: await bcrypt.hash(process.env.ROOT_PW, 12),
        fullName: "",
        date_created: new Date(Date.now()).toUTCString()
    }

    const db_insert = await users.insert(user);

    if(db_insert.error) {
        console.log(error);
        return;
    }

    console.log("Inserted Root User with username: " + process.env.ROOT_USER);

}


module.exports = seed;