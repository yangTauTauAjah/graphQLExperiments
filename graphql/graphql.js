const { GraphQLSchema } = require("graphql");
const { query, mutation } = require("./model");

const schema = new GraphQLSchema({ query, mutation });

module.exports = { schema };
