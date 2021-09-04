const { createModule } = require('graphql-modules');

const locationTypes = require("./location.types")
const locationResolvers = require("./location.resolvers")


const locationsSchema = createModule({
    id: 'locations',
    dirname: __dirname,
    typeDefs: [ locationTypes ],
    resolvers: [ locationResolvers ]
})

module.exports = {
    locationsSchema
}