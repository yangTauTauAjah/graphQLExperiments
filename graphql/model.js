const { GraphQLObjectType } = require("graphql");
const {
  UserSchema: QueryUser,
  FileSchema: QueryFile,
  CommentSchema: QueryComment
} = require("./query.js");
const {
  UserSchema: MutateUser,
  FileSchema: MutateFile,
  CommentSchema: MutateComment
} = require("./mutation");

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    User: QueryUser,
    Files: QueryFile,
    Comments: QueryComment
  }
});

const mutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    User: MutateUser,
    Files: MutateFile,
    Comments: MutateComment
  }
});

module.exports = { query, mutation };
