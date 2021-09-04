const { gql } = require('graphql-modules');

module.exports = gql`

type Location {
    _id: String!
    name: String!
    geo: String!
}

extend type Query {
    locations: [Location!]!
}

`;