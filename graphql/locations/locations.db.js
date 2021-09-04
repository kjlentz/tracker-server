const db = require('../../db/connection');

const locations = db.get('locations');
locations.createIndex('_id');

module.exports = {
    locations
};