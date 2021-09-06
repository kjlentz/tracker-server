const db = require('../db/connection');

const locations = db.get('locations');
users.createIndex('name', {unique: true});

module.exports = {
    locations
};