
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList } = require("graphql");
const mockData = require('./MOCK_DATA.json')


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    pages: { type: GraphQLInt }
  })
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: () => ({
      Book: {
        type: new GraphQLList(BookType),
        resolve: () => {
          return mockData
        },
      },
    })
  })
});

module.exports = {schema}