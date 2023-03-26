
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList } = require("graphql");
const mockData = require('./mocked_datas/mock_book.json')




// READ



const additionalData = new GraphQLObjectType({
  name: 'AdditionalData',
  fields: {
    birthDate: {
      type: GraphQLString
    },
    fullName: {
      type: GraphQLString
    },
    nationality: {
      type: GraphQLString
    }
  }
})


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => {
    return {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      author: { type: GraphQLString },
      pages: { type: GraphQLInt },
      additional: {
        type: additionalData,
        resolve: (obj, args, context, info) => {

          console.log(context)

          return {
            birthDate: new Date().toDateString(),
            fullName: 'John Doe',
            nationality: 'German'
          }
        }
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      User: new GraphQLObjectType({
        id,
        username,
        email,
        createdAt
      }),
      Files: {
        
      },
      Post
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      name: { type: GraphQLString }
    }
  })
});

module.exports = {schema}