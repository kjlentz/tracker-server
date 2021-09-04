const { createApplication, createModule, gql } = require('graphql-modules');
const { travelsSchema } = require('./travels');
const { locationsSchema } = require("./locations");

const root = createModule({
    id: "root",
    dirname: __dirname,
    typeDefs: [
        gql`
            type Query {
                hello: String
            }

            type Mutation {
                hello: String
            }
        `,
    ],
})

const application = createApplication({
    modules: [root, locationsSchema, travelsSchema ],
});

module.exports = {
    application
};