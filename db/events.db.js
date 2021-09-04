const db = require('./connection');

const events = db.get('events');
events.createIndex('_id', {unique: true});

module.exports = {
    events
};