const db = require('../db/db');

const users = db.get('users');
users.createIndex('username', {unique: true});

module.exports = {
    users
};