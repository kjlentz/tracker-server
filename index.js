const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const authResolver = require("./auth/auth.resolver");

const PORT = 4000;

const app = express();

const schema = buildSchema(`
    type User {
        username: String!
        jwt: String!
    },
    type Query {
        hello: String
    },
    type Mutation {
        createUser(username: String!, password: String!): User!
        login(username: String!, password: String!): User!
    }
`);

const root = {
    hello: () => {
        return 'Hello world!';
    },
    ...authResolver
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(PORT, () => {
    console.log("Tracker server listening on port " + PORT);
});