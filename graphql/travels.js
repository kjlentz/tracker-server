const { createModule, gql } = require('graphql-modules');
const { events } = require("../db/events.db");
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

const travelsSchema = createModule({
    id: 'events',
    dirname: __dirname,
    typeDefs: [
        gql`
            enum Vehicle {
                CAR
                TRAM
                TRAIN
                BUS
                BIKE
                FOOT
                PLANE
                BOAT
            }

            type Travel {
                _id: String!
                start_location: String
                end_location: String
                start_time: String!
                end_time: String!
                created_at: String!
                last_updated: String!
                vehicle: Vehicle!
            }

            extend type Mutation {
                startTravel(location: String, time: String!, vehicle: Vehicle!): Travel!
                endTravel(location: String, time: String!, travel_id: String!): Travel!
            }

            extend type Query {
                allTravels: [Travel!]!
            }
        `,
    ],
    resolvers: {
        Query: {
            allTravels: async (_p, _a, context) => {
                const user_id = context.user._id;

                const db_result = await events.find({
                    owner_id: new ObjectID(user_id),
                    type: "travel"
                })

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
    },
});

module.exports = {
    travelsSchema
}