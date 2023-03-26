const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");
const mockData = require("./mocked_datas/mock_book.json");
const mockUserData = require("./mocked_datas/mock_user_data.json");
const mockFiles = require("./mocked_datas/mock_files.json");
const mockComments = require("./mocked_datas/mock_comments.json");

// READ

/* const additionalData = new GraphQLObjectType({
  name: "AdditionalData",
  fields: {
    birthDate: {
      type: GraphQLString,
    },
    fullName: {
      type: GraphQLString,
    },
    nationality: {
      type: GraphQLString,
    },
  },
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => {
    return {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      author: { type: GraphQLString },
      pages: { type: GraphQLInt },
      additional: {
        type: additionalData,
        resolve: (obj, args, context, info) => {
          console.log(context);

          return {
            birthDate: new Date().toDateString(),
            fullName: "John Doe",
            nationality: "German",
          };
        },
      },
    };
  },
}); */

const userType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    created_at: {
      type: GraphQLString,
      resolve(obj, arg) {
        return new Date(Number.parseInt(obj.created_at)).toISOString();
      },
    },
  }),
});

const fileType = new GraphQLObjectType({
  name: "FileType",
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    username: {
      type: GraphQLString,
      resolve(obj) {
        return mockUserData.find((e) => obj.user_id === e.id).username;
      },
    },
    title: { type: GraphQLString },
    tag: { type: GraphQLString },
    file_size: { type: GraphQLFloat },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    created_at: {
      type: GraphQLString,
      resolve(obj, arg) {
        return new Date(Number.parseInt(obj.created_at)).toISOString();
      },
    },
  }),
});

const commentType = new GraphQLObjectType({
  name: "CommentType",
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    username: {
      type: GraphQLString,
      resolve(obj) {
        return mockUserData.find((e) => obj.user_id === e.id).username;
      },
    },
    comment: { type: GraphQLString },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    created_at: {
      type: GraphQLString,
      resolve(obj, arg) {
        return new Date(Number.parseInt(obj.created_at)).toISOString();
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      User: {
        type: new GraphQLList(userType),
        resolve(obj, arg) {
          return mockUserData;
        },
      },
      Files: {
        type: new GraphQLList(fileType),
        resolve(obj, arg) {
          return mockFiles;
        },
      },
      Comments: {
        type: new GraphQLList(commentType),
        resolve(obj, arg) {
          return mockComments;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "RootMutation",
    fields: {
      name: { type: GraphQLString },
    },
  }),
});

module.exports = { schema };
