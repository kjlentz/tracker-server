const user = process.env.MONGO_USER;
const pw = process.env.MONGO_PW;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const db = process.env.MONGO_DB;

const monk = require('monk');
const url = 'mongodb://' + user + ':' + pw + '@' + host + ':' + port + '/' + db + '?authSource=' + db + '&readPreference=primary&appname=tracker_backend&ssl=false';
const database = monk(url);

module.exports = database;