const { events } = require("../events.db");
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

module.exports = {
    Query: {
        travels: async (_p, { start_location, end_location, start_time, end_time, _id, vehicle }, context) => {
            const user_id = context.user._id;

            const query = Object.assign({},
                vehicle && {vehicle},
                start_location && {start_location},
                end_location && {end_location},
                start_time && {start_time},
                end_time && {end_time},
                _id && {_id}
            );

            query.owner_id = new ObjectID(user_id);
            query.type = "travel";

            const db_result = await events.find(query)

            if(!db_result){
                throw new Error("smth wrong")
            }

            return db_result
        }
    },
    Mutation: {
        startTravel: async (_, { location, time, vehicle }, context) => {

            const user_id = context.user._id;

            const db_result = await events.insert({
                owner_id: new ObjectID(user_id),
                type: "travel",
                start_location: location,
                end_location: "----",
                start_time: time,
                end_time: "----",
                vehicle,
                created_at: new Date(Date.now()).toUTCString(),
                last_updated: new Date(Date.now()).toUTCString()
            })

            if(!db_result){
                throw new Error("smth wrong")
            }

            return db_result
        },

        endTravel: async (_, { location, time, travel_id }, context) => {

            const user_id = context.user._id;

            const db_result = await events.findOneAndUpdate(
                {
                    owner_id: new ObjectID(user_id),
                    _id: new ObjectID(travel_id)
                },
                {$set: {
                    end_location: location,
                    end_time: time,
                    last_updated: new Date(Date.now()).toUTCString()
                }})

            if(!db_result) {
                throw new Error("smth wrong")
            }


            return db_result

        }
    },
}