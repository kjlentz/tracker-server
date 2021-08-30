const user = (args) => {
    return {
        _id: "23423",
        username: args.username,
        fullName: ""
    }
}

module.exports = {
    typeDefs: `
        type User {
            _id: String!
            username: String!
            fullName: String
        }

        type Query {
            user(username: String!): User
        }
    `,
    resolvers: {
        Query: {
            user: (parent, args) => {
                return user(args)
            }
        }
    }
}