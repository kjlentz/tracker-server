const { locations } = require("./locations.db");
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

module.exports = {
    Query: {
        locations: () => {
            return "locations"
        }
    },
    Mutation: {}
};