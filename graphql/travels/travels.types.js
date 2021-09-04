const { gql } = require('graphql-modules');

module.exports = gql`

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
    travels(
        start_location: String
        end_location: String
        start_time: String
        end_time: String
        _id: String
        vehicle: Vehicle
    ): [Travel!]!
}
`;