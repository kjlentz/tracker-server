const { createModule } = require('graphql-modules');

const travelTypes = require("./travels.types");
const travelResolvers = require("./travels.resolvers");

const travelsSchema = createModule({
    id: 'events',
    dirname: __dirname,
    typeDefs: [travelTypes],
    resolvers: [travelResolvers]
});

module.exports = {
    travelsSchema
}