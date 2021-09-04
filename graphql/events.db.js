const db = require('../db/connection');

const events = db.get('events');
events.createIndex('_id');

module.exports = {
    events
};